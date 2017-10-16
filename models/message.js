/**
 * message
 *
 * @module      :: Model
 * @description :: Represent data model for the messages
 * @author      :: Saileela
 */

var mongoose = require('mongoose'),  
Schema = mongoose.Schema;

var MessageSchema = new Schema({  
  conversationId: {
    type: Schema.Types.ObjectId,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
},
{
  timestamps: true // Saves createdAt and updatedAt as dates. createdAt will be our timestamp.
});

module.exports = mongoose.model('Message', MessageSchema);  