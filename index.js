import express from 'express';
import mongoose from "mongoose";
import {loginValidation, registerValidation} from "./validations/auth.js";
import {createPostValidation} from "./validations/posts.js";
import {checkAuth} from "./utils/checkAuth.js";
import * as UserController from "./contollers/UserController.js";
import * as PostController from "./contollers/PostController.js";
import handleValidationErrors from "./utils/handleValidationErrors.js";
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const app = express();
app.use(express.json());
app.use('/uploads', express.static(path.resolve('./uploads')));
app.use(cors());
const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        if (!fs.existsSync(path.resolve('./uploads'))) {
            fs.mkdirSync(path.resolve('./uploads'));
        }
      cb(null, path.resolve('./uploads'));
    },
    filename: (_, file, cb) => {
      cb(null, file.originalname);
    },
})

const upload = multer({storage});

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('DB connected'))
    .catch(() => console.log('DB error'))

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    return res.json({
       url: `/uploads/${req.file.originalname}`,
    });
});
app.get('/auth/me', checkAuth, UserController.authMe)
app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login)
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register)

app.post('/posts', checkAuth, createPostValidation, handleValidationErrors, PostController.createPost);
app.get('/posts', PostController.getAll);
app.get('/tags', PostController.getLastTags);
app.get('/posts/:id', PostController.getOne);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id', checkAuth, createPostValidation, handleValidationErrors, PostController.update);

app.listen(process.env.PORT || 4444, (err) => {
    if (err) return console.log(err);
    console.log('Server is running');
})