const router = require('express').Router();
const verify = require('./verifytoken').verify;
const user = require('../model/user').userModel;

router.get('/', verify, async (req, res) => {

    console.log(req.user);
    const check = await user.findOne({ _id: req.user._id });
    console.log(check);
    res.json({ posts: { title: 'my first post', description: 'random data you should not access' } });
})



module.exports = router;