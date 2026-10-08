import { Button } from "@base-ui/react/button";
import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router";

function readStationIds(): string[] {
  const valueString = localStorage.getItem("stationIds");
  if (!valueString) {
    return [];
  }
  return JSON.parse(valueString) as string[];
}

export default function App() {
  const [stationIds, setStationIds] = useState<string[]>(() =>
    typeof window === "undefined" ? [] : readStationIds(),
  );
  useEffect(() => {
    localStorage.setItem("stationIds", JSON.stringify(stationIds));
  }, [stationIds]);

  return (
    <div className="flex w-full items-center justify-center p-10 lg:p-20">
      <div className="grid w-full grid-rows-1 gap-4 lg:w-3/4">
        <h1 className="text-center text-3xl font-bold">Tågstationer</h1>
        <Link to="/add">Lägg till station</Link>
        <Outlet />
      </div>
    </div>
  );
}
