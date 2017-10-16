/**
 * login
 *
 * @module      :: Model
 * @description :: Represent data model for the login entries
 * @author      :: Saileela
 */

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var LoginSchema = new Schema({
    user_name: {
        type: String

    },
    password: {
        type: String
    },
    status: {
        type: String,
        enum: ["Active", "Inactive"]
    },
    ref_id: {
        type: Schema.Types.ObjectId
    },
    user_type: {
        type: String,
        enum: ["user", "trainer"]
    },
    created_date: {
        type: Date
    },
    updated_date: {
        type: Date
    }
});
module.exports = mongoose.model('login', LoginSchema);


