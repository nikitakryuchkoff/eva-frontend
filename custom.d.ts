import { SyntheticEvent } from 'react';

interface EvaEnv {
  EVA_ON_OPENLINK_FN: (event: SyntheticEvent<Element, Event>, value: string) => void;
  EVA_OPEN_BROWSER_FN: (icon: string) => void;
  EVA_ON_OPEN_FN: () => void;
  EVA_ON_CLOSE_FN: () => void;
  COMPLEX_API_URL?: string;
  EVA_API_URL?: string;
  IS_STANDALONE?: boolean;
  EVA_IS_WEB_FN: {
    platform: string;
    web: boolean;
  };
  EVA_PLATFORM?: string;
}
declare global {
  interface Window extends EvaEnv {
    IS_STANDALONE?: boolean;
    env?: Partial<EvaEnv>;
    COMPLEX_API_URL: string;
    EVA_API_URL: string;
    currentEvaUserName?: string;
    eva?: {
      ipcSend: (channel: string, ...args: unknown[]) => void;
      openExternal?: (url: string) => Promise<void>;
      platform?: string;
    };
    evaGlobalAxiosInstance?: import('axios').AxiosInstance;
  }
}

declare module '*.svg' {
  const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  export default ReactComponent;
}
