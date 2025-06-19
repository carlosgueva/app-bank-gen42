import express, { Router } from 'express';
import cookieParser from 'cookie-parser';

interface Options {
  port: number;
  routes: Router;
}

export class Server {
  private readonly app = express();
  private readonly port: number;
  private readonly routes: Router;

  constructor(option: Options) {
    this.port = option.port;
    this.routes = option.routes;
  }

  async start() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());

    this.app.use(this.routes);
    /*this.app.all('*', (req: Request, res: Response) => {
      res.status(404).json({ message: 'Not Found' });
    });*/

    this.app.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });
  }
}
