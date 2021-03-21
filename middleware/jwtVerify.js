const jwt = require("jsonwebtoken"); 

// verify access token 
exports.verifyUser = (req, res, next) => {
    let {access_token} = req.headers;
    if (!access_token)
        return res.status(403).send({ auth: false, message: "No token provided" });
    jwt.verify(access_token, 'secretkey' , function (err, decoded) {
        if (err)
        return res.status(500).send({ auth: false, message: "JWT has been expired" });
        req.userId = decoded.id;
        next();
    });
};

