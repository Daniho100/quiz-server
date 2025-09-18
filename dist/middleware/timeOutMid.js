"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.retryTimeoutMiddleware = void 0;
const async_retry_1 = __importDefault(require("async-retry"));
const retryTimeoutMiddleware = (options = {}) => {
    const { retries = 3, minTimeout = 500, factor = 2, requestTimeout = 12000, // default 12s request timeout
     } = options;
    return (handler) => {
        return async (req, res, next) => {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), requestTimeout);
            try {
                const result = await (0, async_retry_1.default)(async () => {
                    // attach abort signal if needed
                    return handler(req, res, next);
                }, {
                    retries,
                    minTimeout,
                    factor,
                });
                return result;
            }
            catch (err) {
                if (controller.signal.aborted) {
                    return res.status(503).json({ message: 'Request timed out. Please try again.' });
                }
                next(err);
            }
            finally {
                clearTimeout(timeout);
            }
        };
    };
};
exports.retryTimeoutMiddleware = retryTimeoutMiddleware;
