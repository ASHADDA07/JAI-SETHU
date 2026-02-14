import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class SecurityService {
  /**
   * Generates a SHA-256 hash (digital fingerprint) for a file or text
   */
  generateHash(data: string | Buffer): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  /**
   * Generates a unique 'Chain of Custody' token for a case
   */
  generateCaseToken(userId: string, timestamp: string): string {
    const raw = `${userId}-${timestamp}-${Math.random()}`;
    return this.generateHash(raw);
  }
}