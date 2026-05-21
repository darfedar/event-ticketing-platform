import { useEffect } from "react";
import { useRoles } from "@/hooks/use-roles";
import { useNavigate } from "react-router";

const DashboardPage: React.FC = () => {
  const { isLoading, isOrganizer, isStaff } = useRoles();
  const navigate = useNavigate();

  useEffect(() => {
    if (isLoading) {
      return;
    }

    if (isOrganizer) {
      navigate("/dashboard/events");
      return;
    }

    if (isStaff) {
      navigate("/dashboard/validate-qr");
      return;
    }

    navigate("/dashboard/tickets");
  }, [isLoading, isOrganizer, isStaff, navigate]);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-4">
      <div className="max-w-xl rounded-[32px] border border-white/10 bg-slate-900/90 p-10 text-center shadow-2xl">
        <p className="text-lg text-slate-300">Loading dashboard…</p>
      </div>
    </div>
  );
};

export default DashboardPage;
