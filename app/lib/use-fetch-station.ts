import { useEffect, useState } from "react";
import { safeFetchJson, useInterval } from "./utils";

function fetchStation(
  station: string,
  API_KEY: string,
): Promise<DeparturesResponse> {
  const response = safeFetchJson(
    `https://realtime-api.trafiklab.se/v1/departures/${station}?key=${API_KEY}`,
  );
  return response as Promise<DeparturesResponse>;
}

function useFetchStation(station: string, API_KEY: string) {
  const [data, setData] = useState<DeparturesResponse | undefined>(undefined);

  const safeFetch = () => {
    let ignore = false;
    fetchStation(station, API_KEY).then((d) => {
      if (!ignore) {
        setData(d);
      }
    });
    return () => {
      ignore = true;
    };
  };
  useEffect(safeFetch, [station]);
  useInterval(safeFetch, 30 * 1000);
  return data;
}

export { useFetchStation, fetchStation };
