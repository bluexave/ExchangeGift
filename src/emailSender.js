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
        console.log(`[EmailSender] ⊘ No email for group "${group.getGroupName()}", skipping`);
        results.push({
          group: group.getGroupName(),
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
            for (const g of groups) {
              for (const m of g.getMembers()) {
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
          from: process.env.GMAIL_EMAIL || 'santababy@gmail.com',
          to: email,
          subject: `Sajor Santa Baby 2025 - ${group.getGroupName()}`,
          text: `Hello ${group.getGroupName()} group,\n\nHere are your babies:\n\n${assignmentLines}\n\nHappy gifting!\n\nGift Exchange Team`,
          html: `
            <h2>Sajor Santa Baby 2025</h2>
            <p>Hello ${group.getGroupName()} group,</p>
            <p>Here are your babies:</p>
            <pre>${assignmentLines}</pre>
            <p>Happy gifting!<br>Sajor Santa Baby Team</p>
          `
        };

        const result = await this.transporter.sendMail(mailOptions);
        
        console.log(`[EmailSender] ✓ Email sent to ${email} for group "${group.getGroupName()}"`);
        results.push({
          group: group.getGroupName(),
          email: email,
          status: 'sent',
          messageId: result.messageId
        });
      } catch (error) {
        console.error(`[EmailSender] ✗ Failed to send email to ${email} for group "${group.getGroupName()}": ${error.message}`);
        results.push({
          group: group.getGroupName(),
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
