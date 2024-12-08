import Joi from "joi"

const validator = (schema) => (payload) =>
    schema.validate(payload,{ abortEarly: false});

const signUpSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
    .pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/)
    .required()
    .messages({
      'string.pattern.base': 'Password must be 6-20 characters long, include at least one numeric digit, one lowercase letter, and one uppercase letter.',
      'string.empty': 'Password is required.',
    }),
    username: Joi.string()
    .min(3)
    .required()
    .pattern(/^[a-z][a-z0-9_]*$/, 'lowercase letters, numbers, and underscores')
    .messages({
      'string.pattern.name': 'Username must start with a lowercase letter, and only include lowercase letters, numbers, or underscores.',
    })
})

const signInpSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
    .pattern(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/)
    .required()
    .messages({
      'string.pattern.base': 'Password must be 6-20 characters long, include at least one numeric digit, one lowercase letter, and one uppercase letter.',
      'string.empty': 'Password is required.',
    })
})

const otpSchema = Joi.object({
    email: Joi.string().email().required(),
    otp: Joi.number().required()
})


const validateSignin = validator(signInpSchema);
const validateSignup = validator(signUpSchema);
const validateOtp = validator(otpSchema);

export {validateSignup,validateOtp,validateSignin}