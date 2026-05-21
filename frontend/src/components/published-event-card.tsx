import { PublishedEventSummary } from "@/domain/domain";
import { Card } from "./ui/card";
import { Calendar, Heart, MapPin, Share2 } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router";
import RandomEventImage from "./random-event-image";

interface PublishedEventCardProperties {
  publishedEvent: PublishedEventSummary;
}

const PublishedEventCard: React.FC<PublishedEventCardProperties> = ({
  publishedEvent,
}) => {
  return (
    <Link
      to={`/events/${publishedEvent.id}`}
      className="group"
    >
      <Card className="overflow-hidden border border-white/10 bg-slate-900 text-white shadow-lg transition duration-300 hover:-translate-y-1 hover:shadow-2xl">
        <div className="relative h-[220px] overflow-hidden">
          <RandomEventImage />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent" />
        </div>
        <div className="space-y-3 px-4 pb-5 pt-4">
          <h3 className="text-lg font-semibold text-white">{publishedEvent.name}</h3>
          <div className="flex flex-wrap gap-2 text-sm text-slate-400">
            <MapPin className="w-4" />
            <span>{publishedEvent.venue}</span>
          </div>
          <div className="flex flex-wrap gap-2 text-sm text-slate-400">
            <Calendar className="w-4" />
            {publishedEvent.start && publishedEvent.end ? (
              <span>{format(publishedEvent.start, "PP")} - {format(publishedEvent.end, "PP")}</span>
            ) : (
              <span>Dates TBD</span>
            )}
          </div>
          <div className="flex items-center justify-between border-t border-white/10 pt-3 text-slate-400">
            <button className="cursor-pointer transition hover:text-white">
              <Heart />
            </button>
            <button className="cursor-pointer transition hover:text-white">
              <Share2 />
            </button>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default PublishedEventCard;
