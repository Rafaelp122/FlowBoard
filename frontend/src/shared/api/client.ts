export async function apiClient<T>(url: string, options?: RequestInit): Promise<T> {
  const response = await fetch(url, options);
  const data = response.headers.get("content-type")?.includes("application/json")
    ? await response.json()
    : undefined;
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  return { data, status: response.status, headers: response.headers } as T;
}
