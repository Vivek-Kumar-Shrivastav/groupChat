const jwt = require('jsonwebtoken');
async function authorization (req,res,next){
    try {
        
        let token =req.header('authorization');
        let {userId,userName,mob} = await  jwt.verify(token,process.env.TOKEN_KEY);
        req.body.userId = userId;
        req.body.userName = userName;
        req.body.mob = mob;
          next();
        
    } catch (error) {
        console.log(error);
    }
}

module.exports = authorization;