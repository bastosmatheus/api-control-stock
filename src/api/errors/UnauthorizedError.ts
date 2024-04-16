class UnauthorizedError extends Error {
  public readonly message: string;
  public readonly type: string;
  public readonly statusCode: number;

  constructor(message: string) {
    super(message);

    this.message = message;
    this.type = "Unauthorized";
    this.statusCode = 401;
  }
}

export { UnauthorizedError };
