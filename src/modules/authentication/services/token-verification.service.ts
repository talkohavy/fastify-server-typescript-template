import jwt, { type VerifyOptions } from 'jsonwebtoken';
import type { ConfigService } from '../../../lib/config-service';
import { ConfigKeys, type JwtConfig } from '../../../configurations';

export class TokenVerificationService {
  constructor(private readonly configService: ConfigService) {}

  async verifyToken(token: string): Promise<any> {
    const { accessSecret, issuer } = this.configService.get<JwtConfig>(ConfigKeys.Jwt);

    const options: VerifyOptions = { issuer };

    const decodedToken = (await new Promise((resolve, reject) => {
      jwt.verify(token, accessSecret, options, (error, decoded: any) => {
        if (error) return reject(error);

        resolve(decoded);
      });
    })) as any;

    return decodedToken;
  }
}
