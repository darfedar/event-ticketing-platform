import { useAuth } from "react-oidc-context";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router";
import { Input } from "@/components/ui/input";
import { AlertCircle, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { PublishedEventSummary, SpringBootPagination } from "@/domain/domain";
import { listPublishedEvents, searchPublishedEvents } from "@/lib/api";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import PublishedEventCard from "@/components/published-event-card";
import { SimplePagination } from "@/components/simple-pagination";
import NavBar from "@/components/nav-bar";

const AttendeeLandingPage: React.FC = () => {
  const { isLoading, signinRedirect } = useAuth();
  const navigate = useNavigate();

  const [page, setPage] = useState(0);
  const [publishedEvents, setPublishedEvents] = useState<
    SpringBootPagination<PublishedEventSummary> | undefined
  >();
  const [error, setError] = useState<string | undefined>();
  const [query, setQuery] = useState<string | undefined>();

  useEffect(() => {
    if (query && query.length > 0) {
      queryPublishedEvents();
    } else {
      refreshPublishedEvents();
    }
  }, [page]);

  const refreshPublishedEvents = async () => {
    try {
      setPublishedEvents(await listPublishedEvents(page));
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === "string") {
        setError(err);
      } else {
        setError("An unknown error has occurred");
      }
    }
  };

  const queryPublishedEvents = async () => {
    if (!query) {
      await refreshPublishedEvents();
      return;
    }

    try {
      setPublishedEvents(await searchPublishedEvents(query, page));
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === "string") {
        setError(err);
      } else {
        setError("An unknown error has occurred");
      }
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Alert variant="destructive" className="bg-gray-900 border-red-700">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <NavBar />
        <div className="container mx-auto px-4 py-24 text-center">
          <p className="text-lg text-slate-300">Loading events…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 min-h-screen text-white">
      <NavBar />
      <div className="container mx-auto px-4 py-10 space-y-10">
        <section className="overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-r from-slate-900 via-slate-950 to-purple-950 p-10 shadow-2xl">
          <div className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="space-y-6 max-w-2xl">
              <span className="inline-flex rounded-full bg-purple-500/20 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-purple-200">
                Discover events
              </span>
              <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                Find the best events and buy tickets instantly.
              </h1>
              <p className="max-w-xl text-slate-300 text-lg">
                Browse curated events, compare ticket types, and secure your spot with a modern ticketing experience.
              </p>
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button variant="default" onClick={() => navigate("/dashboard")}>
                  Dashboard
                </Button>
                <Button variant="secondary" onClick={() => signinRedirect()}>
                  Log in
                </Button>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-[28px] bg-slate-900/30 border border-white/10 h-72">
              <img
                src="/organizers-landing-hero.png"
                alt="Event hero"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent" />
            </div>
          </div>
        </section>

        <section className="rounded-[28px] border border-white/10 bg-slate-900/80 p-6 shadow-lg">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Browse Published Events</h2>
              <p className="text-slate-400">Search for events and explore available tickets.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <Input
                className="min-w-0 bg-slate-950 text-white border border-white/10"
                placeholder="Search events"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <Button variant="secondary" onClick={queryPublishedEvents}>
                <Search />
              </Button>
            </div>
          </div>
        </section>

        {publishedEvents?.content.length ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {publishedEvents.content.map((publishedEvent) => (
              <PublishedEventCard
                publishedEvent={publishedEvent}
                key={publishedEvent.id}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-[28px] border border-white/10 bg-slate-900/80 p-10 text-center text-slate-400 shadow-lg">
            No events found. Try a different search or check back later.
          </div>
        )}

        {publishedEvents && (
          <div className="flex justify-center py-6">
            <SimplePagination pagination={publishedEvents} onPageChange={setPage} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendeeLandingPage;
