import { Router, Request, Response, NextFunction } from 'express';
import RouteInterface from '@/utils/interfaces/router.interface';
import bookController from '@/controllers/book'
import httpException from '@/utils/exceptions/http.exception';
import verifyAdmin from '@/middlewares/verifyAdmin'
import multer from 'multer';

class bookAdminRouter implements RouteInterface {
  public router: Router = Router();

  public upload: multer.Multer;
  constructor() {
    this.upload = multer();
    this.initializeRoutes()
  }

  private initializeRoutes = () => {
    this.router.post('/', verifyAdmin, this.upload.none(), this.makeBook);
    //this.router.delete(`${this.path}`, this.upload.none(), this.login);
    //this.router.patch(`${this.path}`, this.upload.none(), this.login);
  }
  private makeBook = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const book = await bookController.createBook(req.body);
      res.status(200).json({ book });
    } catch (error: any) {
      next(new httpException(401, error.message as string));
    }
  }

  // private login = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
  //   console.log(req);
  //   try {
  //     const userToken = await userController.login(req.body);

  //     res.status(200).json({ token: userToken });
  //   } catch (error: any) {
  //     next(new httpException(401, error.message as string));
  //   }
  // }

}

export default bookAdminRouter;