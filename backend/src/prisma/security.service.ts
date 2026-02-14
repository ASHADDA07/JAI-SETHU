import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';

@Injectable()
export class SecurityService {
  /**
   * Generates a SHA-256 hash for any input
   */
  hashData(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  /**
   * Creates a tamper-proof hash for an Audit Log entry
   */
  signLog(action: string, userId: string, targetId: string): string {
    const payload = `${action}-${userId}-${targetId}-${Date.now()}`;
    return this.hashData(payload);
  }
}