import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import {
  TicketValidationMethod,
  TicketValidationStatus,
} from "@/domain/domain";
import { AlertCircle, Check, X } from "lucide-react";
import { validateTicket } from "@/lib/api";
import { useAuth } from "react-oidc-context";
import NavBar from "@/components/nav-bar";

const DashboardValidateQrPage: React.FC = () => {
  const { isLoading, user } = useAuth();
  const [isManual, setIsManual] = useState(false);
  const [data, setData] = useState<string | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [validationStatus, setValidationStatus] = useState<
    TicketValidationStatus | undefined
  >();

  const handleReset = () => {
    setIsManual(false);
    setData(undefined);
    setError(undefined);
    setValidationStatus(undefined);
  };

  const handleError = (err: unknown) => {
    if (err instanceof Error) {
      setError(err.message);
    } else if (typeof err === "string") {
      setError(err);
    } else {
      setError("An unknown error occurred");
    }
  };

  const handleValidate = async (id: string, method: TicketValidationMethod) => {
    if (!user?.access_token) {
      return;
    }
    try {
      const response = await validateTicket(user.access_token, {
        id,
        method,
      });
      setValidationStatus(response.status);
    } catch (err) {
      handleError(err);
    }
  };

  if (isLoading || !user?.access_token) {
    return (
      <div className="min-h-screen bg-slate-950 text-white">
        <NavBar />
        <div className="container mx-auto px-4 py-24 text-center">
          <p className="text-lg text-slate-300">Loading validation tools…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 min-h-screen text-white">
      <NavBar />
      <div className="container mx-auto px-4 py-10">
        <div className="grid gap-8 xl:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-[32px] border border-white/10 bg-slate-900/80 p-8 shadow-2xl">
            <div className="mb-6">
              <p className="text-sm uppercase tracking-[0.3em] text-purple-300">Ticket validation</p>
              <h1 className="text-3xl font-bold text-white">Validate tickets quickly</h1>
              <p className="text-slate-400">Scan attendee QR codes or enter ticket IDs manually for instant validation.</p>
            </div>

            {error && (
              <div className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-4 mb-6 text-slate-100">
                <div className="flex items-center gap-2 text-sm">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              </div>
            )}

            <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-black/30">
              <Scanner
                key={`scanner-${data}-${validationStatus}`}
                onScan={(result) => {
                  if (result) {
                    const qrCodeId = result[0].rawValue;
                    setData(qrCodeId);
                    handleValidate(qrCodeId, TicketValidationMethod.QR_SCAN);
                  }
                }}
                onError={handleError}
              />
              {validationStatus && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  {validationStatus === TicketValidationStatus.VALID ? (
                    <div className="bg-emerald-500 rounded-full p-4">
                      <Check className="w-20 h-20" />
                    </div>
                  ) : (
                    <div className="bg-rose-500 rounded-full p-4">
                      <X className="w-20 h-20" />
                    </div>
                  )}
                </div>
              )}
            </div>

            <div className="mt-8 space-y-5">
              {isManual ? (
                <div className="space-y-4">
                  <Input
                    className="w-full bg-slate-950 text-white border border-white/10"
                    placeholder="Enter ticket or QR code ID"
                    onChange={(e) => setData(e.target.value)}
                    value={data || ""}
                  />
                  <Button
                    className="w-full h-14"
                    variant="default"
                    onClick={() =>
                      handleValidate(data || "", TicketValidationMethod.MANUAL)
                    }
                  >
                    Submit
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-white/10 bg-slate-950/80 p-4 text-center text-slate-200 font-mono">
                    {data || "Scan for Result"}
                  </div>
                  <Button
                    className="w-full h-14"
                    variant="secondary"
                    onClick={() => setIsManual(true)}
                  >
                    Manual Entry
                  </Button>
                </div>
              )}

              <Button
                className="w-full h-14"
                variant="outline"
                onClick={handleReset}
              >
                Reset
              </Button>
            </div>
          </section>

          <aside className="rounded-[32px] border border-white/10 bg-slate-900/80 p-8 shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Validation status</h2>
            <p className="text-slate-400 mb-6">
              Scan a ticket QR code or manually enter the ticket identifier to verify entry immediately.
            </p>
            <div className="space-y-4">
              <div className="rounded-3xl bg-slate-950/80 p-4">
                <p className="text-sm text-slate-400">Scanned code</p>
                <p className="mt-2 font-mono text-white break-all">{data || "Waiting for scan..."}</p>
              </div>
              <div className="rounded-3xl bg-slate-950/80 p-4">
                <p className="text-sm text-slate-400">Latest result</p>
                <p className="mt-2 text-lg font-semibold text-white">
                  {validationStatus || "No result yet"}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default DashboardValidateQrPage;
