import {Request, Response, NextFunction} from "express";
import {ApiError} from "../ApiError";
import {QueryOptions} from "../../services/queryOptions";
import { SocketService } from "../../services/socketService";
import {Item} from "../models/Item";
import { ItemsRepository } from "../repositories/ItemsRepository";

export class ItemsController {

  public resourceName: string = "items";
  private _repository: ItemsRepository;
  private _socketService: SocketService;

  constructor(repository: ItemsRepository, socketService: SocketService) {
    this._repository = repository;
    this._socketService = socketService;
  }

  public getItemFromBody(body: any): Item {
    const comp: Item = {
      id: body.id,
      className: body.className,
      tag: body.tag,
      description: body.description,
      properties: body.properties,
    };

    return comp;

  }
  public async get(req: Request, res: Response, next: NextFunction): Promise<Response | void> {

    try {
      const queryOptions = QueryOptions.getOptions(req.query);
      const result = await this._repository.get(queryOptions);
      if (result instanceof Error) {
        return next (new ApiError(400, result.message));
      }
      return res.status(200).json(result);
    } catch (err) {
      return next (new ApiError(500, err.message));
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const id = req.params.id;
      const result = await this._repository.getById(id);
      if (result instanceof Error) {
        return next (new ApiError(404, result.message));
      }
      return res.status(200).json(result);
    } catch (err) {
      return next (new ApiError(500, err.message));
    }
  }

  public async add(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      if (!req.body) {
        return next (new ApiError(400, `Request has no body`));
      }
      const item: Item = this.getItemFromBody(req.body);
      item.id = "";
      const result = await this._repository.add(item);
      if (result instanceof Error) {
        return next (new ApiError(400, result.message));
      }
      this._socketService.emitMessage("DbUpdated", `Item ${result} was added`);
      return res.status(201).json(result);
    } catch (err) {
      return next (new ApiError(500, err.message));
    }
  }

  public async update(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      if (!req.body) {
        return next (new ApiError(400, `Request has no body`));
      }
      const item: Item = this.getItemFromBody(req.body);
      item.id = req.params.id;
      const result = await this._repository.update(item);
      if (result instanceof Error) {
        return next (new ApiError(400, result.message));
      }
      this._socketService.emitMessage("DbUpdated", `Item ${result.id} was updated`);
      return res.status(201).json(result);
    } catch (err) {
      return next (new ApiError(500, err.message));
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction): Promise<Response | void> {
    try {
      const id = req.params.id;
      const result = await this._repository.delete(id);
      if (result instanceof Error) {
        return next (new ApiError(400, result.message));
      }
      this._socketService.emitMessage("DbUpdated", `Item ${id} was deleted`);
      return res.status(200).json(result);
    } catch (err) {
      return next (new ApiError(500, err.message));
    }
  }

}
