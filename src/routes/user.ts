import {Router , Request , Response , NextFunction} from 'express';
import RouteInterface from '@/utils/interfaces/router.interface';

class userRouter implements RouteInterface {
    public router: Router = Router();
    public path = '/users'
  constructor(){

  }

}