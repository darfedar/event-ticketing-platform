import NavBar from "@/components/nav-bar";
import { SimplePagination } from "@/components/simple-pagination";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SpringBootPagination, TicketSummary } from "@/domain/domain";
import { listTickets } from "@/lib/api";
import { AlertCircle, DollarSign, Tag, Ticket } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { Link } from "react-router";

const DashboardListTickets: React.FC = () => {
  const { isLoading, user } = useAuth();

  const [tickets, setTickets] = useState<
    SpringBootPagination<TicketSummary> | undefined
  >();
  const [error, setError] = useState<string | undefined>();
  const [page, setPage] = useState(0);

  useEffect(() => {
    if (isLoading || !user?.access_token) {
      return;
    }

    const doUseEffect = async () => {
      try {
        setTickets(await listTickets(user.access_token, page));
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else if (typeof err === "string") {
          setError(err);
        } else {
          setError("An unknown error occurred");
        }
      }
    };

    doUseEffect();
  }, [isLoading, user?.access_token, page]);

  if (error) {
    return (
      <div className="bg-slate-950 min-h-screen text-white">
        <NavBar />
        <div className="container mx-auto px-4 py-24">
          <Alert variant="destructive" className="bg-rose-900 border-rose-700">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 min-h-screen text-white">
      <NavBar />

      <div className="container mx-auto px-4 py-10">
        <div className="mb-8 rounded-[32px] border border-white/10 bg-slate-900/80 p-8 shadow-2xl">
          <h1 className="text-3xl font-bold">Your Tickets</h1>
          <p className="mt-2 text-slate-400">Tickets you have purchased and can access here.</p>
        </div>

        {tickets && tickets.content.length === 0 ? (
          <div className="rounded-[32px] border border-white/10 bg-slate-900/80 p-10 text-center text-slate-300">
            No tickets found yet. Purchase a ticket to see it here.
          </div>
        ) : (
          <div className="grid gap-4">
            {tickets?.content.map((ticketItem) => (
              <Link key={ticketItem.id} to={`/dashboard/tickets/${ticketItem.id}`}>
                <Card className="bg-slate-900 border border-white/5 text-white transition hover:-translate-y-1 hover:shadow-xl">
                  <CardHeader>
                    <div className="flex justify-between items-center gap-4">
                      <div className="flex items-center gap-3">
                        <Ticket className="h-5 w-5 text-violet-400" />
                        <div>
                          <h3 className="font-semibold text-xl">
                            {ticketItem.ticketType.name}
                          </h3>
                          <p className="text-slate-400 text-sm">{ticketItem.ticketType.name}</p>
                        </div>
                      </div>
                      <span className="rounded-full bg-white/10 px-3 py-1 text-sm text-slate-200">
                        {ticketItem.status}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="grid gap-4 md:grid-cols-2">
                    <div className="flex items-center gap-2 text-slate-300">
                      <DollarSign className="h-5 w-5" />
                      <p className="font-medium text-white">${ticketItem.ticketType.price}</p>
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <Tag className="h-5 w-5" />
                      <div>
                        <h4 className="font-medium">Ticket ID</h4>
                        <p className="text-slate-400 font-mono text-sm">{ticketItem.id}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        <div className="flex justify-center py-8">
          {tickets && (
            <SimplePagination pagination={tickets} onPageChange={setPage} />
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardListTickets;
