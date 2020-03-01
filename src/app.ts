import {Api} from "./api/api";
import {IApiRouter} from "./api/routers/IApiRouter";
import { ItemsRouter } from "./api/routers/ItemsRouter";
import { ItemsController } from "./api/controllers/ItemsController";
import { ItemsRepository } from "./api/repositories/ItemsRepository";

import { SqliteConnection } from "./services/sqliteConnection";
import { ItemsDb } from "./api/dataStores/ItemsDb";

import { FakeDb } from "./api/dataStores/FakeDb";

import {SocketService} from "./services/socketService";

const fakeDb = new FakeDb();
fakeDb.seedDb(
  [
    {id: "1", className: "valve", tag: "FV-100", description: "Gate Valve", properties: {length: 25, weight: 50}},
    {id: "2", className: "valve", tag: "FV-101", description: "Globe Valve", properties: {length: 12, weight: 40}},
    {id: "3", className: "pump", tag: "FP-100", description: "Pump", properties: {length: 100, weight: 500}},
    {id: "4", className: "vessel", tag: "FH-100", description: "Tank", properties: {height: 125, diameter: 25, weight: 5000}},
  ],
);

const api = new Api();
const socketService = new SocketService(api.httpServer);

const sqliteConnection = new SqliteConnection("items.db");
const itemsDb = new ItemsDb(sqliteConnection);

const routers: IApiRouter[] = [
  new ItemsRouter(new ItemsController(new ItemsRepository(itemsDb), socketService)),

];

api.start(routers);

// let counter: number = 0;
// setInterval(() => {
//   const now = new Date();
//   console.log(`${counter++}: ${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`);
// }, 1000);
