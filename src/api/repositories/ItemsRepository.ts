import { Item } from "../models/Item";
import { ItemsDataStore } from "../dataStores/ItemsDataStore";
import { IQueryOptions } from "../../services/queryOptions";

export class ItemsRepository {

  private _dataStore: ItemsDataStore;

  constructor(dataStore: ItemsDataStore) {
    this._dataStore = dataStore;
  }

  public async get(queryOptions?: IQueryOptions): Promise<Item[] | Error> {
    return this._dataStore.getItems(queryOptions);
  }

  public async getById(id: string): Promise<Item | Error> {
    return this._dataStore.getItemById(id);
  }

  public async add(comp: Item): Promise<string | Error> {
    return this._dataStore.addItem(comp);
  }

  public async update(comp: Item): Promise<Item | Error> {
    return this._dataStore.updateItem(comp);
  }

  public async delete(id: string): Promise<boolean | Error> {
    return this._dataStore.deleteItem(id);
  }

}
