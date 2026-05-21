import { map } from 'nanostores';

export interface AppState {
    userId: string | null;
    token: string | null;
    userData: Record<string, string> | null;
}

export const appStore = map<AppState>({
    userId: null,
    token: null,
    userData: null,
});

interface UniversalMF {
    mount: (
        el: HTMLElement,
        props: Record<string, unknown>
    ) => void | Promise<void>;
    unmount?: (el: HTMLElement) => void;
}

type Cleanup = () => void;

export const emit = (
    name: string,
    detail: Record<string, unknown> = {}
): void => {
    if (process.env.NODE_ENV === 'development') {
        console.groupCollapsed(
            `%c[Event Bus] \u25B6 ${name}`,
            'color:#7c3aed;font-weight:bold'
        );
        console.table(detail);
        console.groupEnd();
    }
    window.dispatchEvent(new CustomEvent(name, { detail, bubbles: true }));
};

export const on = (
    name: string,
    handler: (detail: Record<string, unknown>) => void
): void => {
    window.addEventListener(name, e => {
        if (process.env.NODE_ENV === 'development') {
            console.log(
                `%c[Event Bus] \u25C4 ${name} (recibido por Shell)`,
                'color:#059669;font-weight:bold'
            );
        }
        handler((e as CustomEvent).detail);
    });
};

export async function hydrateIsland(
    remoteKey: string,
    mountTarget: string | HTMLElement,
    props: Record<string, unknown> = {}
): Promise<Cleanup> {
    const mount =
        typeof mountTarget === 'string'
            ? document.getElementById(mountTarget)
            : mountTarget;
    if (!mount) {
        console.warn(`[Composer] Slot "${mountTarget}" no encontrado en el DOM`);
        return () => { };
    }

    try {
        const mfModule = await import(/* webpackIgnore: true */ remoteKey);
        const exported = mfModule.default;

        if (!exported) {
            throw new Error(`El m\u00f3dulo "${remoteKey}" no tiene un default export.`);
        }

        if (typeof (exported as UniversalMF).mount !== 'function') {
            throw new Error(
                `"${remoteKey}" no implementa el contrato universal. ` +
                `Debe exportar default { mount(el, props) }.`
            );
        }

        await (exported as UniversalMF).mount(mount, { ...props, emit });

        console.info(`[Composer] \u2705 Isla "${remoteKey}" montada en`, mountTarget);

        return () => {
            (exported as UniversalMF).unmount?.(mount);
            mount.innerHTML = '';
        };
    } catch (err) {
        console.error(`[Composer] \u274C Error cargando "${remoteKey}":`, err);
        mount.innerHTML = `
      <div style="padding:16px;background:#fce8e6;border:1px solid #ea4335;
                  border-radius:8px;color:#c62828;font-family:sans-serif;max-width:480px">
        <strong>\u26A0\uFE0F ${remoteKey}</strong><br/>
        <small>No se pudo cargar. \u00BFEst\u00E1 corriendo el servidor en el puerto correcto?</small>
      </div>`;
        return () => { };
    }
}
