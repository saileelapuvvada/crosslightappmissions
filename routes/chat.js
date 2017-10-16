/*
 * @chat API
 * @Author : Saileela puvvada
 */

var Conversation = require('../models/conversation');
var Message = require('../models/message');
var Register = require('../models/register')
var authenticate = require('../middleware/authentication.js')


//getting all conversations
var getConversations = function (req, res) {
    // Only return one message from each conversation to display as snippet
    Conversation.find({participants: req.user._id}).select('_id').exec(function (err, conversations) {
        if (err) {
            res.send({error: err});
        }
        // Set up empty array to hold conversations + most recent message
        var fullConversations = [];
        conversations.forEach(function (conversation) {
            Message.find({'conversationId': conversation._id}).sort('-createdAt').limit(1).populate({path: "author", select: "profile.firstName profile.lastName"}).exec(function (err, message) {
                if (err) {
                    res.send({error: err});
                    return next(err);
                }
                fullConversations.push(message);
                if (fullConversations.length === conversations.length) {
                    return res.status(200).json({conversations: fullConversations});
                }
            });
        });
    });
};

//view each conversation based on that paricular coversation id
var getConversation = function (req, res, next) {
    Message.find({conversationId: req.params.conversationId}).select('createdAt body author').sort('-createdAt').populate({path: 'author', select: 'profile.firstName profile.lastName'}).exec(function (err, messages) {
        if (err) {
            res.send({error: err});
            return next(err);
        }

        res.status(200).json({conversation: messages});
    });
};


//all the active users
var getUser = function (req, res, next) {
    Register.find({$and: [{usertype: "user"}, {status: "active"}]}).sort('created_date').exec(function (err, user_list) {
        if (err) {
            res.send({error: err});
            return next(err);
        }

        res.status(200).json({Users: user_list});
    });
};

//all the active trainers
var getTrainer = function (req, res, next) {
    Register.find({$and: [{usertype: "trainer"}, {status: "active"}]}).sort('created_date').exec(function (err, trainer_list) {
        if (err) {
            res.send({error: err});
            return next(err);
        }

        res.status(200).json({Trainers: trainer_list});
    });

};

//starting the new converstion by selecting the reciepients
var newConversation = function (req, res, next) {
    if (!req.params.recipient) {
        res.status(422).send({error: 'Please choose a valid recipient for your message.'});
        return next();
    }

    if (!req.body.composedMessage) {
        res.status(422).send({error: 'Please enter a message.'});
        return next();
    }

    var conversation = new Conversation({
        participants: [req.user._id, req.params.recipient]
    });

    conversation.save(function (err, newConversation) {
        if (err) {
            res.send({error: err});
            return next(err);
        }

        var message = new Message({
            conversationId: newConversation._id,
            body: req.body.composedMessage,
            author: req.user._id
        });

        message.save(function (err, newMessage) {
            if (err) {
                res.send({error: err});
                return next(err);
            }

            res.status(200).json({message: 'Conversation started!', conversationId: conversation._id});
            return next();
        });
    });
};


//sending reply back to the conversations
var sendReply = function (req, res, next) {
    var reply = new Message({
        conversationId: req.params.conversationId,
        body: req.body.composedMessage,
        author: req.user._id
    });

    reply.save(function (err, sentReply) {
        if (err) {
            res.send({error: err});
            return next(err);
        }

        res.status(200).json({message: 'Reply successfully sent!'});
        return(next);
    });
};

//delete the conversation 
//var deleteConversation = function (req, res, next) {
//    Conversation.findOneAndRemove({$and: [{'_id': req.params.conversationId}, {'participants': req.user._id}]}, function (err, removed) {
//        if (removed) {
//            Message.findOneAndRemove({'conversationId': req.params.conversationId}).exec(function (err, removed) {
//                if (removed) {
//                    res.status(200).json({message: 'Conversation removed!'});
//                    return next();
//                } else {
//                    res.send({error: "cannot able to delete messages"});
//                }
//            });
//        } else {
//            res.send({error: err});
//            return next(err);
//
//        }
//
//    });
//};
module.exports.route = function (router) {
    router.post('/reply/:conversationId', authenticate, sendReply);
    router.post('/new/:recipient', authenticate, newConversation);
    router.get('/view', getConversations);
    router.get('/userlist', getUser);
    router.get('/trainerlist', getTrainer);
    router.get('/viewpersonal/:conversationId', authenticate, getConversation);
//    router.delete('/deleteconversation/:conversationId', authenticate, deleteConversation);
};
