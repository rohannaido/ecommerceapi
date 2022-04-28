const router = require('express').Router();
const stripe = require('stripe')(process.env.STRIPE_KEY);

const storeItems = new Map([
    [1, { priceInCents: 10000, name: "Whey Protien" }],
    [2, { priceInCents: 5000, name: "Pre workout" }],
  ])

router.post("/create-payment-session", async (req, res) => {
    // console.log(req);
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        line_items: req.body.items.map(item => {
            const storeItem = storeItems.get(item.id)
            return {
              price_data: {
                currency: "inr",
                product_data: {
                  name: storeItem.name,
                },
                unit_amount: storeItem.priceInCents,
              },
              quantity: item.quantity,
            }
          }),
        success_url: 'http://localhost:3000/success',
        cancel_url: 'https://localhost:3000/pay',
    })
    console.log("URL", session.url)
    res.status(200).json({url: session.url });
})

// router.post("/payment", (req, res) => {
//     console.log("***********************")
//     console.log(req.body)
//     console.log("***********************")
    
//     stripe.charges.create(
//         {
//             source: req.body.tokenId,
//             amount: req.body.amount,
//             currency: "INR",
//         },
//         (stripeErr, stripeRes) => {
//             if (stripeErr) {
//                 console.log("!!!!!!!!!!!!!!!!!!!!!!!!")
//                 console.log(stripeErr)
//                 res.status(500).json(stripeErr);
//             }
//             else {
//                 res.status(200).json(stripeRes);
//             }
//         }
//     )
// });

module.exports = router;