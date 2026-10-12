import { useEffect, useState } from "react";
import { Search, Plus, Minus } from "lucide-react";
import { Button } from "~/components/ui/button.js";
import { Field, FieldGroup, FieldSeparator } from "~/components/ui/field.js";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "~/components/ui/input-group.js";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "~/components/ui/item.js";
import { cn, safeFetchJson } from "~/lib/utils.js";
import { Link, useNavigate, useOutletContext } from "react-router";
import { type Area } from "./app.js";
import type { BaseUIEvent } from "@base-ui/react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card.js";
import { transportModeIcons } from "~/lib/shared.js";
import ApiValidator from "~/components/ApiValidator.js";

type SearchResult = {
  timestamp: string;
  query: {
    queryTime: string;
    query: string;
  };
  stop_groups: Area[];
};

function readSearchQuery(): string {
  const valueString = localStorage.getItem("searchQuery");
  if (!valueString) {
    return "";
  }
  return valueString;
}

function readAddedStops(): Area[] {
  const valueString = localStorage.getItem("addedStops");
  if (!valueString) {
    return [];
  }
  return JSON.parse(valueString);
}

function readRemovedStops(): Area[] {
  const valueString = localStorage.getItem("removedStops");
  if (!valueString) {
    return [];
  }
  return JSON.parse(valueString);
}

