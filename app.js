// Express.js modülünü projeye dahil edin
const express = require('express');
const app = express();
const sequelize = require('./sequelize');
const routes = require('./routes');
const bodyParser = require('body-parser');
const cors = require('cors');
const auth = require('./utility/auth');
const login = require('./utility/login');
const register = require('./utility/register');


app.use(cors());
app.use(bodyParser.json());

//MODELS
const User = require('./models/User');
const Combi = require('./models/Combi');
const Rule = require('./models/Rule');
User.hasMany(Rule);
Rule.belongsTo(User);
User.hasOne(Combi);

//AUTH HERE
sequelize
  .sync({ force: false }) // force: true, tabloları her zaman yeniden oluşturur, false ise sadece oluşturmaz
  .then(async () => {
    let f = await User.findOne({where: {username:'mert'}});
    if(!f){
        let liste = [
            {
            "username": "mert",
            "password": "gucluturkiye2023",
            "city" : "Çanakkale"
            },
            {
                "username": "tagil",
                "password": "gucluturkiye2023",
                "city" : "Çanakkale"
            },
            {
                "username": "musti",
                "password": "gucluturkiye2023",
                "city" : "Çanakkale"
            }
        ];
        let liste2 = [
          {"shutdown":1,reason:0,UserId:1},
          {"shutdown":1,reason:0,UserId:2},
          {"shutdown":1,reason:0,UserId:3}
        ];
        const createdUsers = await User.bulkCreate(liste);
        const createdCombi = await Combi.bulkCreate(liste2);
    }
    
    console.log('Veritabanı tabloları başarıyla oluşturuldu.');

    const port = process.env.PORT || 3001;
    app.listen(port, () => {
      console.log(`Sunucu ${port} portunda çalışıyor.`);
    });
  })
  .catch((error) => {
    console.error('Veritabanı tablolarını oluşturma hatası:', error);
  });


  
app.post('/login',login);
app.post('/register',register);
app.use(auth);
app.use(routes);


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({errorMessage:err.msg,errorSystemMessage:err.message});
});
