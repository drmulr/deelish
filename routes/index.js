const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');


const { catchErrors } = require('../handlers/errorHandlers');

router.get('/', catchErrors(storeController.getStores)); //also wrapping this due to async
router.get('/stores', storeController.getStores);
router.get('/add', storeController.addStore);
router.post('/add', catchErrors(storeController.createStore)); //wrap in helper function -- to catch errors. 
router.post('/add/:id', catchErrors(storeController.updateStore)); //wrap in helper function -- to catch errors. 
router.get('/stores/:id/edit', catchErrors(storeController.editStore)); 

module.exports = router;