type PropType = {
  apiKey: string;
  selectedStops: Area[];
  setSelectedStops: React.Dispatch<React.SetStateAction<Area[]>>;
};
export default function ManageStations() {
  const [searchQuery, setSearchQuery] = useState<string>(readSearchQuery());
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);

  useEffect(() => {
    localStorage.setItem("searchQuery", searchQuery);
    const timeoutId = window.setTimeout(() => {
      void handleSearch();
    }, 300);

    return () => window.clearTimeout(timeoutId);
  }, [searchQuery]);

  const { apiKey, selectedStops, setSelectedStops } =
    useOutletContext<PropType>();

  const [addedStops, setAddedStops] = useState<Area[]>(readAddedStops());
  useEffect(() => {
    localStorage.setItem("addedStops", JSON.stringify(addedStops));
  }, [addedStops]);
  const [removedStops, setRemovedStops] = useState<Area[]>(readRemovedStops());
  useEffect(() => {
    localStorage.setItem("removedStops", JSON.stringify(removedStops));
  }, [removedStops]);

  async function handleSearch() {
    if (searchQuery) {
      const result = await safeFetchJson(
        `https://realtime-api.trafiklab.se/v1/stops/name/${searchQuery}?key=${apiKey}`,
      );
      if (typeof result === typeof searchResult) {
        setSearchResult(result as SearchResult);
      }
    }
  }

  function handleSubmit(event: React.SubmitEvent) {
    event.preventDefault();

    const newStops = selectedStops.filter((stop) => {
      return !removedStops.find((s) => stop.id === s.id);
    });
    addedStops.forEach((stop) => {
      if (!newStops.find((s) => stop.id === s.id)) {
        newStops.push(stop);
      }
    });
    setSelectedStops(newStops);
    setAddedStops([]);
    setRemovedStops([]);
  }
  return (
    <ApiValidator>
      <h2 className="text-3xl p-6 text-center">Hantera hållplatser</h2>
      <div className="grid grid-cols-2 gap-4">
        <Card className="flex flex-col gap-4 h-fit">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Valda hållplatser
            </CardTitle>
          </CardHeader>
          <CardContent>
            <FieldGroup className="flex flex-col gap-2">
              {selectedStops
                .filter(
                  (stop) =>
                    ![...addedStops, ...removedStops].find(
                      (s) => stop.id === s.id,
                    ),
                )
                .map((stop) => (
                  <Field>
                    <StopItem
                      stop={stop}
                      onClick={(_) => setRemovedStops([...removedStops, stop])}
                    >
                      <Minus />
                    </StopItem>
                  </Field>
                ))}
              {addedStops.length > 0 && (
                <>
                  <FieldSeparator />
                  {addedStops.map((stop) => (
                    <Field>
                      <StopItem
                        stop={stop}
                        variant="added"
                        onClick={(_) => {
                          setAddedStops(addedStops.filter((s) => s != stop));
                          if (!selectedStops.find((s) => s != stop))
                            setRemovedStops([...removedStops, stop]);
                        }}
                      >
                        <Minus />
                      </StopItem>
                    </Field>
                  ))}
                </>
              )}
              {removedStops.length > 0 && (
                <>
                  <FieldSeparator />
                  {removedStops.map((stop) => (
                    <Field>
                      <StopItem
                        stop={stop}
                        variant="removed"
                        onClick={(_) => {
                          setRemovedStops(
                            removedStops.filter((s) => s != stop),
                          );
                          if (!selectedStops.find((s) => s != stop))
                            setAddedStops([...addedStops, stop]);
                        }}
                      >
                        <Plus />
                      </StopItem>
                    </Field>
                  ))}
                </>
              )}
            </FieldGroup>
          </CardContent>
          <CardFooter>
            <form onSubmit={handleSubmit}>
              <Field orientation="horizontal">
                <Button variant="default" type="submit">
                  Spara
                </Button>
                <Button
                  variant="destructive"
                  type="reset"
                  onClick={() => {
                    setAddedStops([]);
                    setRemovedStops([]);
                  }}
                >
                  Avbryt
                </Button>
              </Field>
            </form>
          </CardFooter>
        </Card>
        <Card className="flex flex-col gap-4 h-fit">
          <CardHeader>
            <Field orientation="horizontal">
              <InputGroup>
                <InputGroupInput
                  name="search"
                  id="search"
                  type="search"
                  value={searchQuery}
                  onInput={(event) => setSearchQuery(event.currentTarget.value)}
                  placeholder="Sök efter stationer ..."
                />
                <InputGroupAddon>
                  <Search />
                </InputGroupAddon>
                <InputGroupAddon align="inline-end">
                  {searchResult &&
                    searchResult.stop_groups
                      .map((group) => group.stops.length)
                      .reduce((a, b) => a + b, 0) + " resultat"}
                </InputGroupAddon>
              </InputGroup>
            </Field>
          </CardHeader>
          <CardContent>
            <ul className="flex flex-col gap-2">
              {searchResult?.stop_groups
                .filter(
                  (stop) =>
                    ![...selectedStops, ...addedStops, ...removedStops].find(
                      (s) => s.id === stop.id,
                    ),
                )
                .map((stop) => (
                  <li>
                    <StopItem
                      stop={stop}
                      onClick={(_) => setAddedStops([...addedStops, stop])}
                      reverse
                    >
                      <Plus />
                    </StopItem>
                  </li>
                ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </ApiValidator>
  );
}

type StopItemType = {
  stop: Area;
  onClick: (
    event: BaseUIEvent<React.MouseEvent<HTMLButtonElement, MouseEvent>>,
  ) => void;
  variant?: "neutral" | "added" | "removed";
  reverse?: boolean;
  children?: React.ReactNode;
};
function StopItem({ stop, onClick, children, variant, reverse }: StopItemType) {
  let variantStyling = "";
  switch (variant) {
    case "added":
      variantStyling = "text-green-500";
      break;
    case "removed":
      variantStyling = "text-destructive";
      break;
  }

  return (
    <Item className={cn("py-1", variantStyling)} variant="outline" size="xs">
      <ItemContent className={cn("", reverse && "order-2")}>
        <Link
          className={cn(
            "flex flex-row justify-between items-center",
            variantStyling,
          )}
          to={`/details/${stop.id}?returnTo=add`}
        >
          <span className="font-bold">{stop.name}</span>
          <div className="flex flex-row p-1 gap-1">
            {stop.transport_modes.map(
              (mode) => transportModeIcons[mode] || <>{mode}</>,
            )}
          </div>
        </Link>
      </ItemContent>
      <ItemActions className={cn("", reverse && "order-1")}>
        <Button
          size="icon-sm"
          variant="ghost"
          className="rounded-full"
          onClick={onClick}
        >
          {children}
        </Button>
      </ItemActions>
    </Item>
  );
}
