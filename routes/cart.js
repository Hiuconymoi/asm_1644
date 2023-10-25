var express = require('express');
var router = express.Router();
const CartModel=require('../models/CartModel');
const RobotModel=require('../models/RobotModel');
const UserModel=require('../models/UserModel');
const PrincessModel=require('../models/PrincessModel');


router.get('/',async(req,res)=>{
    var userId=req.session.userId;
    try{
        var cart=await CartModel.findOne({userId:userId});
        if(!cart){
            return res.status(404).json({message:"Cart not found"})
        }
        
        // var items=cart.items;
        // var ID=items.map((product)=>product.product);
        // var productOrder=[];
        // var total=0.0;

        // //Tao mot doi tuong luu so luong tung san pham
        // // var quantities={};
        // for(var i=0; i<ID.length; i++){
        //     var id=ID[i];
        //     var productInfor=(await PrincessModel.findById(id)|| await RobotModel.findById(id));
        //     if(productInfor){
        //         var price=productInfor.price;
        //         var image=productInfor.image;
        //         var id=productInfor._id;
        //         var quantity=ID[i].quantity;
        //         total+=price*quantity;
        //         productOrder.push({
        //             name:productInfor.name,
        //             price:price,
        //             image:image,
        //             id:id,
        //             quantity:quantity
        //         })
        //     }
        // }
        var items = cart.items;
var productOrder = [];
var total = 0.0;

for (var i = 0; i < items.length; i++) {
    var product = items[i].product;
    var quantity = items[i].quantity;

    // Now you can use product to find the product information
    var productInfor = (await PrincessModel.findById(product) || await RobotModel.findById(product));

    if (productInfor) {
        var price = productInfor.price;
        var image = productInfor.image;
        var id = productInfor._id;
        total += price * quantity;
        productOrder.push({
            name: productInfor.name,
            price: price,
            image: image,
            id: id,
            quantity: quantity
        });
    }
}
        total=total.toFixed(2);
        res.render('cart/index',{
            productOrder:productOrder,
            total:total,
        })
        console.log(productOrder,total);
    }catch(err){
        console.error(err);
    }
})

router.post("/", async (req, res) => {
    var products = req.body.id;
    var quantities = req.body.quantity;
    const userID = req.session.userId;
    const cart = await CartModel.findOne({ userId: userID });
    if (!cart) {
      const newCart = new CartModel({
        userId: userID,
        items: [{ product: products, quantity: quantities }],
      });
      await newCart.save();
    } else {
      // Nếu giỏ hàng đã tồn tại, kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
      var existingProduct = cart.items.find(
        (product) => product.product == products
      );
  
      if (existingProduct) {
        // Nếu sản phẩm đã tồn tại, cập nhật số lượng
        existingProduct.quantity =
          parseInt(existingProduct.quantity) + parseInt(quantities);


      } else {
        // Nếu sản phẩm chưa tồn tại, thêm sản phẩm mới vào giỏ hàng
        cart.items.push({ product: products, quantity: quantities });
      }
      // const robot=await RobotModel.findById(products);
      //   if(robot){
      //     robot.quantity-=quantities;
      //     await robot.save();
      //   }
      //   const princess=await PrincessModel.findById(products);
      //   if(princess){
      //     princess.quantity-=quantities;
      //     await princess.save();
      //   }
  
      await cart.save();
    }
    console.log(cart);
    res.redirect("/cart");
  });

router.get('/delete/:id',async(req,res)=>{
  var id=req.params.id;
    const userID = req.session.userId;
    const cart = await CartModel.findOne({ userId: userID });
    if(!cart){
        console.error("Cart not found");
    }
    var product= cart.items.findIndex((product)=>product.product==id);
    if(product===-1){
      console.error("Product not found");
    }else{
      cart.items.splice(product,1);
      cart.save();
    }
    res.redirect("/cart");
})


module.exports = router;
