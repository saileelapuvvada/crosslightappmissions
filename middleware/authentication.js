/* 
 * Authentication
 *
 * @module      :: Middleware
 * @description :: Represent middleware authentication for verification
 * @author      :: Saileela
 */
var Login = require('../models/login');
var Register = require('../models/register');
var jwt = require('jwt-simple');
var mongoose = require('mongoose');
var config = require('../config')();
module.exports = function (req, res, next) {

    // If request has auth header
    var bearerToken;
    var bearerHeader = req.headers.authorization;
    if (typeof bearerHeader !== 'undefined') {
        var bearer = bearerHeader;
        try {
            bearerToken = jwt.decode(bearer, config.JWT_TOKEN_SECRET);
        } catch (err) {
            console.log("Invalid token");
            res.send(401, {error: 'invalid Token'});
        }
        console.log(bearerToken);
        Login.findOne({ref_id: mongoose.Types.ObjectId(bearerToken.loginid)}, function (err, user) {
            console.log(user);
            if (err || !user) {
                console.log("Authentication failure !!");
                res.send(401, {error: 'Unauthorized access/'});
            } else {
                if (user.user_type === "user") {
                    Register.findById({_id: user.ref_id}).exec(function (err, user) {
                        console.log(user);
                        if (user) {
                            console.log(user);
                            req.user = user;
                            next();
                        } else
                        {
                            res.send(401, {error: 'Unauthorized access..'});
                        }
                    });
                } else if (user.user_type === "trainer") {
                    Register.findById({_id: user.ref_id}).exec(function (err, trainer) {

                        if (trainer) {
                            console.log(trainer);
                            req.trainer = trainer;
                            req.user = user;
                            next();
                        } else
                        {
                            res.send(401, {error: 'Unauthorized access'});
                        }
                    });
                } else
                {
                    res.send(401, {error: 'Unauthorized access,'});
                }
            }
        });
    } else {
        res.statusCode = 403;
        res.send({error: 'Forbidden access'});
    }
};

