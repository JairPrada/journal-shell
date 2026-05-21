"use client";

import MicroFrontend from "@/components/MfWrapper";
import { on } from "@/utils";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    on("login:submit", (data) => {
      console.log("Login submitted with data:", data);
    });
    on("otp:submit", (data) => {
      console.log("OTP submitted:", data);
    });
    on("mf:personal-data:submit", (data) => {
      console.log("Personal data submitted:", data);
    });
  }, []);

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <MicroFrontend remoteComponent="mf-login" />
      <MicroFrontend remoteComponent="mf-auth" />
      <MicroFrontend remoteComponent="mf-personal-data" />
    </div>
  );
}
