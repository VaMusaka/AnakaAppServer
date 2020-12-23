const { Schema, model, ObjectId } = require('mongoose')

//USER SCHEMA
const Service = new Schema(
  {
    name: { type: 'String', required: true },
    parent: { type: ObjectId },
    description: { type: 'String', required: true },

    active: { type: 'Boolean', required: true, default: true },
    featured: { type: 'Boolean', required: true, default: false },
    cover: { type: 'String' },
    thumbnail: { type: 'String' },
  },
  { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } }
)

module.exports = model('Service', Service)
