import { Router, Request, Response, NextFunction } from 'express';
import RouteInterface from '@/utils/interfaces/router.interface';
import adminRouter from '@/routes/admin/index'
import userRouter from '@/routes/user/user';
import authRouter from '@/routes/user/auth';
import bookRouter from '@/routes/user/book';
import categoryRouter from '@/routes/user/category';
import authorRouter from './user/author';


class mainRouter implements RouteInterface {
  public router: Router = Router();
  public path = '/'
  constructor() {
    this.initializeRoutes()
  }

  private initializeRoutes = () => {
    this.router.use(`${this.path}admin`, new adminRouter().router);
    this.router.use(`${this.path}profile`, new userRouter().router);
    this.router.use(`${this.path}books`, new bookRouter().router);
    this.router.use(`${this.path}categories`, new categoryRouter().router);
    this.router.use(`${this.path}authors`, new authorRouter().router);
    this.router.use(`${this.path}auth`, new authRouter().router);
  }

}

export default mainRouter;