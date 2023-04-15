import mongoose from 'mongoose';
import Joi from 'joi';

const createCategory = Joi.object({
    name: Joi.string().min(2).max(24).required(),
});

export default {
    createCategory
};
