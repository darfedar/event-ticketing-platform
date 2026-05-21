import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { purchaseTicket } from "@/lib/api";
import { CheckCircle, CreditCard } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "react-oidc-context";
import { useNavigate, useParams } from "react-router";
import NavBar from "@/components/nav-bar";

const PurchaseTicketPage: React.FC = () => {
  const { eventId, ticketTypeId } = useParams();
  const { isLoading, user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | undefined>();
  const [isPurchaseSuccess, setIsPurchaseASuccess] = useState(false);

  useEffect(() => {
    if (!isPurchaseSuccess) {
      return;
    }
    const timer = setTimeout(() => {
      navigate("/");
    }, 3000);

    return () => clearTimeout(timer);
  }, [isPurchaseSuccess]);

  const handlePurchase = async () => {
    if (isLoading || !user?.access_token || !eventId || !ticketTypeId) {
      return;
    }
    try {
      await purchaseTicket(user.access_token, eventId, ticketTypeId);
      setIsPurchaseASuccess(true);
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

  if (isPurchaseSuccess) {
    return (
      <div className="bg-slate-950 min-h-screen text-white">
        <NavBar />
        <div className="container mx-auto px-4 py-24">
          <div className="mx-auto max-w-lg rounded-[32px] border border-white/10 bg-slate-900/90 p-10 text-center shadow-2xl">
            <CheckCircle className="mx-auto mb-6 h-16 w-16 text-emerald-400" />
            <h2 className="text-3xl font-bold text-white mb-3">Thank you!</h2>
            <p className="text-slate-300">Your ticket purchase was successful.</p>
            <p className="mt-3 text-slate-400 text-sm">
              Redirecting to home page in a few seconds...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 min-h-screen text-white">
      <NavBar />
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-xl rounded-[32px] border border-white/10 bg-slate-900/90 p-10 shadow-2xl">
          {error && (
            <div className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-4 mb-6 text-slate-100">
              <div className="text-sm">{error}</div>
            </div>
          )}

          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Purchase Ticket</h1>
              <p className="text-slate-400 mt-2">
                Complete checkout and secure your ticket instantly.
              </p>
            </div>

            <div className="space-y-4 rounded-3xl border border-white/10 bg-slate-950/70 p-5">
              <div className="space-y-2">
                <Label className="text-slate-300">Credit Card Number</Label>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    maxLength={19}
                    className="bg-slate-900 text-white border border-white/10 pl-10"
                  />
                  <CreditCard className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-slate-300">Cardholder Name</Label>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="John Smith"
                    className="bg-slate-900 text-white border border-white/10 pl-10"
                  />
                  <CreditCard className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                </div>
              </div>
            </div>

            <Button
              className="w-full h-14"
              variant="default"
              onClick={handlePurchase}
            >
              Purchase Ticket
            </Button>

            <p className="text-center text-sm text-slate-500">
              This is a mock page, no payment details should be entered.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseTicketPage;
