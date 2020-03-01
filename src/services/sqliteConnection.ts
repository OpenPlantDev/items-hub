import sqlite3 from "sqlite3";
import {IQueryOptions} from "./queryOptions";

export interface IExecuteResults {
  rowsAffected: number;
  lastId: string;
}

export class SqliteConnection {

  private _db: sqlite3.Database | undefined = undefined;

  constructor(path: string) {
    this.connect(path);
  }

  public connect(path: string): boolean | Error {

    const db: sqlite3.Database = new sqlite3.Database(path);
    if (!db) {
      return (new Error(`Unable to connect to ${path}`));
    }
    this._db = db;
    return true;
  }

  public async query(sql: string): Promise<any[] | Error> {
    return new Promise((resolve, reject) => {
      if (this._db === undefined) {
        reject(new Error("Not connected"));
      } else {
        this._db.all(sql, [], (err: any, rows: any) => {
          if (err) {
            console.log(`Query error: ${err.message}`);
            resolve(err);
          } else {
            resolve(rows);
          }
      });
      }
    });
  }

  public async execute(sql: string, params: any = []): Promise<IExecuteResults> {
    return new Promise((resolve, reject) => {
      if (this._db === undefined) {
        reject(new Error("Not connected"));
      } else {
        // can't use arrow function here because this is updated by calling method
        // tslint:disable-next-line:only-arrow-functions
        this._db.run(sql, params, function (err: any ) {
          if (err) {
            reject(err);
          } else {
            resolve({rowsAffected: this.changes, lastId: this.lastID.toString()});
          }
        });
      }
    });
  }

  public getQueryString(tableName: string, options?: IQueryOptions) {
    let whereClause = "";
    if (options) {
        whereClause = options.filter ? `Where ${options.filter}`  : whereClause;
        whereClause = options.orderBy ? `${whereClause}  order by ${options.orderBy}` : whereClause;
        whereClause = (options.limit > 0) ? `${whereClause} Limit ${options.limit}` : whereClause;
    }
    return `Select * from ${tableName} ${whereClause}`;
  }
}
