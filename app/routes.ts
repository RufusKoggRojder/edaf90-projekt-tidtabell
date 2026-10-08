import {
  type RouteConfig,
  route,
  index,
  layout,
} from "@react-router/dev/routes";

export default [
  layout("./routes/app.tsx", [
    index("./routes/station-overview.tsx"),
    route("add", "./routes/add-station.tsx"),
    route("station/:stationId", "./routes/station-details.tsx"),
    route("*", "./routes/not-found.tsx"),
  ]),
] satisfies RouteConfig;
