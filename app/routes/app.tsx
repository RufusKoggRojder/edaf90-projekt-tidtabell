import { useState } from "react";
import { Outlet } from "react-router";

export default function App() {
  const [stationIds, setStationIds] = useState<string[]>([]);

  return (
    <div className="flex w-full items-center justify-center p-10 lg:p-20">
      <div className="grid w-full grid-rows-1 gap-4 lg:w-3/4">
        <h1 className="text-center text-3xl font-bold">Tågstationer</h1>
        <Outlet />
      </div>
    </div>
  );
}
