module.exports = {
  VerifyEmailTemplate: ({ email, firstname, verificationToken }) => {
    return {
      to: email,
      subject: 'Please verify your email.',
      dynamic_template_data: {
        title: 'Please verify your email.',
        firstname,
        message: `Hi ${firstname}, \n Your verification code is ${verificationToken}, \n Please use this to activate your Anaka account.`,
        // button_text: 'Verify',
        // button_uri: `${baseUri}/users/verify/${verificationToken}`,
      },
    }
  },
  WelcomeEmailTemplate: ({ email, firstname }) => {
    return {
      to: email,
      subject: 'Welcome to Anaka',
      dynamic_template_data: {
        title: 'Account Activated',
        firstname,
        message: `Your account is now active, welcome to the Anaka Family,...... [Any more information to welcome users]`,
        // button_text: 'Verify',
        // button_uri: `${baseUri}/users/verify/${verificationToken}`,
      },
    }
  },
  PasswordResetEmailTemplate: ({ email, firstname, changePassword: { token } }) => {
    return {
      to: email,
      subject: 'Password Reset',
      dynamic_template_data: {
        title: 'Password Reset',
        firstname,
        message: `You have requested a  password reset, your password reset code is ${token}. \n This is valid for only 2 hours, if you have not requested a password reset please ignore this email.`,
        // button_text: 'Verify',
        // button_uri: `${baseUri}/users/verify/${verificationToken}`,
      },
    }
  },
}
