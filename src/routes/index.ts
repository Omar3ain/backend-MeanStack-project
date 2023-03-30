import {Router , Request , Response , NextFunction} from 'express';
import RouteInterface from '@/utils/interfaces/router.interface';
import adminRouter from '@/routes/admin/index'
import userRouter from '@/routes/user/user';
import bookRouter from '@/routes/user/book';


class mainRouter implements RouteInterface {
    public router: Router = Router();
    public path = '/'
  constructor(){
    this.initializeRoutes()
  }
  
  private initializeRoutes = () => {
    this.router.use(`${this.path}admin`, new adminRouter().router);
    this.router.use(`${this.path}users`, new userRouter().router);
    this.router.use(`${this.path}books`, new bookRouter().router);
  }

}

export default mainRouter;