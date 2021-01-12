const {Router} = require('express');
const Link = require('../models/Link');
const auth = require("../middlewares/auth.middleware");
const config = require("../config/default.json");
const shortId = require("shortid");
const router = Router();

router.post('/generate', auth,  async (req, res) => {
    try {
        const baseUrl = config.baseUrl;
        const { from } = req.body;

        const code = shortId.generate();

        const existing = await Link.findOne({ from });

        if (existing) {
            return res.json(existing);
        }

        const to = baseUrl + '/t/' + code;

        const link = new Link({ code, to ,from, owner: req.user.userId });

        await link.save();

        res.status(201).json({ link });
    } catch (e) {
        res.status(500).json({message: "Что-то пошло не так, попробуйте снова"})
    }
})

router.get('/', auth, async (req, res) => {
    try {
        const links = await Link.find({ owner: req.user.userId });
        res.json(links);
    } catch (e) {
        res.status(500).json({message: "Что-то пошло не так, попробуйте снова"})
    }
})

router.get('/:id', auth, async (req, res) => {
    try {
        const link = await Link.findById(req.params.id);
        res.json(link);
    } catch (e) {
        res.status(500).json({message: "Что-то пошло не так, попробуйте снова"})
    }
})

module.exports = router;