import bcrypt from "bcrypt";
import UserModel from "../models/User.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(req.body.password, salt);

        const {email, fullName, avatarUrl} = req.body;
        const doc = new UserModel({
            email,
            fullName,
            avatarUrl,
            passwordHash: hash,
        });

        const user = await doc.save();

        const token = jwt.sign(
            {
                _id: user._id,
            },
            'secret123',
            {
                expiresIn: '30d',
            }
        );

        const {passwordHash, ...userData} = user._doc;

        return res.json({
            ...userData,
            token,
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Не удалось зарегестрироваться',
        });
    }
}

export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({email: req.body.email});

        if (!user) {
            return res.status(404).json({message: 'Пользователь не найден'});
        }
        const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);
        if (!isValidPass) {
            return res.status(400).json({
                message: 'Неверный логин или пароль',
            });
        }

        const token = jwt.sign(
            {
                _id: user._id,
            },
            'secret123',
            {
                expiresIn: '30d',
            }
        );
        const {passwordHash, ...userData} = user._doc;

        return res.json({
            ...userData,
            token,
        });
    } catch (e) {
        res.status(500).json({
            message: 'Не удалось залогинится',
        })
    }
}

export const authMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId);
        if (!user) {
            return res.status(404).json({
                message: 'Пользователь не найден',
            });
        }
        const {passwordHash, ...userData} = user._doc;

        return res.json(userData);
    } catch (e) {
        return res.status(500).json({
            message: 'Не удалось,'
        })
    }
}