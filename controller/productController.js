const ProductModel = require("../model/ProductModel");
const Joi = require('joi');
const UserModel = require("../model/UserModel");


//  API for add prodiuct
exports.addProduct = async function(req, res) {
    try{
        let {productName, productPrice, description} = req.body; 
        let data = req.body;
        const schema = Joi.object().keys({
            productName: Joi.string().required().error(e => 'productName require'),
            productPrice: Joi.string().required().error(e => 'productPrice require'),
            description: Joi.string().optional().error(e => 'description here'),
        });

        const result = Joi.validate(data, schema );
        if (result.error) {
            if (result.error.details && result.error.details[0].message) {
                res.status(403).json({"message": result.error.details[0].message });
                return;
            } else {
                res.status(403).json({"message": result.error.message });
                return;
            }
            
        }

        let saveProduct = new ProductModel(data)
	    let Product = await saveProduct.save()
        if(!Product)
        throw new Error ("unable to add product");
        res.status(200).json({
            "Product": Product,
            "message": "Product added successfully"
        })
    } catch(err) {
        res.status(500).json({"error": err.message})
    }
}

//API for like product or wishlist product
exports.likeProduct = async (req, res) => {
    try{
        let {product_id} = req.body; 
        let userID = req.userId
        const schema = Joi.object().keys({
            product_id: Joi.string().required().error(e => 'product_id is requird'),
        });

        const result = Joi.validate(req.body, schema );
        if (result.error) {
            if (result.error.details && result.error.details[0].message) {
                res.status(403).json({"message": result.error.details[0].message });
                return;
            } else {
                res.status(403).json({"message": result.error.message });
                return;
            }
            
        }
        let pData = await ProductModel.find({
            user_id: { $in: [userID] },
            IsLiked: 1,
        });
        if(pData.length) {
            throw new Error("you already liked this product")
        }
        let query = {'_id': product_id};
        let updateData = {
            $set: {IsLiked:1},
            $push: {user_id: userID}
        };
        
        let Product = await ProductModel.findByIdAndUpdate(query, updateData, {new:true})
        if(!Product)
        throw new Error("unable to like product")
        res.status(200).json({
            "Product": Product,
            "message": "Product liked successfully"
        })
    } catch(err) {
        res.status(500).json({"error": err.message})
    }
}


// API for unlike Product
exports.UnlikeProduct = async function(req, res) {
    try{
        let {product_id} = req.body; 
        let userID = req.userId
        
        const schema = Joi.object().keys({
            product_id: Joi.string().required().error(e => 'product_id is requird'),
        });

        const result = Joi.validate(req.body, schema );
        if (result.error) {
            if (result.error.details && result.error.details[0].message) {
                res.status(403).json({"message": result.error.details[0].message });
                return;
            } else {
                res.status(403).json({"message": result.error.message });
                return;
            }
            
        }

        let pData = await ProductModel.find({
            user_id: { $nin: [userID] }, IsLiked:2
        });
        if(pData.length) {
            throw new Error("you already unliked this product")
        }
        let query = {'_id': product_id};
        let updateData = {
            $set: {IsLiked:2},
            $pull: {user_id: userID}
        };
        
        let Product = await ProductModel.findByIdAndUpdate(query, updateData, {new:true})
        if(!Product)
        throw new Error ("unable to unlike product");
        res.status(200).json({
            "Product": Product,
            "message": "Product unliked successfully"
        })
    } catch(err) {
        res.status(500).json({"error": err.message})
    }
}

// API for get wishlist product using aggregate
exports.getWishlistProduct = async function(req, res) {
    try{
        let query = [{   
            $project:{
                _id:  "$_id" ,
                productName: '$productName',
                productPrice: '$productPrice',
                IsLiked: '$IsLiked',
                user_id : '$user_id'
            }
            },{
                $match: 
                    { $or: [
                    { IsLiked: 1 }  
                ] 
            }
          }];
        let Product = await ProductModel.aggregate(query).sort({ _id: -1 });
        if(!Product)
        throw new Error ("unable to find wishlisted product");
        res.status(200).json({
            "Product": Product,
            "message": "Wislisted Product find successfully"
        })
    } catch(err) {
        res.status(500).json({"error": err.message})
    }
}

// API for get data from two table without using populate 
exports.getLikedProduct = async function(req, res) {
    try{
        let query = [ { $unwind: "$user_id" },{   
            $lookup: {
                from: "users",
                localField: "user_id",
                foreignField: "_id",
                as: "userData"
            }
        }];
        let Product = await ProductModel.aggregate(query);
        if(!Product)
        throw new Error ("unable to find liked product");
        res.status(200).json({
            "Product": Product,
            "message": "Liked Product find successfully"
        })
    } catch(err) {
        res.status(500).json({"error": err.message})
    }
}


