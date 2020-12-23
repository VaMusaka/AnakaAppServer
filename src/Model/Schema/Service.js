const { Schema, model, ObjectId } = require('mongoose')

//USER SCHEMA
const Service = new Schema(
  {
    name: { type: 'String', required: true },
    user: { type: ObjectId, ref: 'User', required: true },
    serviceProvider: { type: ObjectId, ref: 'ServiceProvider', required: true },
    description: { type: 'String' },
    price: { type: 'Number', default: 2.99, required: true },
    extras: [{ type: 'String' }],
    serviceCategory: { type: ObjectId, ref: 'ServiceCategory', required: true },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
)

module.exports = model('Service', Service)
