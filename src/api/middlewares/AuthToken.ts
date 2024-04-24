import "dotenv/config";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

class AuthToken {
  public async verifyToken(req: Request, res: Response, next: NextFunction) {
    const bearerToken = req.headers.authorization;

    if (!bearerToken) {
      return res.status(400).json({
        type: "Bad Request",
        statusCode: 400,
        message: "Informe o token de autenticação",
      });
    }

    const token = bearerToken.split(" ")[1] as string;

    const tokenSchema = z.object({
      token: z.string({
        invalid_type_error: "O token de autenticação deve ser uma string",
      }),
    });

    const tokenValidation = tokenSchema.safeParse({ token });

    if (!tokenValidation.success) {
      const tokenError = tokenValidation.error.errors[0];

      return res.status(401).json({
        type: "Unauthorized",
        statusCode: 401,
        message: tokenError.message,
      });
    }

    const verifyToken = jwt.verify(token, process.env.JWT_PASS as string, (err, decoded) => {
      if (err) {
        return res.status(401).json({
          type: "Unauthorized",
          statusCode: 401,
          message: "Token inválido",
        });
      }

      req.infosToken = decoded;

      next();
    });
  }
}

export { AuthToken };
