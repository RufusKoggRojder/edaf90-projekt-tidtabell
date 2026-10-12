import { Link, useOutletContext } from "react-router";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert.js";
import { AlertCircleIcon } from "lucide-react";
import { testAPI } from "~/lib/utils.js";
import { useMemo, useState } from "react";

export default function ApiValidator({ children }: React.PropsWithChildren) {
  const { apiKey } = useOutletContext<{ apiKey: string }>();
  const [apiKeyValid, setApiKeyValid] = useState(true);

  useMemo(async () => {
    setApiKeyValid(await testAPI(apiKey));
  }, [apiKey]);

  return apiKeyValid ? (
    children
  ) : (
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
