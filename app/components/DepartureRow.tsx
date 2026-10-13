import { transportModeIcons } from "~/lib/shared.js";
import { TableCell, TableRow } from "./ui/table";

export default function DepartureRow({
  departure,
}: {
  departure: TimetableEntry;
}) {
  const d = departure;
  const currentTime = new Date();
  const toDeparture = new Date(
    Math.max(Date.parse(d.realtime) - currentTime.getTime(), 0),
  );

  const late = new Date(Date.parse(d.realtime) - Date.parse(d.scheduled));
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
        <h2 className="text-lg font-bold flex">{d.route.designation}</h2>
      </TableCell>
      <TableCell>
        <span>{d.route.destination.name}</span>
      </TableCell>
      <TableCell>
        avgår {d.realtime.split("T")[1].substring(0, 5)}{" "}
        <span className="text-destructive">{lateString}</span>
        <br />
        {toDeparture.getMinutes() != 0
          ? `om ${toDeparture.getMinutes()} min`
          : "nu"}
      </TableCell>
    </TableRow>
  );
}
