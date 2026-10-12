import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "~/components/ui/navigation-menu.js";

export type Area = {
  id: string;
  name: string;
  area_type: string;
  transport_modes: string[];
  stops: Stop[];
};

export type Stop = {
  id: string;
  name: string;
};

function readStops(): Area[] {
  const valueString = localStorage.getItem("stops");
  if (!valueString) {
    return [];
  }
  return JSON.parse(valueString) as Area[];
}

function readApiKey(): string {
  const valueString = localStorage.getItem("apiKey");
  if (!valueString) {
    return "";
  }
  return JSON.parse(valueString);
}

export default function App() {
  const [selectedStops, setSelectedStops] = useState<Area[]>(() =>
    typeof window === "undefined" ? [] : readStops(),
  );
  useEffect(() => {
    localStorage.setItem("stops", JSON.stringify(selectedStops));
  }, [selectedStops]);

  const [apiKey, setApiKey] = useState(() =>
    typeof window === "undefined" ? "" : readApiKey(),
  );

  useEffect(() => {
    localStorage.setItem("apiKey", JSON.stringify(apiKey));
  }, [apiKey]);

  return (
    <div className="flex w-full items-center justify-center p-10 lg:p-20">
      <div className="grid w-full grid-rows-1 gap-4 lg:w-3/4">
        <h1 className="text-center text-3xl font-bold">
          <Link to="/">Tågstationer</Link>
        </h1>
        <NavigationMenu className="flex flex-row justify-between">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink render={<Link to="/">Överblick</Link>} />
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                render={<Link to="/add">Hantera stationer</Link>}
              />
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink
                render={<Link to="/settings">Inställningar</Link>}
              />
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <Outlet
          context={{
            apiKey,
            setApiKey,
            selectedStops,
            setSelectedStops,
          }}
        />
      </div>
    </div>
  );
}
