const UserModel = require("../model/UserModel");
const md5 = require('md5');
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


//  API for signup
exports.signup = async function(req, res) {
    try{
        let {username,password, email, mobile} = req.body; 
        let data = req.body;
        let UserData = await UserModel.findOne({ username: data.username }).lean();
        if (UserData) {
            res.status(403).json({message: "User already exist" })
        }
        let pass = await bcrypt.hash(req.body.password, 10);
        data.password = pass;
        let saveUser = new UserModel(data)
	    let User = await saveUser.save()
        let token = jwt.sign({ id: User._id },'secretkey' );
        User["token"] = token;
        let saveToken = await UserModel.findOneAndUpdate(
            { username: data.username},
            { $set: { token: token } },
            { new: true }
          );
        if(!User)
        throw new Error ("unable to add user");
        res.status(200).json({
            "User": User,
            "message": "signup successfully"
        })
    } catch(err) {
        res.status(500).send({"error": err})
    }
}


//  API for login
exports.login = async function(req, res) {
    try{
        let {username,password} = req.body; 
        let data = req.body;

        let UserData = await UserModel.findOne({ username: data.username }).lean();
        if (!UserData || UserData == null) throw { message: "User not exist" };

        let checkP = await bcrypt.compare(data.password, UserData.password);
        if (!checkP) throw { message: "Invalid Password" };
        
        let tokenData = jwt.sign({ id: UserData._id }, 'secretkey' );
        UserData["token"] = tokenData;
        res.status(200).send({
            "User": UserData,
            "message": "login successfully"
        })
    } catch(err) {
        res.status(500).send({"error": err})
    }
}