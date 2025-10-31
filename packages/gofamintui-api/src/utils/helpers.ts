
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
export const hashPassword = async (password: string) => {
	return await bcrypt.hash(password, 12);
};

export const comparePassword = async (password: string, hashedPassword: string) => {
	return await bcrypt.compare(password, hashedPassword);
};

export const generateToken = async (bytes: number = 32): Promise<string> =>{
  return crypto.randomBytes(bytes).toString('hex');
}
