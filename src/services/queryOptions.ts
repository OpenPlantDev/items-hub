export interface IQueryOptions {
  filter: string | undefined;
  orderBy: string | undefined;
  limit: number;
}

export class QueryOptions {

  public static getOptions(queryStringParams: any) {
    const filter = queryStringParams.filter ? queryStringParams.filter : undefined;
    const orderBy = queryStringParams.orderby ? queryStringParams.orderby : undefined;
    let limit: number = 0;
    if (queryStringParams.limit) {
        const limitNum = Number(queryStringParams.limit);
        if (!isNaN(limitNum)) {
            limit = limitNum;
        }
    }
    return {filter, orderBy, limit};
  }
}
