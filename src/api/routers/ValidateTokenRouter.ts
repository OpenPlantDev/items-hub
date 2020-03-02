import {Router, Request, Response, NextFunction} from "express";
import { IApiRouter } from "./IApiRouter";

// ComponentsRouter is handling routes for /api/components
export class ValidateTokenRouter implements IApiRouter {

  public route: string = "/api/validatetoken";

  public routeHandler(): Router {

    const router = Router();

    // handle GET for ${this.route}/validatetoken, if it got this far, then it has passed validateion
    router.get("/", async (req: Request, res: Response, next: NextFunction) => {
      return res.status(200).json({valid: true});
    });

    return router;
  }
}
