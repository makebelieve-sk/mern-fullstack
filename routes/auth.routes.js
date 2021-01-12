const {Router} = require("express");
const bcrypt = require("bcrypt");
const {check, validationResult} = require("express-validator");
const jwt = require("jsonwebtoken");

const User = require("../models/User");
const config = require("../config/default.json");

const router = Router();

router.post(
    '/register',
    [
        check('email', 'Некорректный email').isEmail(),
        check('password', 'Минимальная длина пароля 6 символов').isLength({min: 6})
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array,
                    message: "Некорректные данные при регистрации"
                })
            }
            const {email, password} = req.body;

            const candidate = await User.findOne({email});

            if (candidate) {
                console.log(candidate)
                return res.status(400).json({message: "Такой пользователь уже существует"});
            }

            const hashedPassword = await bcrypt.hash(password, 12);
            const user = new User({email: email, password: hashedPassword})

            await user.save();

            res.status(201).json({message: "Пользователь создан"})
        } catch (e) {
            res.status(500).json({message: "Что-то пошло не так, попробуйте снова"})
        }
    })

router.post(
    '/login',
    [
        check('email', 'Введите корректный email').normalizeEmail().isEmail(),
        check('password', 'Введите пароль').exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Некорректный данные при входе в систему'
                })
            }

            const {email, password} = req.body
            console.log(email)
            const user = await User.findOne({ email })
            console.log(user)
            if (!user) {
                return res.status(400).json({ message: 'Пользователь не найден' })
            }

            const isMatch = await bcrypt.compare(password, user.password)

            if (!isMatch) {
                return res.status(400).json({ message: 'Неверный пароль, попробуйте снова' })
            }

            const token = jwt.sign(
                { userId: user.id },
                config.jwtSecret,
                { expiresIn: '1h' }
            )

            res.json({ token, userId: user.id })
        } catch (e) {
            res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
        }
    })

module.exports = router;