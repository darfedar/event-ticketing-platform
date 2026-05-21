import { Button } from "@/components/ui/button";
import { useAuth } from "react-oidc-context";
import { useNavigate } from "react-router";
import NavBar from "@/components/nav-bar";

const OrganizersLandingPage: React.FC = () => {
  const { isLoading } = useAuth();

  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <NavBar />
        <div className="container mx-auto px-4 py-24 text-center">
          <p className="text-lg text-slate-300">Loading organizer homepage…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 min-h-screen text-white">
      <NavBar />
      <main className="container mx-auto px-4 py-14">
        <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] items-center">
          <div className="space-y-6 max-w-2xl">
            <span className="inline-flex rounded-full bg-purple-500/20 px-4 py-1 text-xs uppercase tracking-[0.35em] text-purple-200">
              Organizer tools
            </span>
            <h1 className="text-5xl font-bold leading-tight">
              Create, manage, and sell event tickets with confidence.
            </h1>
            <p className="text-lg text-slate-300">
              Build your event in minutes, manage ticket inventory, and validate
              attendees with QR codes — all from one sleek dashboard.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                variant="default"
                onClick={() => navigate("/dashboard/events")}
              >
                Create an Event
              </Button>
              <Button variant="secondary" onClick={() => navigate("/")}>
                Browse Events
              </Button>
            </div>
          </div>
          <div className="relative overflow-hidden rounded-[32px] border border-white/10 bg-slate-900/80 shadow-2xl h-[420px]">
            <img
              src="organizers-landing-hero.png"
              alt="A busy concert"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent" />
          </div>
        </div>
      </main>
    </div>
  );
};

export default OrganizersLandingPage;
