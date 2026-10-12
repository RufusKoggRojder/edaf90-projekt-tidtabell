import { Link, useOutletContext } from "react-router";
import StationCard from "~/components/StationCard";
import type { Area } from "./app";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert.js";
import { AlertCircleIcon } from "lucide-react";
import { testAPI } from "~/lib/utils.js";
import { useEffect, useMemo, useState } from "react";
import ApiValidator from "~/components/ApiValidator.js";
//740040327
//740016755
//740000120
export default function StationOverview() {
  const { selectedStops } = useOutletContext<{
    selectedStops: Area[];
  }>();

  const { apiKey } = useOutletContext<{ apiKey: string }>();
  const [apiKeyValid, setApiKeyValid] = useState(true);

  useMemo(async () => {
    setApiKeyValid(await testAPI(apiKey));
  }, [apiKey]);

  let stationCards = selectedStops.map((s) => <StationCard station={s} />);

  if (!apiKeyValid) {
    return (
      <Alert variant="destructive" className="max-w-md">
        <AlertCircleIcon />
        <AlertTitle>Saknad eller felaktig API-nyckel!</AlertTitle>
        <AlertDescription>
          Du behöver en API-nyckel för att kunna använda sidan. Gå till&nbsp;
          <Link to="/settings">inställningar</Link> för att lägga till en.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <ApiValidator>
      <div className="grid grid-cols-2 *:mb-4 gap-4">{stationCards}</div>
    </ApiValidator>
  );
}
