const { verifyToken, verifyTokenAndAuthorization, verifyTokenAndAdmin } = require('../middleware/verifyToken');
const user = require('../models/user');
const router = require('express').Router();

router.put('/:id', verifyTokenAndAuthorization, async (req, res) => {
    if (req.body.password) {
        req.body.password = CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString();
    }
    try {
        const updatedUser = await user.findByIdAndUpdate(req.params.id, {
            $set: req.body
        }, { new: true });
        res.status(200).json(updatedUser);
    } catch (err) { res.status(500).json(err); }
});
router.delete('/:id', verifyTokenAndAuthorization, async (req, res) => {
    try {
        await user.findByIdAndDelete(req.params.id)
        res.status(200).json('User has been delated!...');
    } catch (err) { res.status(500).json(err); }
});
router.get('/find/:id', verifyTokenAndAdmin, async (req, res) => {
    try {
        const User = await user.findById(req.params.id);
        const { password, ...others } = User._doc;
        res.status(200).json(others);
    } catch (err) { res.status(500).json(err); }
});

module.exports = router;