import { Router, Request, Response, NextFunction } from 'express';
import { Multer } from 'multer';
import fs from 'fs';

import RouteInterface from '@/utils/interfaces/router.interface';
import userController from '@/controllers/user'
import httpException from '@/utils/exceptions/http.exception';
import verifyAuth from '@/middlewares/verifyUser';
import validationMiddleware from '@/middlewares/validation.middleware';
import validate from '@/utils/validations/user/schema';
import formUpload from '@/middlewares/form.middleware';
import { UserBookQuery } from '@/utils/interfaces/user.interface';

class userRouter implements RouteInterface {
  public router: Router = Router();
  public upload: Multer;
  constructor() {
    this.upload = formUpload('uploads/users')
    this.initializeRoutes()
  }

  private initializeRoutes = () => {
    this.router.get('/', verifyAuth, this.getUser);
    this.router.patch('/', verifyAuth, this.upload.single("avatar"), validationMiddleware(validate.userEditSchema), this.update);
    this.router.get('/books', verifyAuth, this.getBookByShelve);
  }

  private getUser = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const user = await userController.getUserDetails((<any>req).user._id);
      res.status(200).json(user);
    } catch (error: any) {
      next(new httpException(401, error.message as string));
    }
  }

  private update = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    const avatar = req.file ? `${req.protocol}://${req.headers.host}/${req.file.destination}/${req.file.filename}` : "";
    const filePath = req.file ? `${req.file.destination}/${req.file.filename}` : "";
    try {
      const id: string = (<any>req).user._id;
      if (avatar !== "") req.body.avatar = avatar;
      const user = await userController.editUser(id, req.body);
      res.status(200).json({ status: 'Updated successfully', updatedUser: user });
    } catch (error: any) {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      next(new httpException(401, error.message as string));
    }
  }

  /*
    /profile/books?shelve=read&skip=0&limit=10
  */
  private getBookByShelve = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const id: string = (<any>req).user._id;
      const { shelve, skip, limit }: UserBookQuery = req.query;
      const user = await userController.getUserBooks(id, { shelve, skip, limit });
      res.status(200).json(user);
    } catch (error: any) {
      next(new httpException(401, error.message as string));
    }
  }
}

export default userRouter;