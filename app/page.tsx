"use client";

import MicroFrontend from "@/components/MfWrapper";
import { on } from "@/utils";
import { useEffect, useState } from "react";

type Step = "login" | "otp" | "personal-data" | "documents" | "done";

export default function Home() {
  const [step, setStep] = useState<Step>("login");

  useEffect(() => {
    on("login:submit", () => setStep("otp"));
    on("otp:submit", () => setStep("personal-data"));
    on("mf:personal-data:submit", () => setStep("documents"));
    on("mf:document-upload:submit", () => setStep("done"));
  }, []);

  if (step === "done") {
    return (
      <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
        <div className="rounded-xl border border-green-200 bg-white p-12 text-center shadow-sm dark:bg-zinc-900 dark:border-zinc-700">
          <div className="text-5xl mb-4">&#9989;</div>
          <h1 className="text-2xl font-bold text-green-600 mb-2">
            Solicitud completada!
          </h1>
          <p className="text-zinc-500 dark:text-zinc-400">
            Su solicitud de credito hipotecario ha sido enviada exitosamente.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      {step === "login" && <MicroFrontend remoteComponent="mf-login" />}
      {step === "otp" && <MicroFrontend remoteComponent="mf-auth" />}
      {step === "personal-data" && (
        <MicroFrontend remoteComponent="mf-personal-data" />
      )}
      {step === "documents" && (
        <MicroFrontend remoteComponent="mf-document-upload" />
      )}
    </div>
  );
}
