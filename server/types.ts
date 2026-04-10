/**
 * Type utility functions and type guards for server-side code
 */

/**
 * Type guard to check if a value is an Error object
 */
export function isError(error: unknown): error is Error {
  return error instanceof Error;
}

/**
 * Type guard to check if a value has a message property
 */
export function hasMessage(error: unknown): error is { message: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof error.message === 'string'
  );
}

/**
 * Safely extract error message from unknown error type
 */
export function getErrorMessage(error: unknown): string {
  if (isError(error)) {
    return error.message;
  }
  if (hasMessage(error)) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unknown error occurred';
}

/**
 * Express session with cart property
 */
export type SessionWithCart = {
  cartId?: string;
  [key: string]: unknown;
};

/**
 * Express Request with session - use intersection with Express's Request
 * to maintain full compatibility
 */
export type RequestWithSession = {
  session?: SessionWithCart;
};

/**
 * Express Response (minimal subset used)
 */
export interface Response {
  json(data: unknown): Response;
  status(code: number): Response;
}

/**
 * Express App (minimal subset used)
 */
export interface ExpressApp {
  get(
    path: string,
    handler: (req: RequestWithSession, res: Response) => void | Promise<void>
  ): void;
  post(
    path: string,
    handler: (req: RequestWithSession, res: Response) => void | Promise<void>
  ): void;
  put(
    path: string,
    handler: (req: RequestWithSession, res: Response) => void | Promise<void>
  ): void;
  delete(
    path: string,
    handler: (req: RequestWithSession, res: Response) => void | Promise<void>
  ): void;
  all(
    path: string,
    handler: (req: RequestWithSession, res: Response) => void | Promise<void>
  ): void;
  use(...args: unknown[]): void;
}
