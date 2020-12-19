module.exports = {
  VerifyEmailTemplate: ({ email, firstname, verificationToken }) => {
    return {
      to: email,
      dynamic_template_data: {
        subject: 'Please verify your email.',
        title: 'Please verify your email.',
        firstname,
        message: `Hi ${firstname}, \n Your verification code is ${verificationToken}, \n Please use this to activate your Anaka account.`,
      },
    }
  },
  WelcomeEmailTemplate: ({ email, firstname }) => {
    return {
      to: email,
      dynamic_template_data: {
        subject: 'Welcome to Anaka',
        title: 'Account Activated',
        firstname,
        message: `Your account is now active, welcome to the Anaka Family,...... [Any more information to welcome users]`,
      },
    }
  },
  PasswordResetEmailTemplate: ({ email, firstname, changePassword: { passcode } }) => {
    return {
      to: email,
      dynamic_template_data: {
        subject: 'Password Reset',
        title: 'Password Reset',
        firstname,
        message: `You have requested a  password reset, your password reset code is ${passcode}. \n This is valid for only 2 hours, if you have not requested a password reset please ignore this email.`,
      },
    }
  },
}
