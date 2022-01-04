const express= require("express");
const authController= require('../controllers/auth.js');
const router= express.Router();
const mysql=require("mysql");
const cart= require('../controllers/cart.js');
const e = require("express");


const db= mysql.createConnection({
    host: process.env.DATABASE_HOST, /*or ip address of server*/
    user: process.env.DATABASE_USER,
    password:process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

router.get('/', authController.isLoggedin,authController.sellerisLoggedin, (req,res)=>{
    if(req.user){
        
        db.query('select * from products order by productid DESC;',(error,result)=>{
            console.log(result);
            if(error){
                console.log(error);
            }
            else{
                res.render('index',{
                    user:req.user,
                    dbres:result
                });
            }
        })
    }
    else if(req.seller){
        res.render('index',{
            seller:req.seller
        });
    }
    else{
        db.query('select * from products order by productid DESC;',(error,result)=>{
            console.log(result);
            if(error){
                console.log(error);
            }
            else{
                res.render('index',{
                    dbres:result
                });
            }
        })
    }
})

router.get('/register',(req,res)=>{
    res.render('register');
})

router.get('/sellerregister',(req,res)=>{
    res.render('sellerregister');
})

router.get('/login',(req,res)=>{
    res.render('login');
})

router.get('/seller',(req,res)=>{
    res.render('seller');
})

router.get('/products/:pid',authController.isLoggedin,(req,res,next)=>{

    var pid=req.params.pid;
    if(req.user){
        var uid= req.user.id;
        var event= 'product_clicked';
        
        db.query('insert into tracker set?', {productid:pid,event:event,timestamp:Date.now(),userid:uid},(error,result)=>{
            if(error){
                console.log(error);
            }
            else{
                db.query('select * from products where productid=?',[pid],(error,result)=>{
                    console.log(result);
                    if(error){
                        console.log(error);
                    }
                    else{
                        db.query('SELECT * FROM `3pl` ',(error,resu)=>{
                            console.log('couriers are',resu);
                            
                            if(error){
                                console.log(error);
                            }
                            else{
                                res.render('pdetails',{
                                    
                                    user:req.user,
                                    dbres:result,
                                    courier:resu
                                });
                            }
                        })
                        
                    }
                })
            }
        } )
    }
    else{
        var uid= 2;
        var event= 'product_clicked';
        var date;
        date = new Date();
        date = date.getUTCFullYear() + '-' +
            ('00' + (date.getUTCMonth()+1)).slice(-2) + '-' +
            ('00' + date.getUTCDate()).slice(-2) + ' ' + 
            ('00' + date.getUTCHours()).slice(-2) + ':' + 
            ('00' + date.getUTCMinutes()).slice(-2) + ':' + 
            ('00' + date.getUTCSeconds()).slice(-2);
        db.query('insert into tracker set?', {productid:pid,event:event,timestamp:date,userid:uid},(error,result)=>{
            if(error){
                console.log(error);
            }
            else{
                db.query('select * from products where productid=?',[pid],(error,result)=>{
                    console.log(result);
                    if(error){
                        console.log(error);
                    }
                    else{
                        res.render('pdetails',{
                            dbres:result
                        });
                    }
                })
            }
        } )
    }

})

router.get('/checkout',authController.isLoggedin,(req,res)=>{
    res.render('checkout');
})

router.get('/payment',authController.isLoggedin);

router.get('/custprofile',authController.isLoggedin,(req,res)=>{ /*Next implies to continue this rendering part*/
    if(req.user){
        db.query('select * from products order by productid desc;',(error,result)=>{
            console.log(result);
            if(error){
                console.log(error); 
            }
            else{
                res.render('custprofile',{
                    user:req.user,
                    
                });
            }
        })
        
    }
    else{
        res.redirect('/login')
    }
    
})

router.get('/payres', authController.sellerisLoggedin,authController.getcarttopaymentres, (req,res)=>{
    res.render('payres');
})

router.get('/sellerprofile', authController.sellerisLoggedin,(req,res)=>{ /*Next implies to continue this rendering part*/
    if(req.seller){
        db.query('select * from products where sellerid=?',[req.seller.id],(error,results)=>{
            console.log(results);
            if(error){
                console.log(error); 
            }
            else{
                res.render('sellerprofile',{
                    seller:req.seller,
                    dbres:results
                });
            }
        })

    }
    
    else{
        res.redirect('/seller')
    }
    
})

router.get('/sellerproducts',authController.sellerisLoggedin,(req,res)=>{ /*Next implies to continue this rendering part*/
    if(req.seller){
        res.render('sellerproducts',{
            seller:req.seller,
            
        });
    }
    else{
        res.redirect('/seller')
    }
    
})



router.get('/addproduct',authController.sellerisLoggedin,(req,res)=>{ /*Next implies to continue this rendering part*/
    if(req.seller){
        res.render('addproduct',{
            seller:req.seller
        });
    }
    else{
        res.redirect('/seller')
    }
    
})


router.get('/cart',authController.isLoggedin,authController.getCourier,authController.getcart);




module.exports=router;