import { ItemsDataStore } from "./ItemsDataStore";
import { Item } from "../models/Item";
import {Guid} from "guid-typescript";

const delay = async (ms: number = 1000) => new Promise((res) => setTimeout(res, ms));

export class FakeDb implements ItemsDataStore {

  private _items: Item[] = [];

  public seedDb(items: Item[]) {
    this._items = items;
  }

  public async getItems(): Promise<Item[]> {
    await delay();
    return new Promise((resolve, reject) => {
      resolve(this._items);
    });
  }

  public async getItemById(id: string): Promise<Item | Error> {
    await delay();
    return new Promise((resolve, reject) => {
      const comp = this._items.find((c) => c.id === id);
      if (comp) {
        return resolve(comp);
      }
      return resolve(new Error(`Item with id: ${id} was not found`));
    });
  }

  public async addItem(comp: Item): Promise<string | Error> {
    await delay();
    return new Promise((resolve, reject) => {
        // force new id
      comp.id = Guid.create().toString();
      this._items.push(comp);
      return resolve(comp.id);
    });
  }

  public async updateItem(comp: Item): Promise<Item | Error> {
    await delay();
    return new Promise((resolve, reject) => {
      const index = this._items.findIndex((c) => c.id === comp.id);
      if (index >= 0) {
        this._items.splice(index, 1);
        this._items.push(comp);
        return resolve(comp);
      }
      return resolve(new Error(`Item with id: ${comp.id} was not found`));
    });
  }

  public async deleteItem(id: string): Promise<boolean | Error> {
    await delay();
    return new Promise((resolve, reject) => {
      const index = this._items.findIndex((c) => c.id === id);
      if (index >= 0) {
        this._items.splice(index, 1);
        return resolve(true);
      }
      return resolve(new Error(`Item with id: ${id} was not found`));
    });
  }

}
