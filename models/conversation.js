/**
 * Conversation
 *
 * @module      :: Model
 * @description :: Represent data model for the conversation among the users and trainers
 * @author      :: Saileela
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var  ConversationSchema = new Schema({  
  participants: [{ type: Schema.Types.ObjectId, ref: 'User'}]
});

module.exports = mongoose.model('Conversation', ConversationSchema);  