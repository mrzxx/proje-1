const User = require('../models/User');
const Combi = require('../models/Combi');

const register = async(req, res,next) => {
    try {
        const { username, password,city,province } = req.body;
        const user = await User.findOne({where: {username:username}})
        if(!user){
            const newUser = await User.create({ 
                username, 
                password,
                city,
                province
            });
            if(newUser){
                const newCombi = await Combi.create({
                    shutdown:1,
                    reason:0,
                    UserId:newUser.id
                });
                res.json({ username:username,password:password,msg:"Kullanıcı başarı ile kaydedildi." });
            }
        }else{
            const err = {msg:"Bu kullanıcı zaten mevcut."};
            throw err;
        }
    } catch (error) {
        next(error);
    }
}
module.exports = register;