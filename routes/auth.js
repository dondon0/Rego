const express= require("express");
const authController= require('../controllers/auth');
const router= express.Router();
const cart= require('../controllers/cart.js');

router.post('/register',authController.register);
router.post('/sellerregister',authController.sellerregister);
router.post('/addtoCart', authController.addtoCart);
router.post('/login', authController.login);
router.post('/seller', authController.sellerlogin);
router.post('/sellerprofile', authController.removeitem);
router.get('/logout', authController.logout);
router.post('/addproduct',authController.addproduct);
router.get('/address', authController.getCartPyment);
router.post('/payment',authController.addCour);





module.exports=router;