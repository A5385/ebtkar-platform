import { compare, hash } from 'bcryptjs';

// Hash a password
export const saltRounds = 12;
export const hashData = async (password: string) => {
    return await hash(password, saltRounds);
};

// Compare a password during login
export const compareHashedData = async (password: string, hashedPassword: string) => {
    return await compare(password, hashedPassword);
};
