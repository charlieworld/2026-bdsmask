import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/_index.tsx"),
  route("agenda", "routes/agenda.tsx"),
  route("staff", "routes/staff.tsx"),
  route("tickets", "routes/tickets.tsx"),
  route("origin", "routes/origin.tsx"),
  route("chat", "routes/chat.tsx"),
] satisfies RouteConfig;
