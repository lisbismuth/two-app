import { createFileRoute } from "@tanstack/react-router";
import { handleState } from "@/lib/sync/state.server";

const handle = ({ request }: { request: Request }) => handleState(request);

export const Route = createFileRoute("/api/state")({
  server: { handlers: { GET: handle, PUT: handle } },
});
