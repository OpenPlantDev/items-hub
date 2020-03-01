import {IProperties} from "./Properties";

export interface Item {
  id: string;
  className: string;
  tag: string;
  description?: string;
  properties?: IProperties;
}
