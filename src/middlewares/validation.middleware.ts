import { Request , Response , NextFunction , RequestHandler } from "express";
import joi from "joi";

function validationMiddleware(schema : joi.Schema): RequestHandler {
  return async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try{
      const {value} = schema.validate(req.body);   
      req.body = value;
      next();
    }catch(e : any){
      const errors : string[] = [];
      e.details.forEach((error : joi.ValidationError) => {
        errors.push(error.message);
      });
      res.status(400).send({errors})
    }
  }
}

export default validationMiddleware;