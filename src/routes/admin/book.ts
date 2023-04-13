import { Router, Request, Response, NextFunction } from 'express';
import { Multer } from 'multer';
import fs from 'fs';

import RouteInterface from '@/utils/interfaces/router.interface';
import bookController from '@/controllers/book';
import httpException from '@/utils/exceptions/http.exception';
import verifyAdmin from '@/middlewares/verifyAdmin';
import validationMiddleware from '@/middlewares/validation.middleware';
import validate from '@/utils/validations/book/schema';
import formUpload from '@/middlewares/form.middleware';
class bookAdminRouter implements RouteInterface {
  public router: Router = Router();

  public upload: Multer;
  constructor() {
    this.upload = formUpload('uploads/books');
    this.initializeRoutes();
  }

  private initializeRoutes = () => {
    this.router.get('/:id', verifyAdmin, this.getBook);
    this.router.post('/', verifyAdmin, this.upload.single("coverPhoto"), validationMiddleware(validate.createBook), this.makeBook);
    this.router.delete('/:id', verifyAdmin, this.deleteBook);
    this.router.patch(`/:id`, verifyAdmin, this.upload.single("coverPhoto"), validationMiddleware(validate.updateBook), this.update);
  }
  private makeBook = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const coverPhoto = req.file ? `${req.protocol}://${req.headers.host}/${req.file.destination}/${req.file.filename}` : "";
    const filePath = req.file ? `${req.file.destination}/${req.file.filename}` : "";
    try {
      const book = await bookController.createBook(req.body, coverPhoto);;
      res.status(200).json({ book });
    } catch (error: any) {
      fs.unlinkSync(filePath);
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

  private deleteBook = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const id: string = req.params.id;
      const resp = await bookController.deleteBook(id);

      res.status(200).json({ status: 'Deleted successfully' });
    } catch (error: any) {
      next(new httpException(401, error.message as string));
    }
  }
  private update = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const coverPhoto = req.file ? `${req.protocol}://${req.headers.host}/${req.file.destination}/${req.file.filename}` : "";
    const filePath = req.file ? `${req.file.destination}/${req.file.filename}` : "";
    try {
      const id: string = req.params.id;
      if (coverPhoto !== "") req.body.coverPhoto = coverPhoto;
      const book = await bookController.editBook(id, req.body);

      res.status(200).json({ status: 'Updated successfully', updatedBook: book });
    } catch (error: any) {
      fs.unlinkSync(filePath);
      next(new httpException(401, error.message as string));
    }
  }

}

export default bookAdminRouter;