
import { Request } from "express";
import { User } from '@prisma/client';




export interface AuthRequest extends Request {
  user?: User;
}

export interface   Multer {
      File: {
        fieldname: string;
        originalname: string;
        encoding: string;
        mimetype: string;
        size: number;
        buffer: Buffer;
      };
    }
