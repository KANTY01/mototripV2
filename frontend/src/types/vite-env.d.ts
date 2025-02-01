/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_UPLOAD_MAX_SIZE: string
  // Add other env variables here
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
