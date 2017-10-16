/** 
 *
 * @module      :: Route Index
 * @description :: Routing for all the API's
 * @author      :: Saileela puvvada
 */
var router = require('express').Router();
require('./register').route(router);

require('./chat').route(router);
// require('./socketEvents');  
module.exports = router;

