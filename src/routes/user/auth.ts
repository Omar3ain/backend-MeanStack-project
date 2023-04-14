import { Router, Request, Response, NextFunction } from 'express';
import { Multer } from 'multer';
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
    this.upload = formUpload('uploads/users')
    this.initializeRoutes()
  }

  private initializeRoutes = () => {
    this.router.post('/register', this.upload.single("avatar"), validationMiddleware(validate.userRegisterSchema), this.register);
    this.router.post('/login', this.upload.none(), validationMiddleware(validate.userLoginSchema), this.login);
  }
  private register = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { firstName, lastName, email, password } = req.body;
    const avatar = req.file ? `${req.protocol}://${req.headers.host}/${req.file.destination}/${req.file.filename}` : "";
    const filePath = req.file ? `${req.file.destination}/${req.file.filename}` : "";
    try {
      const user = await userController.signUp({ firstName, lastName, email, password, avatar });
      res.status(200).json(user);
    } catch (error: any) {
      fs.unlinkSync(filePath);
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