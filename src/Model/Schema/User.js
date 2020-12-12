const { Schema, model } = require('mongoose')

//USER SCHEMA
const UserSchema = new Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    active: { type: Boolean, default: true, required: true },
    phone: { type: String, required: true, minLength: 11, maxLength: 15 },
    type: { type: String, required: true, default: 'customer', enum: ['customer', 'service provider'] },
    emailVerified: { type: Boolean, default: false },
    authToken: { type: String },
    changePassword: {
      passcode: { type: String },
      date: { type: Date },
    },
    emailVerification: {
      token: { type: String },
      date: { type: Date },
    },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
)

module.exports = model('User', UserSchema)
