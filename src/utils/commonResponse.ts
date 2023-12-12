export class CommonResponse<T> {
    constructor(
      public status: boolean,
      public message: string,
      public data?: T,
    ) {}
  }
  