import { Router, Request, Response, NextFunction } from 'express';
import { Multer } from 'multer';
import { v2 as cloudinary } from "cloudinary";
import fs from 'fs';

import RouteInterface from '@/utils/interfaces/router.interface';
import userController from '@/controllers/user'
import httpException from '@/utils/exceptions/http.exception';
import validationMiddleware from '@/middlewares/validation.middleware';
import validate from '@/utils/validations/user/schema';
import formUpload from '@/middlewares/form.middleware';

class authRouter implements RouteInterface {
  public router: Router = Router();
  public upload: Multer;

  constructor() {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    this.upload = formUpload('uploads/users')
    this.initializeRoutes()
  }

  private initializeRoutes = () => {
    this.router.post('/register', this.upload.single("avatar"), validationMiddleware(validate.userRegisterSchema), this.register);
    this.router.post('/login', this.upload.none(), validationMiddleware(validate.userLoginSchema), this.login);
  }
  private register = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { firstName, lastName, email, password } = req.body;
    let avatar = '';
    try {
      if (req.file) {
        const result = await cloudinary.uploader.upload(req.file.path);
        avatar = result.secure_url;
        fs.unlinkSync(req.file.path);
      }
      const user = await userController.signUp({ firstName, lastName, email, password, avatar });
      res.status(200).json(user);
    } catch (error: any) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      next(new httpException(400, error.message as string));
    }
  }

  private login = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const userToken = await userController.login(req.body);

      res.status(200).json(userToken);
    } catch (error: any) {
      next(new httpException(400, error.message as string));
    }
  }
}

export default authRouter;