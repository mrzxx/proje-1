const express = require('express');
const router = express.Router();
const MainController = require('./controllers/Main');

router.get('/users', MainController.showAllUsers);
router.get('/check', MainController.checkStatus);
//RULES
router.post('/setrule', MainController.setRule);
router.get('/getrule', MainController.getRule);
router.post('/deleterule', MainController.deleteRule);


module.exports = router;   