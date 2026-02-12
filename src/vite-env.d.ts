declare module '*.module.css' {
  const classes: { readonly [key: string]: string }
  export default classes
}

declare module '*.css?inline' {
  const content: string
  export default content
}

declare module '*.svg' {
  const content: string
  export default content
}

interface Window {
  env?: Record<string, unknown>
  COMPLEX_API_URL: string
  EVA_API_URL: string
  IS_STANDALONE?: boolean
  currentEvaUserName?: string
  __EVA_CSS__?: string
  __EVA_CSS_MAP__?: Record<string, string>
  eva?: {
    ipcSend: (channel: string, ...args: unknown[]) => void
    openExternal?: (url: string) => Promise<void>
    platform?: string
  }
  evaGlobalAxiosInstance?: import('axios').AxiosInstance
}
