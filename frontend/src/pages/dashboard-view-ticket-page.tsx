import { TicketDetails, TicketStatus } from "@/domain/domain";
import { getTicket, getTicketQr } from "@/lib/api";
import { format } from "date-fns";
import { Calendar, DollarSign, MapPin, Tag } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { useParams } from "react-router";
import NavBar from "@/components/nav-bar";

const DashboardViewTicketPage: React.FC = () => {
  const [ticket, setTicket] = useState<TicketDetails | undefined>();
  const [qrCodeUrl, setQrCodeUrl] = useState<string | undefined>();
  const [isQrLoading, setIsQrCodeLoading] = useState(true);
  const [error, setError] = useState<string | undefined>();

  const { id } = useParams();
  const { isLoading, user } = useAuth();

  useEffect(() => {
    if (isLoading || !user?.access_token || !id) {
      return;
    }

    const doUseEffect = async (accessToken: string, id: string) => {
      try {
        setIsQrCodeLoading(true);
        setError(undefined);

        setTicket(await getTicket(accessToken, id));
        setQrCodeUrl(URL.createObjectURL(await getTicketQr(accessToken, id)));
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else if (typeof err === "string") {
          setError(err);
        } else {
          setError("An unknown error has occurred");
        }
      } finally {
        setIsQrCodeLoading(false);
      }
    };

    doUseEffect(user?.access_token, id);

    return () => {
      if (qrCodeUrl) {
        URL.revokeObjectURL(qrCodeUrl);
      }
    };
  }, [user?.access_token, isLoading, id]);

  const getStatusColor = (status: TicketStatus) => {
    switch (status) {
      case TicketStatus.PURCHASED:
        return "text-green-400";
      case TicketStatus.CANCELLED:
        return "text-red-400";
      default:
        return "text-gray-400";
    }
  };

  if (!ticket) {
    return (
      <div className="bg-slate-950 min-h-screen text-white">
        <NavBar />
        <div className="container mx-auto px-4 py-24 text-center">
          <p className="text-slate-300">Loading ticket details…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 min-h-screen text-white">
      <NavBar />
      <div className="container mx-auto px-4 py-10">
        <div className="mx-auto max-w-4xl rounded-[32px] border border-white/10 bg-slate-900/80 p-8 shadow-2xl">
          <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
            <div className="space-y-6">
              <div className="inline-flex rounded-full border border-white/10 bg-slate-950/70 px-4 py-2 text-sm text-slate-200">
                <span className={`${getStatusColor(ticket.status)} font-semibold`}>
                  {ticket.status}
                </span>
              </div>

              <div className="space-y-3">
                <h1 className="text-4xl font-bold text-white">{ticket.eventName}</h1>
                <div className="flex flex-wrap items-center gap-3 text-slate-300">
                  <span className="inline-flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {ticket.eventVenue}
                  </span>
                  <span className="inline-flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {format(ticket.eventStart, "Pp")} - {format(ticket.eventEnd, "Pp")}
                  </span>
                </div>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-slate-950/80 p-6">
                <p className="text-slate-400">Present this QR code at the venue for entry.</p>
                <div className="mt-6 flex items-center justify-center rounded-3xl bg-white/10 p-6">
                  {isQrLoading ? (
                    <div className="text-center text-slate-400">
                      <div className="mx-auto mb-3 h-10 w-10 animate-spin rounded-full border-b-2 border-white"></div>
                      Loading QR…
                    </div>
                  ) : error ? (
                    <div className="text-center text-rose-400">{error}</div>
                  ) : (
                    <img
                      src={qrCodeUrl}
                      alt="QR Code for event"
                      className="h-56 w-56 rounded-3xl object-contain"
                    />
                  )}
                </div>
              </div>
            </div>

            <aside className="space-y-6 rounded-[28px] border border-white/10 bg-slate-950/80 p-6">
              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-white">Ticket details</h2>
                <div className="text-slate-400">
                  <p>{ticket.description}</p>
                </div>
              </div>

              <div className="space-y-4 rounded-3xl border border-white/10 bg-slate-900/80 p-4">
                <div className="flex items-center gap-3 text-slate-300">
                  <Tag className="h-5 w-5" />
                  <span className="font-medium">Ticket ID</span>
                </div>
                <p className="font-mono text-slate-200 break-all">{ticket.id}</p>
              </div>

              <div className="space-y-4 rounded-3xl border border-white/10 bg-slate-900/80 p-4">
                <div className="flex items-center gap-3 text-slate-300">
                  <DollarSign className="h-5 w-5" />
                  <span className="font-medium">Price</span>
                </div>
                <p className="text-white">{ticket.price}</p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardViewTicketPage;
