import Joi from "joi";

const loginUserValidation = Joi.object({
    email : Joi.string().email().required(),
})

const updateUserValidation = Joi.object({
    diamond : Joi.number().required()
})

export { updateUserValidation, loginUserValidation }