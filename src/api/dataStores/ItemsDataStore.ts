import { Item } from "../models/Item";
import { IQueryOptions } from "../../services/queryOptions";

export interface ItemsDataStore {

  getItems: (queryOptions?: IQueryOptions) => Promise<Item[] | Error>;
  getItemById: (id: string) => Promise<Item | Error>;
  addItem: (comp: Item) => Promise<string | Error>;
  updateItem: (comp: Item) => Promise<Item | Error>;
  deleteItem: (id: string) => Promise<boolean | Error>;
}
