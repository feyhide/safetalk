import Joi from "joi"

const validator = (schema) => (payload) =>
    schema.validate(payload,{ abortEarly: false});

const searchContacts = Joi.object({
    username: Joi.string()
    .min(3)
    .required()
    .pattern(/^[a-z][a-z0-9_]*$/, 'lowercase letters, numbers, and underscores')
    .messages({
      'string.pattern.name': 'Username must start with a lowercase letter, and only include lowercase letters, numbers, or underscores.',
    })
})


const validateSearchContacts = validator(searchContacts);

export {validateSearchContacts}