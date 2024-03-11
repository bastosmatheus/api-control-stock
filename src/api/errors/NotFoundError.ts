class NotFoundError extends Error {
  public readonly message: string;
  public readonly type: string;
  public readonly statusCode: number;

  constructor(message: string) {
    super(message);

    this.message = message;
    this.type = "Not Found";
    this.statusCode = 404;
  }
}

export { NotFoundError };
