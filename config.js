/* 
 *  Configuration
 * @module      :: Model
 * @description :: Represent data for the Default Configuration
 * @author      :: saileela puvvada
 */

module.exports = function () {
    return{
        MONGO_SERVER_PATH: "mongodb://localhost:27017/crosslight_appmissions",
        SERVER_PORT: '8080',
        JWT_TOKEN_SECRET:'crosslightappmissionssecrettoken'
    };
};