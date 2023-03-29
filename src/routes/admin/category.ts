import { Router, Request, Response, NextFunction } from 'express';
import RouteInterface from '@/utils/interfaces/router.interface';
import categoryController from '@/controllers/category'
import httpException from '@/utils/exceptions/http.exception';
import verifyAdmin from '@/middlewares/verifyAdmin'
import multer from 'multer';
import user from '@/controllers/user';

class categoryAdminRouter implements RouteInterface {
  public router: Router = Router();

  public upload : multer.Multer;
  constructor() {
    this.upload = multer();
    this.initializeRoutes()
  }

  private initializeRoutes = () => {
    this.router.get('/', this.upload.none(),this.getAllCategories);
    this.router.post('/', this.upload.none(),this.addCategory);
  }
  private getAllCategories = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const categories = await categoryController.getAll(req.query)
      res.status(200).json({ categories });
    } catch (error: any) {
      next(new httpException(401, error.message as string));
    }
  }

  private addCategory = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const {name, creator} = req.body;
    try {
      const category = await categoryController.add({name, creator});
      res.status(200).json({ status:201, category });
    } catch (error: any) {
      next(new httpException(401, error.message as string));
    }
  }

}

export default categoryAdminRouter;