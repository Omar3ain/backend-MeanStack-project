import {Router , Request , Response , NextFunction} from 'express';
import RouteInterface from '@/utils/interfaces/router.interface';
import bookAdminRoute from '@/routes/admin/book';

class adminRouter implements RouteInterface {
    public router: Router = Router();
  constructor(){
    this.initializeRoutes()
  }
  
  private initializeRoutes = () => {
    this.router.use('/book', new bookAdminRoute().router);
  }

}

export default adminRouter;