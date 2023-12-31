const jwt = require('jsonwebtoken');
const SECRET_KEY = 'fecr-i ati -> geleceğin şafağı';
const User = require('../models/User');

const login = async(req, res,next) => {
    try {
        console.log(req.body);
        const username = req.body.username;
        const password = req.body.password;
        const user = await User.findOne({where: {username:username,password:password}})
        if(!user){
            const err = {msg:"Hatalı giriş bilgileri!",statusCode:401};
            throw err;
        }else{
            let userInfo = {
                userid:user.id,
                username:user.username,
                city:user.city,
                province:user.province
            };
            const accessToken = jwt.sign(userInfo, SECRET_KEY,{expiresIn:'48h'});
            res.json({ accessToken: accessToken });
        }
    } catch (error) {
        next(error);
    }
}
module.exports = login;