import { Router, Request, Response, NextFunction } from 'express';
import RouteInterface from '@/utils/interfaces/router.interface';
import bookController from '@/controllers/book'
import httpException from '@/utils/exceptions/http.exception';
import verifyAdmin from '@/middlewares/verifyAdmin'
import multer from 'multer';
import fs from 'fs';
import path from 'path';

class bookAdminRouter implements RouteInterface {
  public router: Router = Router();

  public upload: multer.Multer;
  constructor() {
    this.upload = multer({
      storage: multer.diskStorage({
        destination: (req: Request, file, cb) => {
          cb(null, 'uploads/books')
        },
        filename: (req: Request, file, cb) => {
          let timeStamp = Date.now();
          cb(null, file.originalname.split('.')[0] + "-" + timeStamp + '.' + file.originalname.split('.')[file.originalname.split('.').length - 1]);
        }
      }),
      fileFilter: (req: Request, file, cb) => {
        let ext = path.extname(file.originalname);
        if (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg') {
          return cb(new Error('Only images are allowed!'));
        }
        cb(null, true);
      }
    });
    this.initializeRoutes()
  }

  private initializeRoutes = () => {
    this.router.post('/', verifyAdmin, this.upload.single("coverPhoto"), this.makeBook);
    this.router.delete('/:id', verifyAdmin, this.deleteBook);
    this.router.patch(`/:id`, verifyAdmin, this.upload.single("coverPhoto"), this.update);
  }
  private makeBook = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const coverPhoto = req.file ? `${req.protocol}://${req.headers.host}/${req.file.destination}/${req.file.filename}` : "";
    const filePath = req.file ? `${req.file.destination}/${req.file.filename}` : "";    
    try {
      const book = await bookController.createBook(req.body,coverPhoto);;
      res.status(200).json({ book });
    } catch (error: any) {
      fs.unlinkSync(filePath);
      next(new httpException(401, error.message as string));
    }
  }

  private deleteBook = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const id : string = req.params.id;
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
      const id : string = req.params.id;
      if(coverPhoto !== "") req.body.coverPhoto = coverPhoto;
      const book = await bookController.editBook(id, req.body); 
      
      res.status(200).json({ status: 'Updated successfully' , updatedBook: book });
    } catch (error: any) {
      fs.unlinkSync(filePath);
      next(new httpException(401, error.message as string));
    }
  }

}

export default bookAdminRouter;