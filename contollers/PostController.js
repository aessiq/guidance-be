import PostModel from "../models/Post.js";

export const createPost = async (req, res) => {
    try {
        const {title, tags, text, imageUrl} = req.body;
        const doc = new PostModel({
            title,
            tags,
            text,
            imageUrl,
            author: req.userId,
        });
        const post = await doc.save();
        return res.json(post);
    } catch (e) {
        return res.status(500).json({
            message: 'Не удалось создать пост',
        })
    }
}

export const getLastTags = async (req, res) => {
    try {
        const posts = await PostModel.find().limit(5).exec();
        const tags = posts.map(obj => obj.tags).flat().slice(0, 5);
        return res.json(tags);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Не удалось получить тэги',
        })
    }
}

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().populate('author').exec();
        return res.json(posts);
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Не удалось получить посты',
        })
    }
}

export const getOne = (req, res) => {
    try {
        PostModel.findOneAndUpdate(
            {_id: req.params.id},
            {$inc: {viewsCount: 1}},
            {returnDocument: 'after'},
            (err, doc) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: 'Не удалось вернуть пост',
                    });
                }

                if (!doc) {
                    return res.status(404).json({
                        message: 'Пост не найден',
                    });
                }

                return res.json(doc);
            }
        ).populate('author');
    } catch (e) {
        return res.status(500).json({
            message: 'Не удалось получить пост',
        })
    }
}

export const remove = (req, res) => {
    try {
        PostModel.findOneAndDelete(
            {_id: req.params.id},
            (err, doc) => {
                if (err) {
                    console.log(err);
                    return res.status(500).json({
                        message: 'Не удалось удалить пост',
                    });
                }
                if (!doc) {
                    return res.status(404).json({
                        message: 'Пост не найден',
                    });
                }
                return res.json(doc);
            }
        );
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            message: 'Не удалось удалить пост',
        })
    }
}

export const update = async (req, res) => {
    try {
        const {title, text, tags, imageUrl} = req.body;
        await PostModel.findOneAndUpdate(
            {_id: req.params.id},
            {
                title,
                text,
                tags,
                imageUrl,
                author: req.userId,
            },
        );
        return res.json({
            ok: 1,
        })
    } catch (e) {
        return res.status(500).json({
            message: 'Не удалось удалить пост',
        })
    }
}
