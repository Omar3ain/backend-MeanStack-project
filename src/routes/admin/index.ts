import {Router , Request , Response , NextFunction} from 'express';
import RouteInterface from '@/utils/interfaces/router.interface';
import bookAdminRoute from '@/routes/admin/book';
import categoryAdminRoute from '@/routes/admin/category';

class adminRouter implements RouteInterface {
    public router: Router = Router();
  constructor(){
    this.initializeRoutes()
  }
  
  private initializeRoutes = () => {
    this.router.use('/book', new bookAdminRoute().router);
    this.router.use('/categories', new categoryAdminRoute().router);
  }

}

export default adminRouter;