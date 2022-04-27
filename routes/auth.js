const router = require('express').Router();
const User = require('../models/User');
const CryptoJS = require('crypto-js');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');

dotenv.config();

router.post("/register", async (req, res) => {
    const newUser = new User({
        username: req.body.username,
        email: req.body.email,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString(),
    });

    try {
        const savedUser = await newUser.save();
        console.log("saved User", savedUser);
        res.status(201).json(savedUser);
        console.log("AFTER RESPONSE");
    }
    catch(err) {
        res.status(500).json(err);
    }
});

const checkPassword = (inputPassword, correctPassword) => {
    return CryptoJS.AES.decrypt(
        correctPassword, process.env.PASS_SEC).toString(
            CryptoJS.enc.Utf8) !== inputPassword;
}

router.post('/login', async (req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user || checkPassword(req.body.password, user.password)) {
             return res.status(401).json("Wrong Credentials!");
        }

        const accessToken = jwt.sign({ 
            id: user._id, 
            isAdmin: user.isAdmin
        }, 
        process.env.JWT_SEC,
        { expiresIn: "3d" }
        );

        const { password, ...others } = user._doc;
        res.status(200).json({...others, accessToken});
    }
    catch(err) {
        res.status(500).json(err);
    }
});

module.exports = router;