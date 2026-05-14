import { useCallback, useState } from "react";
import { getFriendlyErrorMessage } from "../services/apiClient";

type AsyncActionOptions<TResult> = {
  onSuccess?: (result: TResult) => void;
  onError?: (error: unknown) => void;
};

export function useAsyncAction<TArgs extends unknown[], TResult>(
  action: (...args: TArgs) => Promise<TResult>,
  options: AsyncActionOptions<TResult> = {}
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const execute = useCallback(
    async (...args: TArgs): Promise<TResult | null> => {
      try {
        setIsLoading(true);
        setError("");

        const result = await action(...args);

        options.onSuccess?.(result);

        return result;
      } catch (error) {
        setError(getFriendlyErrorMessage(error));
        options.onError?.(error);

        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [action, options]
  );

  const reset = useCallback(() => {
    setError("");
    setIsLoading(false);
  }, []);

  return {
    execute,
    reset,
    isLoading,
    error,
    hasError: Boolean(error),
  };
}