import express from "express";
import * as http from "http";
import {ApiError} from "./ApiError";
import {IApiRouter} from "./routers/IApiRouter";
import { LoginRouter } from "./routers/LoginRouter";
import * as AuthService from "../services/authService";

export class Api {

  private _api: express.Application;
  public httpServer: http.Server;

  constructor() {
    this._api = express();
    this.httpServer = new http.Server(this._api);
  }

  public start(routers: IApiRouter[]): void {
    const api = this._api;

    // add middleware to read body of request
    api.use(express.json());
    api.use(express.urlencoded({extended: true}));

    // allow CORS
    api.use((req, res, next) => {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
      if (req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
        return res.status(200).json({});
      }
      return next();
    });

    // login needs to be before the authentication calls
    const loginRouter = new LoginRouter();
    api.use(loginRouter.route, loginRouter.routeHandler());

    // Authentication
    // first call /api/login with basic auth (for now username@bentley.com with password="123")
    // this returns a token, pass this token with all requests using Bearer token
    api.use("/api", (req, res, next) => {
      const authHeader = req.get("Authorization") as string;
      const authResult = AuthService.validateToken(authHeader);
      if (authResult instanceof ApiError) {
        return next(authResult);
      }
      return next();
    });

    // handle routes defined by routers
    for (const router of routers) {
      api.use(router.route, router.routeHandler());
    }

    // handle error for non-handled routes
    api.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
      // create new error with status 404
      const err = new ApiError(404, `Route not found`);
      next(err);
    });

    // handle errors thrown during the handling of the request
    api.use((err: ApiError, req: express.Request, res: express.Response, next: express.NextFunction) => {
      const status = err instanceof ApiError ? err.status : 500;
      const message = err.message ? err.message : "Server error";

      res.status(status).json({message});

    });

    // Start the server
    const port = process.env.PORT || 3000;

    this.httpServer.listen(port, () => {
      console.log(`Api is listening on http://localhost:${port}`);
    });
  }
}
