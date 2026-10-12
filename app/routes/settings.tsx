import { useEffect, useState, type Dispatch, type SetStateAction } from "react";
import { useNavigate, useOutletContext } from "react-router";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "~/components/ui/card.js";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "~/components/ui/field.js";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "~/components/ui/input-group.js";
import { testAPI } from "~/lib/utils.js";

export default function Settings() {
  const { apiKey, setApiKey } = useOutletContext<{
    apiKey: string;
    setApiKey: Dispatch<SetStateAction<string>>;
  }>();

  const [newApiKey, setNewApiKey] = useState(apiKey);

  const [apiTestStatus, setApiTestStatus] = useState<boolean | undefined>(
    undefined,
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(async () => {
      setApiTestStatus(await testAPI(newApiKey));
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [newApiKey]);

  const navigate = useNavigate();

  function handleSubmit(event: React.SubmitEvent) {
    event.preventDefault();
    if (apiTestStatus) {
      setApiKey(newApiKey);
      navigate("/");
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl text-center">Inställningar</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <FieldGroup>
            <FieldDescription>
              <p>
                För att kunna hämta data behöver du ange en API-nyckel till
                TrafikLab. Följ stegen nedan:
              </p>
              <ol className="ml-8 list-decimal">
                <li>
                  Skapa ett konto på
                  <a
                    href="https://developer.trafiklab.se/login"
                    target="_blank"
                  >
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
            </FieldDescription>
            <Field>
              <FieldLabel htmlFor="api-key-input">API-nyckel</FieldLabel>

              <InputGroup>
                <InputGroupInput
                  name="api-key-input"
                  id="api-key-input"
                  value={newApiKey}
                  onInput={(e) => {
                    console.log(e.currentTarget.value);
                    setNewApiKey(e.currentTarget.value);
                  }}
                  placeholder="API nyckel..."
                />
                <InputGroupAddon align="inline-end">
                  {newApiKey &&
                    apiTestStatus != undefined &&
                    (apiTestStatus ? (
                      <span className="text-green-600 font-bold">OK!</span>
                    ) : (
                      <span className="text-destructive font-bold">
                        Funkar inte
                      </span>
                    ))}
                </InputGroupAddon>
              </InputGroup>
            </Field>
            <Field orientation="horizontal">
              <Button variant="default" type="submit">
                Spara
              </Button>
              <Button
                variant="destructive"
                onClick={() => setNewApiKey(apiKey)}
                type="reset"
              >
                Avbryt
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
