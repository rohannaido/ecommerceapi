const router = require('express').Router();
const stripe = require('stripe')(process.env.STRIPE_KEY);
const Product = require('../models/Product');


//WITHOUT LOGIN USER SHOULD NOT BE ABLE TO CHECKOUT
router.post("/create-payment-session", async (req, res) => {

    const getLineItems = req.body.items.map(async (item) => {
        try {
            const storeItem = await Product.findById(item._id);
            const lineItemEntry = {
                price_data: {
                    currency: "inr",
                    product_data: {
                        name: storeItem.title,
                    },
                    unit_amount: storeItem.price * 100,
                },
                quantity: item.quantity,
            };
            return lineItemEntry;
        } catch (err) {
            console.log(err);
        }
    });

    Promise.all([...getLineItems]).then(async (lineItems) => {

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: 'payment',
            line_items: lineItems,
            success_url: 'http://localhost:3000/',
            cancel_url: 'https://localhost:3000/cart',
        })
        console.log("URL", session.url)
        res.status(200).json({
            url: session.url
        });

    }).catch((err) => console.log("PROMISE ALL", err));
});

module.exports = router;