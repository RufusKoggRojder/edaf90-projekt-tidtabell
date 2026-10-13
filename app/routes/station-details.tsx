import { Link, useOutletContext, useSearchParams } from "react-router";
import { useFetchStation } from "~/lib/use-fetch-station";
import { Table, TableCell, TableRow } from "../components/ui/table";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import { Spinner } from "~/components/ui/spinner";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card.js";
import ApiValidator from "~/components/ApiValidator.js";
import { transportModeIcons } from "~/lib/shared.js";

export default function StationDetails({
  params,
}: {
  params: { stationId: string };
}) {
  const { apiKey }: { apiKey: string } = useOutletContext();

  let response = useFetchStation(params.stationId, apiKey);

  console.log(response);

  let departues = response?.departures.slice(0, 10);

  let departuresList = departues
    ?.sort((e1, e2) => Date.parse(e1.realtime) - Date.parse(e2.realtime))
    .map((d) => {
      let currentTime = new Date();
      let toDep = new Date(Date.parse(d.realtime) - currentTime.getTime());
      let late = new Date(Date.parse(d.realtime) - Date.parse(d.scheduled));
      let lateString = "";
      if (late.getTime() > 60000) {
        lateString = "(" + late.getMinutes() + " min försenad)";
      } else if (late.getTime() < -60000) {
        lateString = "(" + (60 - late.getMinutes()) + " min tidig)";
      }
      return (
        <TableRow>
          <TableCell>{transportModeIcons[d.route.transport_mode]}</TableCell>
          <TableCell>
            <h2 className="text-lg font-bold">{d.route.designation}</h2>
          </TableCell>
          <TableCell>
            <span className="font-light">från {d.route.origin.name}</span>
            <br />
            <span className="font-medium">till {d.route.destination.name}</span>
          </TableCell>
          <TableCell>
            avgår {d.realtime.split("T")[1].substring(0, 5)}{" "}
            <span className="text-destructive">{lateString}</span>
            <br />
            om {toDep.getMinutes()} min
          </TableCell>
        </TableRow>
      );
    });

  const [searchParams] = useSearchParams();
  const returnTo = "/" + (searchParams.get("returnTo") || "");

  const position: [number, number] | null =
    response?.stops?.[0]?.lat !== undefined &&
    response?.stops?.[0]?.lon !== undefined
      ? [response.stops[0].lat, response.stops[0].lon]
      : null;

  let map = position ? (
    <MapContainer
      className="aspect-3/2"
      center={position}
      zoom={13}
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {position[0] && <Marker position={position}></Marker>}
    </MapContainer>
  ) : (
    <Spinner />
  );

  return (
    <ApiValidator>
      <Card>
        <CardHeader>
          <div className="grid grid-cols-3">
            <Link to={returnTo}>
              <Button variant="outline">Tillbaka</Button>
            </Link>
            <CardTitle className="text-2xl text-center">
              {response?.stops[0].name}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="grid grid-cols-2">
          <Table>{departuresList}</Table>
          {map}
        </CardContent>
      </Card>
    </ApiValidator>
  );
}
