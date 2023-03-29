import { Router, Request, Response, NextFunction } from 'express';
import RouteInterface from '@/utils/interfaces/router.interface';
import userController from '@/controllers/user'
import httpException from '@/utils/exceptions/http.exception';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import verifyAuth from '@/middlewares/verifyUser';

class userRouter implements RouteInterface {
  public router: Router = Router();
  public upload: multer.Multer;
  constructor() {
    this.upload = multer({
      storage: multer.diskStorage({
        destination: (req: Request, file, cb) => {
          cb(null, 'uploads')
        },
        filename: (req: Request, file, cb) => {
          let timeStamp = Date.now();
          cb(null, file.originalname.split('.')[0] + "-" + timeStamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
        }
      }),
      fileFilter: (req: Request, file, cb) => {
        let ext = path.extname(file.originalname);
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
          return cb(new Error('Only images are allowed!'));
        }
        cb(null, true);
      }
    });
    this.initializeRoutes()
  }

  private initializeRoutes = () => {
    this.router.post('/register', this.upload.single("avatar"), this.register);
    this.router.post('/login', this.upload.none(), this.login);
    this.router.get('/:id', verifyAuth, this.getUser);
  }
  private register = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { firstName, lastName, email, password } = req.body;
    const avatar = req.file ? `${req.protocol}://${req.headers.host}/${req.file.destination}/${req.file.filename}` : "";
    try {
      const userToken = await userController.signUp({ firstName, lastName, email, password, avatar });
      res.status(200).json({ token: userToken });
    } catch (error: any) {
      try {
        fs.unlinkSync(avatar);
      } catch (error) {
        console.log(error);
      }
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

  private getUser = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const user = await userController.getUserDetails(req.params.id);
      res.status(200).json(user);
    } catch (error : any) {
      next(new httpException(401, error.message as string));
    }
  }

}

export default userRouter;