import { randomInt } from 'crypto';

export const generateRandomOtp = () => {
    return String(randomInt(100_000, 1_000_000));
};
