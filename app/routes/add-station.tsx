import { useEffect, useState } from "react";
import { Search, Plus, Minus } from "lucide-react";
import { Button } from "~/components/ui/button.js";
import { Field } from "~/components/ui/field.js";
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
import { Link, useOutletContext } from "react-router";
import { type Area } from "./app.js";
import type { BaseUIEvent } from "@base-ui/react";
import {
  Card,
  CardContent,
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

type PropType = {
  apiKey: string;
  selectedStops: Area[];
  setSelectedStops: React.Dispatch<React.SetStateAction<Area[]>>;
};
export default function AddStation() {
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

  async function handleSearch() {
    console.log("");
    if (searchQuery) {
      const result = await safeFetchJson(
        `https://realtime-api.trafiklab.se/v1/stops/name/${searchQuery}?key=${apiKey}`,
      );
      if (typeof result === typeof searchResult) {
        setSearchResult(result as SearchResult);
      }
    }
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
            <ul className="flex flex-col gap-2">
              {selectedStops.map((stop) => (
                <li>
                  <StopItem
                    stop={stop}
                    onClick={(_) =>
                      setSelectedStops(selectedStops.filter((s) => s !== stop))
                    }
                  >
                    <Minus />
                  </StopItem>
                </li>
              ))}
            </ul>
          </CardContent>
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
                .filter((stop) => !selectedStops.find((s) => s.id === stop.id))
                .map((stop) => (
                  <li>
                    <StopItem
                      stop={stop}
                      onClick={(_) =>
                        setSelectedStops([...selectedStops, stop])
                      }
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
  children?: React.ReactNode;
  reverse?: boolean;
};
function StopItem({ stop, onClick, children, reverse }: StopItemType) {
  return (
    <Item className="py-1" variant="outline" size="xs">
      <ItemContent className={cn("", reverse && "order-2")}>
        <Link
          className="flex flex-row justify-between items-center"
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
