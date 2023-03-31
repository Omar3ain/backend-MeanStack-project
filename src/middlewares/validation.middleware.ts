import { Request , Response , NextFunction , RequestHandler } from "express";
import joi from "joi";
import fs from "fs";

function validationMiddleware(schema : joi.Schema): RequestHandler {
  return async (req : Request, res : Response, next : NextFunction) : Promise<void> => {
    try{
      if(!schema.validate(req.body).error) next();
      else {
        if(req.file){
          const filePath = `${req.file.destination}/${req.file.filename}`
          fs.unlinkSync(filePath);
        }
        next(schema.validate(req.body).error)
      }
    }catch(e : any){
      next(e);
    }
  }
}

export default validationMiddleware;