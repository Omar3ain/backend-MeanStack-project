import { Router, Request, Response, NextFunction } from 'express';

import RouteInterface from '@/utils/interfaces/router.interface';
import authorController from '@/controllers/author';
import httpException from '@/utils/exceptions/http.exception';
import Pagination from '@/utils/interfaces/pagination.interface';

class authorRouter implements RouteInterface {
    public router: Router = Router();
    constructor() {
        this.initializeRoutes();
    }
    private initializeRoutes = () => {
        this.router.get('/', this.getAuthors);
        this.router.get('/:id', this.getAuthorById);


    }

    private getAuthors = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {

            const authors = await authorController.getAllAuthor();
            res.status(200).json(authors);
        } catch (error: any) {
            next(new httpException(401, error.message as string));
        }
    }
    private getAuthorById = async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
        try {
            const author = await authorController.getAuthorById(req.params.id)
            if (author) { res.status(200).json(author) }


        }
        catch (error: any) {
            next(new httpException(401, error.massage as string))
        }
    }



}

export default authorRouter;