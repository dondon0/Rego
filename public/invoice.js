var token = document.querySelectorAll('#snap_token')[0].value;
var checkoutBtn = document.getElementById('pay');
const authController= require('../controllers/auth.js');
const router= express.Router();
const cart= require('../controllers/cart.js');

        
exports.load= (req,res,next)=>{
  res.render('payres',{
    cart:cart.getCart()
  })
}

function popup(token) {
    snap.pay(token, {
        onSuccess: function(result) {
          console.log("SUCCESS", result);
          
          document.location.href = 'http://localhost:5007/payres';
          
        },
        onPending: function(result) {
          console.log("Payment pending", result);
         
          
          document.location.href = 'http://localhost:5007/payres';
        },
        onError: function() {
          console.log("Payment error");
        }
      });
      // For more advanced use, refer to: https://snap-docs.midtrans.com/#snap-js
}



checkoutBtn.onclick = popup(token);
