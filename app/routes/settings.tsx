import { useState, type Dispatch, type SetStateAction } from "react";
import { useOutletContext } from "react-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { safeFetchJson } from "~/lib/utils";

export default function Settings() {
  const { apiKey, setApiKey } = useOutletContext<{
    apiKey: string;
    setApiKey: Dispatch<SetStateAction<string>>;
  }>();

  const [apiTestStatus, setApiTestStatus] = useState<boolean | undefined>(
    undefined,
  );

  async function testAPI() {
    fetch(
      `https://realtime-api.trafiklab.se/v1/departures/740000120?key=${apiKey}`,
    ).then((response) => {
      if (response.ok) {
        setApiTestStatus(true);
      } else {
        setApiTestStatus(false);
      }
    });
  }

  return (
    <div className="bg-red-100 opacity-100 rounded-xl p-4">
      <p>
        För att kunna hämta data behöver du ange en API-nyckel till TrafikLab.
        Följ stegen nedan:
      </p>
      <ol className="ml-8 list-decimal">
        <li>
          Skapa ett konto på
          <a href="https://developer.trafiklab.se/login" target="_blank">
            trafiklab.se
          </a>
        </li>
        <li>Skapa ett nytt projekt.</li>
        <li>
          Gå in på projektet och lägg till en API-nyckel för{" "}
          <span className="font-italic">Trafiklab Realtime APIs</span>
        </li>
        <li>Kopiera in nycklen nedan</li>
      </ol>
      <Label className="mt-4 mb-2 flex flex-col gap-2 items-start">
        API-nyckel
        <Input
          className="outline-2 border border-gray-400"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
        />
      </Label>
      <div className="flex flex-row gap-4 items-center">
        <Button onClick={testAPI} variant="secondary">
          Testa
        </Button>
        {apiTestStatus != undefined &&
          (apiTestStatus ? (
            <span className="text-green-600 font-bold">OK!</span>
          ) : (
            <span className="text-red-600 font-bold">Funkar inte</span>
          ))}
      </div>
    </div>
  );
}
