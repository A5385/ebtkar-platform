// packages\api-shared\src\response-handler\type.ts
import type { LocaleType, MethodType } from "@repo/types";

export type GetByType = { key: string; value: string };

export type GenerateMessageProps = {
  method: MethodType;
  locale?: LocaleType | undefined;
  moduleName: string;
  statusCode?: number | undefined;
  getBy?: GetByType | undefined;
  id?: string | undefined;
};
