class EmailSender {
  static transporter = null;

  static initialize(smtpConfig = null) {
    if (smtpConfig) {
      try {
        const nodemailer = require('nodemailer');
        this.transporter = nodemailer.createTransport(smtpConfig);
      } catch (error) {
        console.warn('[EmailSender] Warning: nodemailer not installed, using console logging');
        this.setupConsoleTransport();
      }
    } else {
      this.setupConsoleTransport();
    }
  }

  static setupConsoleTransport() {
    this.transporter = {
      sendMail: async (mailOptions) => {
        console.log('[EmailSender] Would send email:');
        console.log(`  To: ${mailOptions.to}`);
        console.log(`  Subject: ${mailOptions.subject}`);
        console.log(`  Body: ${mailOptions.text.substring(0, 100)}...`);
        return { messageId: 'dev-mode' };
      }
    };
  }

  static async sendAssignments(groups) {
    if (!this.transporter) {
      this.initialize();
    }

    const results = [];

    for (const group of groups) {
      const email = group.getEmail();
      
      // Skip if no email provided
      if (!email) {
        console.log(`[EmailSender] ⊘ No email for family "${family.getFamilyName()}", skipping`);
        results.push({
          family: family.getFamilyName(),
          email: email,
          status: 'skipped',
          reason: 'No email provided'
        });
        continue;
      }

      try {
        // Build email content
        const members = group.getMembers();
        const assignmentLines = members
          .map(member => {
            const babyIndex = member.getBaby();
            // Find the recipient member by index
            let recipientName = `Member ${babyIndex}`;
            for (const f of families) {
              for (const m of f.getMembers()) {
                if (m.getIndex() === babyIndex) {
                  recipientName = m.getName();
                  break;
                }
              }
            }
            return `${member.getName()} - ${recipientName}`;
          })
          .join('\n');

        const mailOptions = {
          from: 'sajorgiftexchange@noreply.com',
          to: email,
          subject: `Gift Exchange Assignments - ${family.getFamilyName()}`,
          text: `Hello ${family.getFamilyName()} family,\n\nHere are your gift exchange assignments:\n\n${assignmentLines}\n\nHappy gifting!\n\nGift Exchange Team`,
          html: `
            <h2>Gift Exchange Assignments</h2>
            <p>Hello ${family.getFamilyName()} family,</p>
            <p>Here are your gift exchange assignments:</p>
            <pre>${assignmentLines}</pre>
            <p>Happy gifting!<br>Gift Exchange Team</p>
          `
        };

        const result = await this.transporter.sendMail(mailOptions);
        
        console.log(`[EmailSender] ✓ Email sent to ${email} for family "${family.getFamilyName()}"`);
        results.push({
          family: family.getFamilyName(),
          email: email,
          status: 'sent',
          messageId: result.messageId
        });
      } catch (error) {
        console.error(`[EmailSender] ✗ Failed to send email to ${email} for family "${family.getFamilyName()}": ${error.message}`);
        results.push({
          family: family.getFamilyName(),
          email: email,
          status: 'failed',
          error: error.message
        });
      }
    }

    return results;
  }
}

module.exports = EmailSender;
