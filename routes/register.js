/*
 * @Registeration API
 * @Author : Saileela puvvada
 */

var Register = require('../models/register');
var Login = require('../models/login');
var jwt = require('jwt-simple');
var config = require('../config')();
var moment = require('moment');
//registeration api for the customer
registerCustomer = function (req, res) {
    Register.findOne({mobile: req.body.mobile}).exec(function (err, customer_details) {
        if (customer_details) {
            res.send({status: "failure", message: "User already exist"});
        } else {
            var user = new Register({
                user_name: req.body.name,
                email: req.body.email,
                usertype:req.body.usertype,
                mobile: req.body.mobile,
                password: req.body.password,
                status: "active"
            });
            user.save(function (err, saved_user) {
                if (saved_user) {
                     var login = new Login({
                                        user_name: req.body.name,
                                        password: req.body.password,
                                        user_type: req.body.usertype,
                                        status: "Active",
                                        ref_id: saved_user._id,
                                        created_on: new Date()
                                    });
                                    login.save(function(err, login_save){
                                        if(login_save){
                                            console.log(login_save);
                                             res.send({status: "success", message: "successfully register"});
                                        }else{
                                             res.send({status: "failure", message: "failed to register"});
                                        }
                                    });
                   
                } else {
                    console.log("error in saving : " + err);
                    res.send({status: "failure", message: "error in saving"});
                }
            });
        }
    });
};




//login user by email or mobile
login = function (req, res) {
    var login_query = {};
    if (req.body.email !== undefined && req.body.email !== "")
    {
        login_query = {"email": req.body.email, "password": req.body.password};
    } else if (req.body.mobile !== undefined && req.body.mobile !== "")
    {
        login_query = {"mobile": req.body.mobile, "password": req.body.password};
    }

    if (login_query["password"] !== undefined)
    {
        Register.findOne(login_query).exec(function (err, login_details) {
            if (login_details) {
                 var token = jwt.encode({loginid: login_details._id, exp: moment(), userid: login_details.ref_id, usertype: login_details.user_type}, config.JWT_TOKEN_SECRET);
                res.send({status: "success", auth_token: token, usertype: login_details.usertype, _id: login_details._id});
          
               
            } else {
                console.log(err);
                res.send({status: "failure", message: "User not register"});
            }
        });
    } else {
        res.send({status: "failure", message: "Password not match"});
    }
};

getAllDetails = function (req, res) {
    Register.find().exec(function (err, customer_details) {
        if (customer_details) {
            res.send({status: "success", records: customer_details});
        } else {
            console.log("data not found : " + err);
            res.send({status: "failure", message: "data not found"});
        }
    });
};

//check user is online or not if it is yes set as 0 it is no set as 1
userCheckOnline = function (req, res) {
    Register.findOne({$or: [{login_type: 0, mobile: req.params.mobile}, {login_type: 0, email: req.params.email}]}).exec(function (err, login_register) {
        console.log(login_register);
        if (login_register) {
            res.send({status: "success", message: "User is in Online"});
        } else {
            console.log(err);
            res.send({status: "failure", message: "User is in offline"});
        }
    });
};

// if logout the customer then login_type is 1
customerLogout = function (req, res) {
    Register.findOne({login_type: 0, mobile: req.params.mobile}).exec(function (err, login_register) {
        console.log(login_register);
        if (login_register) {
            login_register.login_type = 1;
            login_register.save(function (err, saved_data) {
                if (saved_data) {
                    console.log("successfully saved");
                } else {
                    console.log("error in saving");
                }
            });
            res.send({status: "success", message: "Successfully logout"});
        } else {
            console.log(err);
            res.send({status: "failure", message: "error in logout"});
        }
    });
};

module.exports.route = function (router) {
    router.post('/register', registerCustomer);
   router.get('/registers', getAllDetails);
    router.post('/login', login);
    router.get('/check/online/:mobile/:email', userCheckOnline);
    router.get('/logout/:mobile', customerLogout);
};