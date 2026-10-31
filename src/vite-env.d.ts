/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_HIERO_GATEWAY_URL?: string;
  readonly VITE_BRIDGE_URL?: string;
  readonly VITE_PYTHON_BACKEND_URL?: string;
  readonly VITE_CONNECT_API_KEY?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
