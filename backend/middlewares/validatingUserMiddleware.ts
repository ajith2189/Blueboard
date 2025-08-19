import { z } from "zod";
import { Request, Response, NextFunction } from "express";

const registerSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long" }),
  // the email schema has changed in the newest schema of zod
  email: z.email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters long" }),
});

const validatingUserMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("Incoming Body:", req.body);
  // checking the validation of the data
  const parse = registerSchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: parse.error.issues });
  }
  // checking if the user already exist
  console.log(
    "reaching the part after the zod verification the data is",
    parse.data
  );
  next();
};

export default validatingUserMiddleware;
