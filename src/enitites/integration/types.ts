import { EntitiesResponse } from "@/shared/types";

export type Integration = {
  id: string;
  title: string;
  default: boolean;
  withOperator: boolean;
};

export type Integrations = Integration[];

export type IntegrationsResponse = EntitiesResponse<Integration>;
