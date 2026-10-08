import type { RouteObject } from "react-router";
import App from "./routes/app.js";
import StationOverview from "./routes/station-overview.js";
import AddStation from "./routes/add-station.js";
import StationDetails from "./routes/station-details.js";

const routerConfig: RouteObject[] = [
  {
    Component: App,
    children: [
      {
        index: true,
        Component: StationOverview,
      },
      {
        path: "add",
        Component: AddStation,
      },
      {
        path: "details/:stationId",
        Component: StationDetails,
      },
      {
        path: "*",
        Component: PageNotFound,
      },
    ],
  },
];

function PageNotFound() {
  return <h2>Sidan kunde inte hittas</h2>;
}

export default routerConfig;
