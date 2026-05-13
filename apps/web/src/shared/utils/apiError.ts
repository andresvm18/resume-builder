export async function getApiErrorMessage(response: Response): Promise<string> {
  try {
    const data = await response.json();

    if (data?.message) {
      return data.message;
    }

    return "No pudimos completar esta acción. Intenta nuevamente.";
  } catch {
    return "No pudimos completar esta acción. Intenta nuevamente.";
  }
}