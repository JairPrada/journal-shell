"use client";

import { hydrateIsland, emit } from "@/utils";
import { useEffect, useRef } from "react";

interface MicroFrontendProps {
  remoteComponent: string;
  extraProps?: Record<string, unknown>;
}

export default function MicroFrontend({ remoteComponent, extraProps = {} }: MicroFrontendProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return () => {};

    const controller = new AbortController();
    let cleanup: (() => void) | undefined;

    hydrateIsland(
      remoteComponent,
      containerRef.current,
      { ...extraProps, emit },
      controller.signal
    ).then((c) => {
      if (!controller.signal.aborted) {
        cleanup = c;
      }
    });

    return () => {
      controller.abort();
      cleanup?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remoteComponent]);

  return <div ref={containerRef} style={{ width: "100%" }} />;
}
