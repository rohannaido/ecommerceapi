const { verifyTokenAndAdmin } = require("./verifyToken");
const router = require("express").Router();
const Product = require("../models/Product");

//GET ALL PRODUCTS
router.get("/", async (req, res) => {
    const qNew = req.query.new;
    const qCategory = req.query.category;

    try {
        let products;
        if (qNew) {
            products = await Product.find().sort({ createdAt: -1 }).limit(5);
        }
        else if (qCategory) {
            products = await Product.find({ 
                categories: {
                    $in: [qCategory],
                }
            });
        }
        else {
            products = await Product.find();
        }

        res.status(200).json(products);
    }
    catch (err) {
        res.status(500).json(err);
    }
});

//GET ONE PRODUCT
router.get("/find/:id", async (req, res) => {
    try {
        const product = await Product.findById( req.params.id );
        res.status(200).json(product);
    }
    catch(err) {
        res.status(500).json(err);
        console.log(err);
    }
});

// CREATE PRODUCT
router.post("/", verifyTokenAndAdmin , async (req, res) => {
    const newProduct = new Product(req.body);
    
    try {
        const savedProduct = await newProduct.save();
        res.status(200).json(savedProduct);
    }
    catch(err) {
        res.status(500).json(err);
    }
})

//UPDATE PRODUCT
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        // console.log("PRODUCT PUT: ID: ", req.params.id);
        const updatedProduct = await Product.findOneAndUpdate( {_id: req.params.id}, { $set: req.body }, { new: true });
        // console.log("UPDATED PRODUCT :", updatedProduct);
        res.status(200).json(updatedProduct);
    }
    catch(err) {
        // console.log(err);
        res.status(500).json(err);
    }
});

//DELETE PRODUCT
router.delete("/:id", verifyTokenAndAdmin, async(req, res) => {
    try {
        await Product.findByIdAndDelete( req.params.id );
        res.status(200).json( req.body.title + " has been deleted.");
    }
    catch(err) {
        res.status(500).json(err);
    }
})

module.exports = router;