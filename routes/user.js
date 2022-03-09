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

router.get('/', verifyTokenAndAdmin, async (req, res) => {
    const query = req.query
    try {
        const users = query
            ? await user.find().sort({ _id: -1 }).limit(1)
            : await user.find();
        res.status(200).json(users);
    } catch (err) { res.status(500).json(err); }
});

router.get('/stats', verifyTokenAndAdmin, async (req, res) => {
    const date = new Date();
    const lastYear = new Date(date.setFullYear(date.getFullYear() - 1));
    try {
        const data = await user.aggregate([
            { $match: { createdAt: { $gte: lastYear } } },
            {
                $project: {
                    month: { $month: '$createdAt' },
                },
            },
            {
                $group: {
                    _id: '$month',
                    total: { $sum: 1 },
                },
            },
        ]);
        res.status(200).json(data);
    } catch (err) {
        res.status(500).json(err);
    }
})
module.exports = router;