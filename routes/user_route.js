var user = require ('../controller/userController');

exports.getRouter = (app) => {

    app.route("/user/signup").post( user.signup);
    app.route("/user/login").post( user.login);

    
}