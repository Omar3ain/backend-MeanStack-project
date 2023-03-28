import {Router , Request , Response , NextFunction} from 'express';
import RouteInterface from '@/utils/interfaces/router.interface';
import userRouter from '@/routes/user';

class mainRouter implements RouteInterface {
    public router: Router = Router();
    public path = '/'
  constructor(){
    this.initializeRoutes()
  }
  
  private initializeRoutes = () => {
    this.router.use(`${this.path}users`, new userRouter().router);
  }

}

export default mainRouter;