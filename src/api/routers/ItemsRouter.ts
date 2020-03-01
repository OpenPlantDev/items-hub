import {  Router, Request, Response, NextFunction } from "express";
import { IApiRouter } from "./IApiRouter";
import { ItemsController } from "../controllers/ItemsController";

export class ItemsRouter implements IApiRouter {

  public route: string = "/api/items";
  private _controller: ItemsController;

  constructor(controller: ItemsController ) {
    this._controller = controller;
  }

  public routeHandler(): Router {

    const router = Router();

    // handle GET for ${this.route}
    router.get("/", async (req: Request, res: Response, next: NextFunction) => {
      await this._controller.get(req, res, next);
    });

    // handle GET for ${this.route}/:componentId
    router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
      await this._controller.getById(req, res, next);
    });

    // handle POST for ${this.route}
    router.post("/", async (req: Request, res: Response, next: NextFunction) => {
      await this._controller.add(req, res, next);
    });

    // handle PUT for /api/components/:componentId
    router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
      await this._controller.update(req, res, next);
    });

    // handle DELETE for ${this.route}/:componentId
    router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
      await this._controller.delete(req, res, next);
    });

    return router;
  }

}
