import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      // 1. Grab the token from the Authorization header (Bearer token)
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // 2. THIS MUST MATCH THE SECRET IN YOUR auth.module.ts
      secretOrKey: 'SUPER_SECRET_KEY_CHANGE_THIS_LATER', 
    });
  }

  // 3. If the token is valid, NestJS runs this function.
  // The 'payload' is the decrypted data from the token.
  async validate(payload: any) {
    // This attaches the user data to the 'request' object (req.user)
    return { id: payload.sub, email: payload.email, role: payload.role };
  }
}