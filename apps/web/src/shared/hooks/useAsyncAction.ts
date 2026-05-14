import { useCallback, useState } from "react";
import { getFriendlyErrorMessage } from "../services/apiClient";

type AsyncActionOptions<
  TArgs extends unknown[],
  TResult
> = {
  successMessage?: string;

  onSuccess?: (result: TResult, ...args: TArgs) => void;

  onError?: (error: unknown) => void;

  showToast?: (
    message: string,
    type: "success" | "error"
  ) => void;
};

export function useAsyncAction<TArgs extends unknown[], TResult>(
  action: (...args: TArgs) => Promise<TResult>,
  options: AsyncActionOptions<TArgs, TResult> = {}
) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const execute = useCallback(
    async (...args: TArgs): Promise<TResult | null> => {
      try {
        setIsLoading(true);
        setError("");

        const result = await action(...args);

        if (options.successMessage && options.showToast) {
          options.showToast(
            options.successMessage,
            "success"
          );
        }

        options.onSuccess?.(result, ...args);

        return result;
      } catch (error) {
        const message = getFriendlyErrorMessage(error);

        setError(message);

        if (options.showToast) {
          options.showToast(message, "error");
        }

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