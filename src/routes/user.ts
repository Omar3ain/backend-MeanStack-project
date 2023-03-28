import { Router, Request, Response, NextFunction } from 'express';
import RouteInterface from '@/utils/interfaces/router.interface';
import userController from '@/controllers/user'
import httpException from '@/utils/exceptions/http.exception';
import multer from 'multer';

class userRouter implements RouteInterface {
  public router: Router = Router();
  public upload : multer.Multer;
  constructor() {
    this.upload = multer();
    this.initializeRoutes()
  }

  private initializeRoutes = () => {
    this.router.post('/register', this.upload.none(), this.register);
    this.router.post('/login', this.upload.none(), this.login);
  }
  private register = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const userToken = await userController.signUp(req.body);
      res.status(200).json({ token: userToken });
    } catch (error: any) {
      next(new httpException(401, error.message as string));
    }
  }

  private login = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    console.log(req);
    try {
      const userToken = await userController.login(req.body);
     
      res.status(200).json({ token: userToken });
    } catch (error: any) {
      next(new httpException(401, error.message as string));
    }
  }

}

export default userRouter;