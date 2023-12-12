import { Request, Response, NextFunction } from "express";
import { ObjectSchema } from "joi";

function validatorHandler(schema: ObjectSchema, property: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    //@ts-ignore
    const data = req[property];
    const { error } = schema.validate(data, { abortEarly: false });
    if (error) {
       next({name:"ValidationError",error:error.details});
    }
    next();
  };
}

export { validatorHandler };