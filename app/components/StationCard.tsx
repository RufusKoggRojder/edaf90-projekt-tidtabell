import { safeFetchJson } from "~/lib/utils";
import { Card } from "./ui/card";
import { useEffect, useState } from "react";
import { useFetchStation } from "~/lib/use-fetch-station";

const API_KEY = import.meta.env.VITE_API_KEY;

export default function StationCard({ station }: { station: string }) {
  let response = useFetchStation(station, API_KEY);

  console.log(response);

  let departues = response?.departures.slice(0, 6);

  let departuresList = departues?.map((d) => {
    let currentTime = new Date();
    let toDep = new Date(Date.parse(d.realtime) - currentTime.getTime());
    return (
      <>
        <span>
          {d.route.designation} -{d.realtime}
          <br />
          {toDep.getMinutes()} min till avgång
        </span>
      </>
    );
  });

  return <Card>{departuresList}</Card>;
}
