export { cn } from "cn";

export async function safeFetchJson<T>(url: string | URL, init?: RequestInit) {
  return fetch(url, init).then((response) => {
    if (!response.ok) {
      throw new Error(
        `${url} returned status ${response.status} - (${response.statusText})}`,
      );
    }
    return response.json() as Promise<T>;
  });
}
