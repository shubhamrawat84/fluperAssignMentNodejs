var product = require ('../controller/productController');
var auth = require ('../middleware/jwtVerify');

exports.getRouter = (app) => {

    app.route("/product/addProduct").post(product.addProduct);
    app.route("/product/likeProduct").post(auth.verifyUser, product.likeProduct);
    app.route("/product/UnlikeProduct").post(auth.verifyUser, product.UnlikeProduct);
    app.route("/product/getWishlistProduct").get(auth.verifyUser, product.getWishlistProduct);
    app.route("/product/getLikedProduct").get( product.getLikedProduct);

    
}