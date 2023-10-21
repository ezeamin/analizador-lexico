import Joi from 'joi';

export const post_analyzeSchema = Joi.object({
  text: Joi.string().required().messages({
    'string.empty': 'El campo "text" no puede estar vacio',
    'any.required': 'El campo "text" es obligatorio',
    '*': 'Revisa el campo "text"',
  }),
});

const validateBody = (req, res, next) => {
  const { error } = post_analyzeSchema.validate(req.body);

  if (error) {
    res.status(400).json({ errors: error.details });
    return;
  }

  next();
};

export default validateBody;
