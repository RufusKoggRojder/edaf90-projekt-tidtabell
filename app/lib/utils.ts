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

export async function testAPI(apiKey: string): Promise<boolean> {
  return fetch(
    `https://realtime-api.trafiklab.se/v1/departures/740000120?key=${apiKey}`,
  ).then((response) => response.ok);
}
