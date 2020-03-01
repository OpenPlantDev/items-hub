import {IComponent} from "../../../src/api/models/Component";
import {IComponentsRepository} from "../../../src/api/repositories/IComponentsRepository";

export enum MockRepoErrorState {
  NoError,
  ReturnError,
  ThrowError,
}

export class MockRepo implements IComponentsRepository {

  private _errorState: MockRepoErrorState = MockRepoErrorState.NoError;
  private _data: any = undefined;
  constructor() {
  }

  public SetReturnState(errorState: MockRepoErrorState, data: any) {
    this._errorState = errorState;
    this._data = data;
  }

  private async ReturnSomething(): Promise<any> {
    switch (this._errorState) {
      case MockRepoErrorState.ReturnError: {
        return new Promise((resolve) => {
          resolve(new Error("Returned error"));
        });
      }
      case MockRepoErrorState.ThrowError: {
        throw new Error("Thrown error");
      }
      default: {
        // return valid data
        return new Promise((resolve) => {
          resolve(this._data);
        });
      }
    }
  }

  public async Get(queryOptions?: any): Promise<IComponent[] | Error> {
    return this.ReturnSomething();
  }

  public async GetById(id: string): Promise<IComponent | Error> {
    return this.ReturnSomething();
  }

  public async Add(comp: IComponent): Promise<string | Error> {
    return this.ReturnSomething();
  }

  public async Update(comp: IComponent): Promise<IComponent | Error> {
    return this.ReturnSomething();
  }

  public async Delete(id: string): Promise<boolean | Error> {
    return this.ReturnSomething();
  }

}
