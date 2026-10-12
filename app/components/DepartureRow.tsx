import { TableCell, TableRow } from "./ui/table";

export default function DepartureRow({
  departure,
}: {
  departure: TimetableEntry;
}) {
  let d = departure;
  let currentTime = new Date();
  let toDeparture = new Date(Date.parse(d.realtime) - currentTime.getTime());
  let late = new Date(Date.parse(d.realtime) - Date.parse(d.scheduled));
  let lateString = "";
  if (late.getTime() > 60000) {
    lateString = "(" + late.getMinutes() + " min försenad)";
  } else if (late.getTime() < -60000) {
    lateString = "(" + (60 - late.getMinutes()) + " min tidig)";
  }
  return (
    <TableRow>
      <TableCell>
        <h2 className="text-lg font-bold">{d.route.designation}</h2>
      </TableCell>
      <TableCell>
        <span>{d.route.destination.name}</span>
      </TableCell>
      <TableCell>
        avgår {d.realtime.split("T")[1].substring(0, 5)}{" "}
        <span className="text-destructive">{lateString}</span>
        <br />
        om {toDeparture.getMinutes()} min
      </TableCell>
    </TableRow>
  );
}
