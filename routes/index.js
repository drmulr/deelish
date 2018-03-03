const express = require('express');
const router = express.Router();
const storeController = require('../controllers/storeController');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');

const { catchErrors } = require('../handlers/errorHandlers');

router.get('/', catchErrors(storeController.getStores)); //also wrapping this due to async
router.get('/stores', storeController.getStores);
router.get('/add', storeController.addStore);
router.post('/add', storeController.upload, catchErrors(storeController.resize), catchErrors(storeController.createStore)); //wrap in helper function -- to catch errors. 
router.post('/add/:id', storeController.upload, catchErrors(storeController.resize), catchErrors(storeController.updateStore)); //wrap in helper function -- to catch errors. 
router.get('/stores/:id/edit', catchErrors(storeController.editStore)); 



router.get('/store/:slug', catchErrors(storeController.getStoreBySlug));


router.get('/tags', catchErrors(storeController.getStoresByTag));
router.get('/tags/:tag', catchErrors(storeController.getStoresByTag));


//Begin auth
router.get('/login', userController.loginForm); 
router.get('/register', userController.registerForm);

// Validate registration data
// Register user
// Log them in
router.post('/register', 
    userController.validateRegister,
    userController.register,
    authController.login
);

module.exports = router;
