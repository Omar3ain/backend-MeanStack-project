import authorController from '@/controllers/author'
import verifyAdmin from '@/middlewares/verifyAdmin';
import httpException from '@/utils/exceptions/http.exception';
import RouteInterface from '@/utils/interfaces/router.interface';

import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';

class AuthorAdminRouter implements RouteInterface {
    public router: Router = Router();
    public upload!: multer.Multer;

    constructor() {
        this.upload = multer();
        this.initializeRoutes()
    }

    private initializeRoutes = () => {
        // this.router.post('/', verifyAdmin, this.upload.none(), this.createAuthor)
        this.router.post('/', verifyAdmin, this.upload.none(), this.createAuthor)
    }
    private createAuthor = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {

        try {
            const createdAuthor = await authorController.createAuthor(req.body);
            res.status(200).json(createdAuthor);
        } catch (err: any) {
            console.error('Error creating author:', err);
            next(new httpException(401, err.massage as string));
        }
    };
}

export default AuthorAdminRouter;