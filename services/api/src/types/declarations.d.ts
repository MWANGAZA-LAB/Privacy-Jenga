declare module 'rate-limiter-flexible' {
  export interface RateLimiterOptions {
    storeClient?: any;
    keyPrefix?: string;
    points?: number;
    duration?: number;
    execEvenly?: boolean;
    blockDuration?: number;
    execEvenly?: boolean;
  }

  export class RateLimiterMemory {
    constructor(_options: RateLimiterOptions);
    consume(_key: string, _pointsToConsume?: number): Promise<any>;
  }

  export class RateLimiterRedis {
    constructor(_options: RateLimiterOptions);
    consume(_key: string, _pointsToConsume?: number): Promise<any>;
  }
}
