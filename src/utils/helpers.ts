import { randomUUID } from 'crypto';
import bcrypt from 'bcrypt';
import config from '../config/config';

export const generateTenantId = (): string => {
  return `tenant_${randomUUID().replace(/-/g, '').substring(0, 16)}`;
};

export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, config.security.bcryptRounds);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash);
};