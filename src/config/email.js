const EmailService = require('../services/emailService');

/**
 * Initialize email service with configuration
 */
function initializeEmail(gmailConfig) {
  const smtpConfig = {
    service: 'gmail',
    auth: {
      user: gmailConfig.email,
      pass: gmailConfig.password
    }
  };

  EmailService.initialize(smtpConfig);
  console.log(`[EmailService] Initialized with Gmail account: ${gmailConfig.email}`);
  
  return EmailService;
}

module.exports = {
  initializeEmail
};
