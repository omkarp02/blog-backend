import { registerSchema } from "../validators/user-validation.js";

export const validate = (schema) => async (req, res, next) => {
  try {
    console.log(req.body)
    const parseBody = await schema.parseAsync(req.body);
    req.body = parseBody;
    next();
  } catch (error) {
    next({ status: 400, message: error.issues[0].message });
  }
};
