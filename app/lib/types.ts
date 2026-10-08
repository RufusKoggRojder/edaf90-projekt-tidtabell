interface DeparturesResponse {
  timestamp: string;
  departures: TimetableEntry[];
}

interface TimetableEntry {
  scheduled: string;
  realtime: string;
  delay: number;
  canceled: boolean;
  route: Route;
  trip: Trip;
  agency: Agency;
  stop: Stop;
}

interface Route {
  name: string;
  designation: string;
  transport_mode_code: number;
  transport_mode: string;
  direction: string;
  origin: Stop;
  destination: Stop;
}

interface Stop {
  id: string;
  name: string;
  lat: number;
  lon: number;
}

interface Trip {
  trip_id: string;
  start_time: string;
}

interface Agency {
  id: string;
  operator: string;
  name: string;
}
