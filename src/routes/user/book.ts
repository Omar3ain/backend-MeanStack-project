import { Router, Request, Response, NextFunction } from 'express';
import RouteInterface from '@/utils/interfaces/router.interface';
import bookController from '@/controllers/book';
import httpException from '@/utils/exceptions/http.exception';
import verifyAuth from '@/middlewares/verifyUser';
import CustomRequest from '@/utils/interfaces/request.interface';
import multer from 'multer';


class bookRouter implements RouteInterface {
  public router: Router = Router();
  public upload : multer.Multer;
  constructor() {
    this.upload = multer();
    this.initializeRoutes()
  }

  private initializeRoutes = () => {
    this.router.get('/', this.getBooks);
    this.router.get('/:id', this.getBook);
    this.router.patch('/:id/shelve',verifyAuth , this.upload.none(),this.changeBookShelve);
  }

  private getBooks = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const books = await bookController.getAllBooks();
      res.status(200).json(books);
    } catch (error: any) {
      next(new httpException(401, error.message as string));
    }
  }
  private getBook = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const book = await bookController.getBookDetails(req.params.id);
      res.status(200).json(book);
    } catch (error: any) {
      next(new httpException(401, error.message as string));
    }
  }

  private changeBookShelve = async (req: CustomRequest, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const {shelve} = req.body
      const updatedUser = await bookController.editBookShelve(req.params.id,shelve,req.user!._id!);
      res.status(200).json({status :"Success" , user : updatedUser});
    } catch (error: any) {
      next(new httpException(401, error.message as string));
    }
  }

}

export default bookRouter;