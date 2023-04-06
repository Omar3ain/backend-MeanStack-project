import express , { Application } from 'express';
import compression from 'compression';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import bodyParser from 'body-parser';
import path from 'path';

import ErrorMiddleware from '@/middlewares/error.middleware';
import RouteInterface from '@/utils/interfaces/router.interface';
import initializeDatabaseConnection from '@/config/db';

class App {
  public express: Application;
  public port :number;

  constructor(router : RouteInterface , port : number) {
    this.express = express();
    this.port = port;

    this.initializeDatabaseConnection();
    this.initializeMiddleware();
    this.initializeControllers(router);
    this.initializeErrorHandling();
  }
  
  private initializeDatabaseConnection() : void {
    initializeDatabaseConnection()
  }

  private initializeMiddleware() : void {
    this.express.use(helmet())
    this.express.use(cors());
    this.express.use(morgan('dev'));
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({ extended: true }));
    this.express.use('/uploads', express.static(path.join(__dirname,'../uploads')));
    this.express.use(compression());
  }

  private initializeControllers(router : RouteInterface) : void {
      this.express.use(router.router);
  }

  private initializeErrorHandling() : void {
    this.express.use(ErrorMiddleware);
  }

  public listen() : void {
    this.express.listen(this.port, () => {
      console.log(`App listening on port http://localhost:${this.port}`);
    })
  }

}

export default App;