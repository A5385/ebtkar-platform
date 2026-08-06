// packages\api-shared\src\response-handler\type.ts

import type { MethodType } from "@repo/types";

export type GetByType = { key: string; value: string };

export type GenerateMessageProps = {
  method: MethodType;
  moduleName: string;
  statusCode?: number | undefined;
  getBy?: GetByType | undefined;
  id?: string | undefined;
  email?: string;
};
