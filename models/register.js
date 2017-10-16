/**
 * Registration
 *
 * @module      :: Model
 * @description :: Represent data model for the user and trainer Registration
 * @author      :: Saileela
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var registerSchema = new Schema({
    user_name: {
        type: String
    },
    email: {
        type: String
    },
    mobile: {
        type: String
    },
    password: {
        type: String
    },
    login_type: {
        type: Number
    },
    ref_id: {
        type: Schema.Types.ObjectId
    },
    usertype: {
        type: String,
        enum: ["user", "trainer"]
    },
    status: {
        type: String,
        enum: ["active", "inactive"]
    },
    created_date: {
        type: Date,
        default: new Date()
    },
    updated_date: {
        type: Date,
        default: new Date()
    }
});

module.exports = mongoose.model('Register', registerSchema);