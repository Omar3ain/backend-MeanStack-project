import Joi from 'joi';
import passwordComplexity from 'joi-password-complexity';

const passwordOptions = {
  min: 6,
  max: 50,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
  requirementCount: 4,
};

const userRegisterSchema = Joi.object({
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required().custom((value, helpers) => {
    const result = passwordComplexity(passwordOptions).validate(value, {
      abortEarly: false,
    });
    if (result.error) {
      return helpers.error('any.invalid');
    }
    return value;
  }),
  avatar: Joi.object({
    fieldname: Joi.string().required(),
    originalname: Joi.string().required(),
    mimetype: Joi.string().valid('image/jpeg', 'image/png', 'image/jpg').required(),
    size: Joi.number().max(5 * 1024 * 1024).required(),
  }).required(),
});


const userLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required().custom((value, helpers) => {
    const result = passwordComplexity(passwordOptions).validate(value, {
      abortEarly: false,
    });
    if (result.error) {
      return helpers.error('any.invalid');
    }
    return value;
  })
});

const userEditSchema = Joi.object({
  firstName: userRegisterSchema.extract('firstName'),
  lastName: userRegisterSchema.extract('lastName'),
  email: userRegisterSchema.extract('email'),
  password: userRegisterSchema.extract('password').optional(),
  avatar: userRegisterSchema.extract('avatar').optional(),
});


export default {userRegisterSchema, userLoginSchema, userEditSchema};