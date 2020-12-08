const { Schema, model, ObjectId } = require('mongoose')

//USER SCHEMA
const CustomerSchema = new Schema(
  {
    user: { type: ObjectId, ref: 'User' },
    stripeCustomerId: { type: String, required: true },
    address: {
      line1: { type: String, isRequired: true },
      line2: { type: String },
      city: { type: String, isRequired: true },
      county: { type: String, isRequired: true },
      country: { type: String, isRequired: true },
      postcode: { type: String, isRequired: true },
      longitude: { type: String },
      latitude: { type: String },
    },
    primaryLocation: { type: String },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
)

module.exports = model('Customer', CustomerSchema)
