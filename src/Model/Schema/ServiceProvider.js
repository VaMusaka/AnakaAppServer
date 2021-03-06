const { Schema, model, ObjectId } = require('mongoose')

//USER SCHEMA
const ServiceProviderSchema = new Schema(
  {
    user: { type: ObjectId, ref: 'User' },
    name: { type: String, required: true },
    business_type: { type: String, required: true, enum: ['individual', 'company'], default: 'individual' },
    description: { type: String, required: true },
    headline: { type: String },
    stripeAccountId: { type: String, required: true },
    address: {
      line1: { type: String, isRequired: true },
      line2: { type: String },
      city: { type: String, isRequired: true },
      county: { type: String, isRequired: true },
      country: { type: String, isRequired: true },
      postal_code: { type: String, isRequired: true },
      longitude: { type: String },
      latitude: { type: String },
    },
    primaryLocation: { type: String, isRequired: true },
    primaryServiceCategories: [{ type: ObjectId, ref: 'ServiceCategory' }],
    vatId: { type: String },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
)

module.exports = model('ServiceProvider', ServiceProviderSchema)
