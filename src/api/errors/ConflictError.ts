class ConflictError extends Error {
  public readonly message: string;
  public readonly type: string;
  public readonly statusCode: number;

  constructor(message: string) {
    super(message);

    this.message = message;
    this.type = "Conflict";
    this.statusCode = 409;
  }
}

export { ConflictError };
