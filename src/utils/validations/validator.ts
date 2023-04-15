import mongoose from 'mongoose';
import Joi from 'joi';

import ICategory from '@/utils/interfaces/category.update.interface';

const registerValidation = (category: ICategory) => {
    const schema = Joi.object({
        firstName: Joi.string().min(6),
        name: Joi.string().min(2).max(24).required(),
    });
    return schema.validate(category);
};

module.exports.registerValidation = registerValidation;
