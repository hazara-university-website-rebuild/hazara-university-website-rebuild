/**
 * Middleware to validate request body using a Joi schema
 */


export const validateBody = (schema) => (req, res, next) => {
  
  const { error, value } = schema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true
  });

  if (error) {

    const errors = error.details.map(d => ({
      field: d.path.join("."),
      message: d.message
    }));

    throw new ValidationError("Validation failed", errors);

  }

  req.body = value;

  next();
};

