var express = require('express');
var router = express.Router();
const CartModel=require('../models/CartModel');
const RobotModel=require('../models/RobotModel');
const UserModel=require('../models/UserModel');
const PrincessModel=require('../models/PrincessModel');


// router.get('/',async(req,res)=>{
//     var userId=req.session.userId;
//     try{
//         var cart=await CartModel.findOne({userId:userId});
//         if(!cart){
//             return res.status(404).json({message:"Cart not found"})
//         }
//         var items = cart.items;
// var productOrder = [];
// var total = 0.0;

// for (var i = 0; i < items.length; i++) {
//     var product = items[i].product;
//     var quantity = items[i].quantity;

//     // Now you can use product to find the product information
//     var productInfor = (await PrincessModel.findById(product) || await RobotModel.findById(product));

//     if (productInfor) {
//         var price = productInfor.price;
//         var image = productInfor.image;
//         var id = productInfor._id;
//         total += price * quantity;
//         productOrder.push({
//             name: productInfor.name,
//             price: price,
//             image: image,
//             id: id,
//             quantity: quantity

//         });
//     }
// }
//         total=total.toFixed(2);
//         res.render('cart/index',{
//             productOrder:productOrder,
//             total:total,
//         })
//         console.log(productOrder,total);
//     }catch(err){
//         console.error(err);
//     }
// })
router.get("/", async (req, res) => {
  var userId = req.session.userId;
  let total = 0.0;

  // Kiểm tra xem người dùng đang đăng nhập có là admin hay không
  if (req.session.role) {
    try {
      // Lấy thông tin của tất cả tài khoản đã thêm sản phẩm vào giỏ hàng
      const allCarts = await CartModel.find();

      // Truy xuất thông tin sản phẩm từ các giỏ hàng
      const productCart = [];

      for (const cart of allCarts) {
        const customer = await UserModel.findById(cart.userId);
        const products = cart.items;

        for (const product of products) {
          const productInfo =
            (await PrincessModel.findById(product.product)) ||
            (await RobotModel.findById(product.product));

          if (productInfo) {
            const price = productInfo.price;
            const image = productInfo.image;
            const id = productInfo._id;
            const quantity = product.quantity;
            total += price * quantity;
            productCart.push({
              name: productInfo.name,
              price: price,
              image: image,
              id: id,
              quantity: quantity,
              total:total
              // customer: customer
              // ? ${customer.username}
              //   : "Unknown"
            });
          }
        }
      }
      total = total.toFixed(2);
      res.render("cart/admin", { productCart: productCart,total: total });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Lỗi khi lấy thông tin giỏ hàng" });
    }
  } else {
        try{
        var cart=await CartModel.findOne({userId: userId});
        if(!cart){
            return res.status(404).json({message:"Cart not found"})
        }
        var items = cart.items;
var productOrder = [];
let total = 0.0;

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
  }
});

// router.get('/admin',async(req,res)=>{

//   // try {
//   //   const allCarts = await CartModel.find();
//   //   const allProducts = [];
    
//   //   for (const cart of allCarts) {
//   //     for (const item of cart.items) {
//   //       const product = item.product;
//   //       const quantity = item.quantity;
        
//   //       const productInfo = await (
//   //         PrincessModel.findById(product) || RobotModel.findById(product)
//   //       );
        
//   //       if (productInfo) {
//   //         allProducts.push({
//   //           user: cart.userId, // You might want to store user information in the cart
//   //           productName: productInfo.name,
//   //           price: productInfo.price,
//   //           image: productInfo.image,
//   //           quantity: quantity,
//   //         });
//   //       }
//   //     }
//   //   }

//   //   res.render('cart/admin', { allProducts: allProducts });
//   // } catch (err) {
//   //   console.error(err);
//   //   // Handle errors
//   // }
// });

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
