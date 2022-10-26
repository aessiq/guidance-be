import {body} from 'express-validator';

export const createPostValidation = [
    body('title', 'Заголовок должен быть не менее 1 символа').isLength({min: 1}),
    body('text', 'Текст должен быть строкой').optional().isString(),
    body('tags', 'Теги должны быть массивом').optional().isArray(),
    body('imageUrl', 'Неверная ссылка на картинку').optional().isString(),
]