const Order = require('../models/Order');
const { verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('./verifyToken');
const router = require('express').Router();

router.post('/', verifyTokenAndAuthorization, async (req, res) => {
    const newOrder = new Order( req.body );
    try {
        const savedOrder = newOrder.save();
        res.status(200).json(savedOrder);
    }
    catch(err) {
        res.status(500).json(err);
    }
});

//UPDATE ORDER
router.put('/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        const updatedOrder = await Order.findOneAndUpdate(
            req.params.id, {
            $set: req.body
        }, {
            new: true
        })
        res.status(200).json(updatedOrder);
    }
    catch(err) {
        res.status(500).json(err);
    }
});

//DELETE ORDER

router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
    try{
        await Order.findOneAndDelete(req.params.id);
        res.status(200).json("Deleted Order.");
    }
    catch(err) {
        res.status(500).json(err);
    }
});

//FIND USER ORDERS
router.get('/find/:userId', verifyTokenAndAuthorization, async (req, res) => {
    try{
        const userOrders = await Order.find({
            $userId: req.params.userId
        });
        res.status(200).json(userOrders);
    }
    catch(err) {
        res.status(500).json(err);
    }
});

//GET ALL ORDERS
router.get('/', verifyTokenAndAdmin, async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    }
    catch (err) {
        res.status(500).json(err);
    }
});

//GET MONTHLY INCOME
router.get('/income', verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const previousMonth = new Date(date.setMonth(date.getMonth() - 2));
    try {
        const income = await Order.aggregate([
            {
                $match: {
                    $createdAt: {
                        $gte: previousMonth
                    }
                }
            },
            {
                $project: {
                    month: { $month: "$createdAt" },
                    sales: "$amount",
                },
            },
            {
                $group: {
                    _id: $month,
                    total: { $sum: "$sales" },
                }
            }
        ]);
        re.status(200).json(income);
    }
    catch(err) {
        res.status(500).json(err);
    }
});