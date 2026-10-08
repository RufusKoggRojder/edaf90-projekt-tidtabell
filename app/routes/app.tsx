import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router";

export type Area = {
  id: string;
  name: string;
  area_type: string;
  transport_modes: string[];
  stops: Stop[];
};

export type Stop = {
  id: string;
  name: string;
};

function readStops(): Area[] {
  const valueString = localStorage.getItem("stops");
  if (!valueString) {
    return [];
  }
  return JSON.parse(valueString) as Area[];
}

export default function App() {
  const [selectedStops, setSelectedStops] = useState<Area[]>(() =>
    typeof window === "undefined" ? [] : readStops(),
  );
  useEffect(() => {
    localStorage.setItem("stops", JSON.stringify(selectedStops));
  }, [selectedStops]);

  const apiKey = "3abcec8b068c4ccea3b9ea631039c1eb";

  return (
    <div className="flex w-full items-center justify-center p-10 lg:p-20">
      <div className="grid w-full grid-rows-1 gap-4 lg:w-3/4">
        <h1 className="text-center text-3xl font-bold">Tågstationer</h1>
        <Link to="/add">Lägg till station</Link>
        <Outlet
          context={{
            apiKey,
            selectedStops,
            setSelectedStops,
          }}
        />
      </div>
    </div>
  );
}
