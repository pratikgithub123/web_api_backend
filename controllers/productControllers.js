const cloudinary = require("cloudinary");
const Products = require("../model/productModel")

const createProduct = async (req,res) => {
    // step 1 : check incomming data
    console.log(req.body);
    console.log(req.files);

    // step 2 : Destructuring data
    const {
        productName, 
        productPrice,
        productDescription,
        productCategory,
    } = req.body;

    const {productImage} = req.files;

    // step 3 : Validate data
    if(!productName || !productPrice || !productDescription || !productCategory){
        return res.json({
            success : false,
            message : "Please fill all the fields"
        })
    }

    try {
        // upload image to cloudinary
        const uploadedImage = await cloudinary.v2.uploader.upload(
            productImage.path,
            {
                folder : "products",
                crop : "scale"
            }
        )

        // Save to database
        const newProduct = new Products({
            productName : productName,
            productPrice : productPrice,
            productDescription : productDescription,
            productCategory : productCategory,
            productImageUrl : uploadedImage.secure_url
        })
        await newProduct.save();
        res.json({
            success : true,
            message : "Product created successfully",
            product : newProduct
        })


        
    } catch (error) {
        console.log(error)
        res.status(500).json({
            success : false,
            message : "Internal server error"
        })
    }

}
//get all products
const getProducts = async(req,res) => {
    try{
        const allProducts = await Products.find({});
        res.json({
            success :true,
            message : "aall products fetched succesfully",
            products :allProducts,
        })

    }catch (error){
        console.log(error);
        res.send("Internal server error")
    }

}

module.exports = {
    createProduct,getProducts
}