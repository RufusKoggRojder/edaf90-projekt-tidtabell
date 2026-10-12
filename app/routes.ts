import {
  type RouteConfig,
  route,
  index,
  layout,
} from "@react-router/dev/routes";

export default [
  layout("./routes/app.tsx", [
    index("./routes/station-overview.tsx"),
    route("manage", "./routes/manage-stations.tsx"),
    route("details/:stationId", "./routes/station-details.tsx"),
    route("settings", "./routes/settings.tsx"),
    route("*", "./routes/not-found.tsx"),
  ]),
] satisfies RouteConfig;
