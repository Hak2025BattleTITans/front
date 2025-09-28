/// <reference types="vite/client" />
interface ImportMetaEnv {
    readonly VITE_API_URL: string
}

interface ImportMeta {
    readonly env: ImportMetaEnv
}

// Глобальные переменные из define
declare const API_URL: string
declare const __APP_ENV__: string
