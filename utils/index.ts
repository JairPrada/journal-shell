import { map } from "nanostores";
import {
  validateManifest,
  typedEmit,
  typedOn,
  type MFModule,
  type EventName,
  type EventPayload,
} from "@journals/mf-contract";

export interface AppState {
  userId: string | null;
  token: string | null;
  userData: Record<string, string> | null;
  documentsUploaded: boolean;
}

export const appStore = map<AppState>({
  userId: null,
  token: null,
  userData: null,
  documentsUploaded: false,
});

type Cleanup = () => void;

export function emit<N extends EventName>(
  name: N,
  detail: EventPayload<N>,
): void {
  typedEmit(name, detail);
}

export function on<N extends EventName>(
  name: N,
  handler: (detail: EventPayload<N>) => void,
): void {
  typedOn(name, handler);
}

export async function hydrateIsland(
  remoteKey: string,
  mountTarget: string | HTMLElement,
  props: Record<string, unknown> = {},
  signal?: AbortSignal,
): Promise<Cleanup> {
  const mount =
    typeof mountTarget === "string"
      ? document.getElementById(mountTarget)
      : mountTarget;
  if (!mount) {
    console.warn(
      `[Composer] Slot "${mountTarget}" no encontrado en el DOM`,
    );
    return () => {};
  }

  try {
    const mfModule = await import(/* webpackIgnore: true */ remoteKey);

    if (signal?.aborted) return () => {};

    const exported = mfModule.default as MFModule;
    if (!exported) {
      throw new Error(
        `El m\u00f3dulo "${remoteKey}" no tiene un default export.`,
      );
    }

    validateManifest(exported);

    await exported.mount(mount, {
      ...props,
      emit: (name: string, detail: Record<string, unknown>) => {
        typedEmit(name as EventName, detail as EventPayload<EventName>);
      },
    });

    if (signal?.aborted) {
      exported.unmount?.(mount);
      mount.innerHTML = "";
      return () => {};
    }

    console.info(
      `[Composer] \u2705 Isla "${remoteKey}" montada en`,
      mountTarget,
    );

    return () => {
      exported.unmount?.(mount);
      mount.innerHTML = "";
    };
  } catch (err) {
    if (signal?.aborted) return () => {};
    console.error(
      `[Composer] \u274C Error cargando "${remoteKey}":`,
      err,
    );
    mount.innerHTML = `
      <div style="padding:16px;background:#fce8e6;border:1px solid #ea4335;
                  border-radius:8px;color:#c62828;font-family:sans-serif;max-width:480px">
        <strong>\u26A0\uFE0F ${remoteKey}</strong><br/>
        <small>No se pudo cargar. \u00BFEst\u00E1 corriendo el servidor en el puerto correcto?</small>
      </div>`;
    return () => {};
  }
}
