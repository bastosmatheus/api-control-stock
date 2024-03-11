class UnprocessableEntity extends Error {
  public readonly message: string;
  public readonly type: string;
  public readonly statusCode: number;

  constructor(message: string) {
    super(message);

    this.message = message;
    this.type = "Unprocessable Entity";
    this.statusCode = 422;
  }
}

export { UnprocessableEntity };
