// packages\api-shared\src\response-handler\message-generator.ts
import type { MessageType, MethodType } from "@repo/types";
import type { GenerateMessageProps } from "./type";

export function generateMessage({
  moduleName,
  type,
  method,
  getBy,
  id,
  email,
}: GenerateMessageProps & { type: MessageType }): string {
  const messages: Record<MethodType, Record<MessageType, string>> = {
    create: {
      success: `${moduleName}_created_successfully.`,
      error: `Failed_to_create ${moduleName}.`,
    },
    update: {
      success: `${moduleName}_updated_successfully.`,
      error: `failed_to_update_${moduleName}.`,
    },
    delete: {
      success: `${moduleName}_deleted_successfully.`,
      error: `failed_to_delete_${moduleName}.`,
    },
    "get-all": {
      success: `${moduleName}_records_retrieved_successfully.`,
      error: `failed_to_retrieve_${moduleName}_records.`,
    },
    "find-by": {
      success: `${moduleName}_retrieved_successfully ${getBy ? `_with ${getBy.key}: ${getBy?.value}` : ""}.`,
      error: `failed_to_retrieve_${moduleName}_${getBy ? `with ${getBy.key}: ${getBy?.value}` : ""}.`,
    },
    "find-by-id": {
      success: `${moduleName}_retrieved_successfully_${id ? `with ID: ${id}` : ""}.`,
      error: `failed_to_retrieve_${moduleName} ${id ? `with ID: ${id}` : ""}.`,
    },
    login: {
      success: `${email} you_successfully_login`,
      error: `Failed_to_login ${email}.`,
    },
  };

  return messages[method][type];
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  try {
    return JSON.stringify(error);
  } catch {
    return "Unknown error";
  }
}
