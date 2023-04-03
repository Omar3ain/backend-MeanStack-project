import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';

import RouteInterface from '@/utils/interfaces/router.interface';
import categoryController from '@/controllers/category'
import httpException from '@/utils/exceptions/http.exception';

class categoryUserRouter implements RouteInterface {
  public router: Router = Router();

  public upload: multer.Multer;
  constructor() {
    this.upload = multer();
    this.initializeRoutes()
  }

  private initializeRoutes = () => {
    this.router.get('/', this.upload.none(), this.getAllCategories);
    this.router.get('/:grategoryName/books', this.upload.none(), this.getAllBooks);
  }
  private getAllCategories = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const categories = await categoryController.getAll(req.query)
      res.status(200).json({ categories });
    } catch (error: any) {
      next(new httpException(401, error.message as string));
    }
  }

  private getAllBooks = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const { grategoryName } = req.params;
    try {
      const books = await categoryController.getAllBooks(grategoryName);
      if (books.length < 1) next(new httpException(401, "no books in this category"));
      res.status(200).json({ status: 201, books });
    } catch (error: any) {
      next(new httpException(401, error.message as string));
    }
  }

}

export default categoryUserRouter;