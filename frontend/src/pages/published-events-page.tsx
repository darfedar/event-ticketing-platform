import RandomEventImage from "@/components/random-event-image";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  PublishedEventDetails,
  PublishedEventTicketTypeDetails,
} from "@/domain/domain";
import { getPublishedEvent } from "@/lib/api";
import { AlertCircle, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { Link, useParams } from "react-router";
import NavBar from "@/components/nav-bar";

const PublishedEventsPage: React.FC = () => {
  const { isLoading } = useAuth();
  const { id } = useParams();
  const [error, setError] = useState<string | undefined>();
  const [publishedEvent, setPublishedEvent] = useState<
    PublishedEventDetails | undefined
  >();
  const [selectedTicketType, setSelectedTicketType] = useState<
    PublishedEventTicketTypeDetails | undefined
  >();

  useEffect(() => {
    if (!id) {
      setError("ID must be provided!");
      return;
    }

    const doUseEffect = async () => {
      try {
        const eventData = await getPublishedEvent(id);
        setPublishedEvent(eventData);
        if (eventData.ticketTypes.length > 0) {
          setSelectedTicketType(eventData.ticketTypes[0]);
        }
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
    doUseEffect();
  }, [id]);

  if (error) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <NavBar />
        <div className="container mx-auto px-4 py-24">
          <Alert variant="destructive" className="bg-rose-950 border-rose-700">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <NavBar />
        <div className="container mx-auto px-4 py-24 text-center">
          <p className="text-lg text-slate-300">Loading event details…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 min-h-screen text-white">
      <NavBar />
      <main className="container mx-auto px-4 py-12">
        <div className="space-y-6 rounded-[32px] border border-white/10 bg-slate-900/80 p-8 shadow-2xl">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] items-center">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.3em] text-purple-300">Event details</p>
              <h1 className="text-4xl font-bold text-white">{publishedEvent?.name}</h1>
              <div className="flex items-center gap-2 text-slate-400">
                <MapPin />
                <span>{publishedEvent?.venue}</span>
              </div>
            </div>
            <div className="overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/70 h-72">
              <RandomEventImage />
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold">Available Tickets</h2>
              <p className="text-slate-400">Choose a ticket type and continue to checkout.</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/80 p-6">
              <p className="text-sm uppercase tracking-[0.28em] text-slate-400">Select a ticket</p>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-4">
              {publishedEvent?.ticketTypes?.map((ticketType) => (
                <Card
                  key={ticketType.id}
                  className="border border-white/10 bg-slate-900/90 text-white transition hover:-translate-y-1 hover:border-purple-500/40"
                  onClick={() => setSelectedTicketType(ticketType)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="text-lg font-semibold">{ticketType.name}</h3>
                      <span className="text-xl font-bold text-purple-300">
                        ${ticketType.price}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-slate-400">{ticketType.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="rounded-[28px] border border-white/10 bg-slate-950/80 p-8 shadow-lg">
              <h2 className="text-2xl font-bold mb-4">{selectedTicketType?.name}</h2>
              <p className="text-slate-400 mb-6">{selectedTicketType?.description}</p>
              <div className="mb-8">
                <span className="text-5xl font-bold text-white">
                  ${selectedTicketType?.price}
                </span>
              </div>
              <Link
                to={`/events/${publishedEvent?.id}/purchase/${selectedTicketType?.id}`}
              >
                <Button className="w-full" variant="default">
                  Purchase Ticket
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PublishedEventsPage;
