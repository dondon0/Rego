const mysql=require("mysql");
const db= mysql.createConnection({
    host: process.env.DATABASE_HOST, /*or ip address of server*/
    user: process.env.DATABASE_USER,
    password:process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});
let cart=null;
let seller=null;
module.exports=class Cart{

    static save(product,amt,user,courier,userprov){
        if(cart===null){
            cart={products:[],totalPrice:0};
            seller={sellerid:[]};
        }
        const existingprodindex=cart.products.findIndex(x=>x.productid==product.productid);
        
        if(existingprodindex>=0){
            const existingProduct=cart.products[existingprodindex];
            existingProduct.qty +=1;
            existingProduct.nowamt -=1;
            existingProduct.subtotal = existingProduct.qty*existingProduct.price;
        }
        else{
            var k;
            product.qty=amt;
            product.nowamt=product.stock-amt;
            product.test=existingprodindex;
            product.subtotal = product.qty*product.price;
            db.query('select * from sellers where id=?',[product.sellerid],(error,result)=>{
                
                if(error){
                    console.log(error);
                }
                else{
                    product.from=result[0].province;
                }
                
            })
            product.destination=userprov;
            product.defdeliveryprice=0;
            product.weight=1;
            product.courier=courier;
            product.buyer=user;
            if(product.courier=='JNE'){
                product.defdeliveryprice+=8000;
            }
            if(product.courier=='TIKI'){
                product.defdeliveryprice+=8000;
            }
            else if(product.courier=='Si Cepat'){
                product.defdeliveryprice+=11000;
            }
            
            if(product.destination !== product.from){
                product.defdeliveryprice*=2;
                product.loc='not same place';
            }
            else{
                product.defdeliveryprice*=1;
                product.loc=' same place';
            }
            cart.products.push(product);
            seller.sellerid.push(product.sellerid)
        }
        cart.totalPrice+=product.price

    }



    static getCart(){ 
        return cart;
    }
    
    static getSeller(){
        return seller;
    }

    static saveCourier(courier){
        // for(var i=0;i<cart.products.length;i++){
        //     if (cart.products[i])
        // }
    }

    static addcour(products,courier){
        let a=this.getCart();
        for(let i=0;i<a.products.length;i++){
           products.courier=courier;
           if(products.courier=='JNE'){
            products.defdeliveryprice+=8000;
            }
            if(products.courier=='TIKI'){
                products.defdeliveryprice+=8000;
            }
            else if(products.courier=='Si Cepat'){
                products.defdeliveryprice+=11000;
            }
            if(products.destination !== products.from){
                products.defdeliveryprice*=2;
                products.loc='not same province';
            }
            else{
                products.defdeliveryprice*=1;
                products.loc='same province';
            }
            cart.totalPrice+=products.defdeliveryprice*=1
        }
    }
} 

