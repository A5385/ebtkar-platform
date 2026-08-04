// packages\api-shared\src\response-handler\generate-response.ts
import { type ResponseType } from "@repo/types";

export function GenerateApiResponse<T>(
  props: ResponseType<T>,
): ResponseType<T> {
  return props;
}
