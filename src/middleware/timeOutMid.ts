// src/middleware/retryTimeoutMiddleware.ts
import { Request, Response, NextFunction } from 'express';
import retry from 'async-retry'

interface RetryOptions {
  retries?: number;
  minTimeout?: number;
  factor?: number;
  requestTimeout?: number; // in ms
}

export const retryTimeoutMiddleware = (options: RetryOptions = {}) => {
  const {
    retries = 3,
    minTimeout = 500,
    factor = 2,
    requestTimeout = 12000, // default 12s request timeout
  } = options;

  return (handler: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), requestTimeout);

      try {
        const result = await retry(
          async () => {
            // attach abort signal if needed
            return handler(req, res, next);
          },
          {
            retries,
            minTimeout,
            factor,
          }
        );
        return result;
      } catch (err: any) {
        if (controller.signal.aborted) {
          return res.status(503).json({ message: 'Request timed out. Please try again.' });
        }
        next(err);
      } finally {
        clearTimeout(timeout);
      }
    };
  };
};
