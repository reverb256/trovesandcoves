import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';

interface ApiErrorProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  isRetrying?: boolean;
}

export function ApiError({ title = 'Something went wrong', message, onRetry, isRetrying }: ApiErrorProps) {
  return (
    <Alert variant="destructive" className="my-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="mt-2">
        <div className="space-y-2">
          <p>{message}</p>
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              disabled={isRetrying}
              className="mt-2"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRetrying ? 'animate-spin' : ''}`} />
              {isRetrying ? 'Retrying...' : 'Try Again'}
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
}

interface ApiErrorWithActionsProps extends ApiErrorProps {
  actions?: React.ReactNode;
}

export function ApiErrorWithActions({ title, message, onRetry, isRetrying, actions }: ApiErrorWithActionsProps) {
  return (
    <Alert variant="destructive" className="my-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription className="mt-2">
        <div className="space-y-3">
          <p>{message}</p>
          <div className="flex gap-2 flex-wrap">
            {onRetry && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                disabled={isRetrying}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isRetrying ? 'animate-spin' : ''}`} />
                Retry
              </Button>
            )}
            {actions}
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
}

interface QueryErrorProps {
  error: Error | null;
  resetErrorBoundary?: () => void;
}

export function QueryError({ error, resetErrorBoundary }: QueryErrorProps) {
  return (
    <Alert variant="destructive" className="my-4">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error Loading Data</AlertTitle>
      <AlertDescription className="mt-2">
        <div className="space-y-2">
          <p>{error?.message || 'An unexpected error occurred while fetching data.'}</p>
          {resetErrorBoundary && (
            <Button
              variant="outline"
              size="sm"
              onClick={resetErrorBoundary}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
}
