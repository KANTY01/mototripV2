import { Redis } from 'ioredis';

declare const redisClient: Redis;
export default redisClient;

declare module 'ioredis' {
  interface Redis {
    get(key: string): Promise<string | null>;
    set(key: string, value: string): Promise<'OK'>;
    set(key: string, value: string, mode: 'EX', duration: number): Promise<'OK'>;
    del(key: string): Promise<number>;
  }
}
