import { Card } from "./ui/card";
import { useFetchStation } from "~/lib/use-fetch-station";
import type { Area } from "~/routes/app";
import { Table } from "./ui/table";
import { Link, useOutletContext } from "react-router";
import DepartureRow from "./DepartureRow";

export default function StationCard({ station }: { station: Area }) {
  const { apiKey }: { apiKey: string } = useOutletContext();

  let response = useFetchStation(station.id, apiKey);

  let departues = response?.departures.slice(0, 5);

  let departuresList = departues
    ?.sort((e1, e2) => Date.parse(e1.realtime) - Date.parse(e2.realtime))
    .map((d) => <DepartureRow departure={d} />);

  return (
    <Link to={`/details/${station.id}`}>
      <Card className="p-4 shadow-lg bg-green-100 opacity-80 transition-all hover:-translate-y-2">
        <h1 className="text-lg font-bold">{station.name}</h1>
        <Table>{departuresList}</Table>
      </Card>
    </Link>
  );
}
