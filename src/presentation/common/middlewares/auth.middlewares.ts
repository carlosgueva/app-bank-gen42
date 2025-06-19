import { NextFunction, Request, Response } from 'express';
import { JwtAdapter } from '../../../config/jwt.adapter';
import { User } from '../../../data';

export class AuthMiddleware {
  static async protect(req: Request, res: Response, next: NextFunction) {
    let token = req?.cookies?.token;
    if (!token) {
      return res.status(401).json({
        message: 'token not provided',
      });
    }

    try {
      const payload = (await JwtAdapter.validateToken(token)) as { id: string };
      if (!payload) return res.status(401).json({ message: 'invalid token' });

      const user = await User.findOne({
        where: {
          id: payload.id,
        },
      });
      if (!user) return res.status(401).json({ message: 'invalid token' });

      req.body.sessionUser = user;
      next();
    } catch (error) {
      return res.status(500).json({ message: 'internal server error' });
    }
  }
}
