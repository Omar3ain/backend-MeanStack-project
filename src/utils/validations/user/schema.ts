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
  isAdmin: Joi.forbidden(),
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
  firstName: userRegisterSchema.extract('firstName').optional(),
  lastName: userRegisterSchema.extract('lastName').optional(),
  email: userRegisterSchema.extract('email').optional(),
  oldPassword: Joi.string().optional(),
  newPassword: userRegisterSchema.extract('password').optional(),
  avatar: Joi.string().allow('').optional(),
});


export default { userRegisterSchema, userLoginSchema, userEditSchema };