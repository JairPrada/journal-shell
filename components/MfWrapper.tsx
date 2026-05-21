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

    let cleanup: (() => void) | undefined;
    let cancelled = false;

    hydrateIsland(remoteComponent, containerRef.current, {
      ...extraProps,
      emit,
    }).then((c) => {
      if (cancelled) {
        c();
      } else {
        cleanup = c;
      }
    });

    return () => {
      cancelled = true;
      cleanup?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remoteComponent]);

  return <div ref={containerRef} style={{ width: "100%" }} />;
}
