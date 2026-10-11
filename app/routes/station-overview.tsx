import { useOutletContext } from "react-router";
import StationCard from "~/components/StationCard";
import type { Area } from "./app";
//740040327
//740016755
//740000120
export default function StationOverview() {
  const { selectedStops } = useOutletContext<{
    selectedStops: Area[];
  }>();

  const { apiKey } = useOutletContext<{ apiKey: string }>();

  let stationCards = selectedStops.map((s) => <StationCard station={s} />);

  if (apiKey == "") {
    return (
      <div className="bg-red-500 text-white p-4 shadow-lg rounded-xl">
        <h2 className="text-lg font-bold">Saknar API-nyckel!</h2>
        <p>
          Du behöver en API-nyckel för att kunna använda sidan. Gå till
          inställningar för att lägga till en.
        </p>
      </div>
    );
  }

  return <div className="grid grid-cols-2 *:mb-4 gap-4">{stationCards}</div>;
}
