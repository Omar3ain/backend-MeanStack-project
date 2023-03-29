import { Router, Request, Response, NextFunction } from 'express';
import RouteInterface from '@/utils/interfaces/router.interface';
import userController from '@/controllers/user'
import httpException from '@/utils/exceptions/http.exception';
import multer from 'multer';

class userRouter implements RouteInterface {
  public router: Router = Router();
  public upload : multer.Multer;
  constructor() {
    this.upload = multer({ dest : 'uploads/'});
    this.initializeRoutes()
  }

  private initializeRoutes = () => {
    this.router.post('/register', this.upload.single("avatar"), this.register);
    this.router.post('/login', this.upload.none(), this.login);
  }
  private register = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    console.log(req);
    try {
      const {firstName , lastName , email , password } = req.body;
      const avatar = req.file?.path as string;
      const userToken = await userController.signUp({firstName , lastName , email , password , avatar});
      res.status(200).json({ token: userToken });
    } catch (error: any) {
      next(new httpException(401, error.message as string));
    }
  }

  private login = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const userToken = await userController.login(req.body);
     
      res.status(200).json({ token: userToken });
    } catch (error: any) {
      next(new httpException(401, error.message as string));
    }
  }

}

export default userRouter;