const User = require('../models/User');
const Combi = require('../models/Combi');
const Rule = require('../models/Rule');
const axios = require('axios');
const api_key = 'aed92f40d1a0949427f858fe9679b98a';


function saatAyarla(saatStr) {
    const saatBolumleri = saatStr.split(':');
    const saat = new Date();
    saat.setHours(parseInt(saatBolumleri[0]), parseInt(saatBolumleri[1]));
    return saat;
}
// Şu anki zamanı sadece saat ve dakika olarak ayarla
function simdikiZamaniAyarla() {
    const simdikiZaman = new Date();
    return new Date(simdikiZaman.getFullYear(), simdikiZaman.getMonth(), simdikiZaman.getDate(), simdikiZaman.getHours(), simdikiZaman.getMinutes(), 0, 0);
}

exports.showAllUsers = async (req, res, next) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        next(error);
    }
};

exports.checkStatus = async (req, res, next) => {
    try {
        
    
        //Öncelikle Son Değişiklik Yapılalı 1 Saat Geçmiş mi ? Kontrol Edelim.
        //Eğer 1 saat geçmemişse aynı durumu korumamız gerekiyor.
        const combi = await Combi.findOne({where : {UserId:req.user.userid}});
        if(combi){

            let address;
            if(req.user.province != "" && req.user.province != null){
                address = req.user.province+','+req.user.city+',tr';
            }else{
                address = req.user.city+',tr';
            }
            
            //İlk Öncelikle Hava Durumu Bilgilerini Çekelim.
            let data = await axios.get('https://api.openweathermap.org/data/2.5/weather', {
            params: {
                q: address,
                appid: api_key,
                units: 'metric'
            }
            });
            //Hava Durumu Özellikleri
            let tempature = data.data.main.temp
            let humidity = data.data.main.humidity;
            let wind_speed = data.data.wind.speed;
            let weather = data.data.weather[0].main;


            let currentDate = new Date();
            let lastUpdateDate = new Date(combi.updatedAt);
            if(currentDate - lastUpdateDate > 1000*60*60){
                //1 saat geçmiş işlemleri başlatalım.
                
            
                

                //Kuralları çekelim
                const rules = await Rule.findAll({where : {UserId:req.user.userid}});
                let foundFlag = false;
                for (const rule of rules) {
                    switch (rule.rule) {
                        case 1:
                        
                            let val = parseFloat(rule.value);
                         
                            if(val > tempature){
                                //Tetik yer.
                            
                                let cUpdate = await Combi.update({
                                    reason:rule.id,
                                    shutdown:0
                                },{where:{UserId:req.user.userid}});
                                if(cUpdate){
                                 
                                    foundFlag = true;
                                    res.status(201).json({trigger:true,tempature,humidity,weather,...cUpdate});
                                }
                            }
                            break;
                        case 2:
                            let val2 = parseFloat(rule.value);
                            if(val2 < tempature){
                                //Tetik yer.
                                let cUpdate = await Combi.update({
                                    reason:rule.id,
                                    shutdown:0
                                },{where:{UserId:req.user.userid}});
                                if(cUpdate){
                                    foundFlag = true;
                                    res.status(201).json({trigger:true,tempature,humidity,weather,...cUpdate});
                                }
                            }
                        case 3:
                            let val3 = JSON.parse(rule.value);
                            const s_date = saatAyarla(val3["s_date"]);
                            const e_date = saatAyarla(val3["e_date"]);
                            const c_date = simdikiZamaniAyarla(); 
                            const controlRule = c_date >= s_date && c_date <= e_date;
                            if(controlRule){
                                //Tetik yer.
                                let cUpdate = await Combi.update({
                                    reason:rule.id,
                                    shutdown:0
                                },{where:{UserId:req.user.userid}});
                                if(cUpdate){
                                    foundFlag = true;
                                    res.status(201).json({trigger:true,tempature,humidity,weather,...cUpdate});
                                }
                            }
                            break;

                    }
                    if(foundFlag){
                        break;
                    }
                }
                //Değişiklik yok 1 saat geçmesine rağmen. Tetiklenen kural yok v.s bu yüzden kapatalım enerjiyi.
                if(!foundFlag){
                    if(combi.shutdown != 1){
              
                        //Tetik yer.AÇIKTI ARTIK KAPANACAK VE SAAT GÜNCELLENECECK
                        let cUpdate = await Combi.update({
                            reason:0,
                            shutdown:1
                        },{where:{UserId:req.user.userid}});
                        if(cUpdate){
                            res.status(201).json({cTime:new Date(),tempature,humidity,weather,wind_speed,...cUpdate});
                        }
                    }else{
                        //Zaten kapalıydı 1 saat geçmiş kurallardan tetiklenen yok kapalı devam edecek. Saat güncellemiyoruz.
                        res.status(201).json({cTime:new Date(),tempature,humidity,weather,wind_speed,...combi.dataValues});
                    }
                    
                }
                    
           
                //Hava durumu özellikleriin zaten aldım Kurallardan tetiklenen varmı bakalım :)


            }else{
                //1 SAAT GEÇMEMİŞ DOKUNMUYORUZ
                res.status(201).json({cTime:new Date(),tempature,humidity,weather,wind_speed,...combi.dataValues});
            }
        }else{
            const err = {msg:"Veritabanı hatası.Kullanıcıya ait veri bulunamadı."};
            throw err;
        }
        


        
    } catch (error) {
        next(error);
    }
};
exports.setRule = async (req, res, next) => {
    try {
        let { rule,value } = req.body;
        switch (rule) {
            case 1:
                if(typeof(value) != "number" && typeof(value) != "string"){
                    
                    const err = {msg:"Geçersiz value."};
                    throw err;
                }
                value = parseFloat(value);
                const rulesForUser = await Rule.findOne({
                    where: {
                      UserId: req.user.userid,rule: 1
                    }
                });
                if(!rulesForUser){
                    let newRule = await Rule.create({ 
                        rule, 
                        value,
                        UserId:req.user.userid
                    });
                    if(newRule){
                        res.status(201).json({msg:"Kural başarı ile tanımlandı.",rule,value});
                    }else{
                        const err = {msg:"Kural tanımlarken bir hata meydana geldi."};
                        throw err;
                    }
                }else{
                    let update = await Rule.update({rule,value},{where:{id:rulesForUser.id}});
                    if(update){
                        res.status(201).json({msg:"Kural başarı ile güncellendi.",rule,value});
                    }else{
                        const err = {msg:"Kural güncellenemedi."};
                        throw err;
                    }

                }
                break;
            case 2:
                if(typeof(value) != "number" && typeof(value) != "string"){
                    const err = {msg:"Geçersiz value."};
                    throw err;
                }
                value = parseFloat(value);
                const rulesForUser2 = await Rule.findOne({
                    where: {
                        UserId: req.user.userid,rule: 2
                    }
                });
                if(!rulesForUser2){
                    let newRule = await Rule.create({ 
                        rule, 
                        value,
                        UserId:req.user.userid
                    });
                    if(newRule){
                        res.status(201).json({msg:"Kural başarı ile tanımlandı.",rule,value});
                    }else{
                        const err = {msg:"Kural tanımlarken bir hata meydana geldi."};
                        throw err;
                    }
                }else{
                    let update = await Rule.update({rule,value},{where:{id:rulesForUser2.id}});
                    if(update){
                        res.status(201).json({msg:"Kural başarı ile güncellendi.",rule,value});
                    }else{
                        const err = {msg:"Kural güncellenemedi."};
                        throw err;
                    }
                    
                }
                break;
            
            case 3:
                if(typeof(value) != "object" && typeof(value) != "string"){
                    const err = {msg:"Geçersiz value."};
                    throw err;
                }
                if(value.hasOwnProperty('s_date') && value.hasOwnProperty('e_date') && Object.keys(value).length == 2){
                    value = JSON.stringify(value);
                    let newRule = await Rule.create({ 
                        rule, 
                        value,
                        UserId:req.user.userid
                    });
                    if(newRule){
                        value = JSON.parse(value);
                        res.status(201).json({msg:"Kural başarı ile tanımlandı.",rule,value});
                    }else{
                        const err = {msg:"Kural tanımlarken bir hata meydana geldi."};
                        throw err;
                    }
                }else{
                    const err = {msg:"Geçersiz value formatı.Dökümantasyonu inceleyiniz."};
                    throw err;
                }
                
                break;

            case 4:
                if(typeof(value) != "object" && typeof(value) != "array"){
                    const err = {msg:"Geçersiz value."};
                    throw err;
                }
                value = JSON.stringify(value);
                let newRule = await Rule.create({ 
                    rule, 
                    value,
                    UserId:req.user.userid
                });
                if(newRule){
                    res.status(201).json({msg:"Kural başarı ile tanımlandı.",rule,value});
                }else{
                    const err = {msg:"Kural tanımlarken bir hata meydana geldi."};
                    throw err;
                }
                break;
        
            default:
                const err = {msg:"Tanımlanmamış kural tipi.Dökümantasyonu inceleyiniz."};
                throw err;
                break;
        }
    } catch (error) {
        next(error);
    }
};
exports.getRule = async (req, res, next) => {
    try {
        const rule = await Rule.findAll({where:{UserId:req.user.userid}});
        if(rule){
            res.json(rule);
        }else{
            const err = {msg:"Veri çekmede hata."};
            throw err;
        }
        
    } catch (error) {
        next(error);
    }
};


exports.deleteRule = async (req, res, next) => {
    const { ruleId } = req.body;
    try {
        const rule = await Rule.destroy({where:{id:ruleId,UserId:req.user.userid}});
        if(rule){
            res.status(201).json({msg:"Kural silme başarılı.",ruleId});
        }else{
            const err = {msg:"Geçersiz Kural ID."};
            throw err;
        }
        
    } catch (error) {
        next(error);
    }
};