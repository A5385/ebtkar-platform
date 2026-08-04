// packages\api-shared\src\response-handler\message-generator.ts
import type { LocaleType, MessageType, MethodType } from "@repo/types";
import type { GenerateMessageProps } from "./type";

export function generateMessage({
  moduleName,
  type,
  method,
  locale = "en",
  getBy,
  id,
}: GenerateMessageProps & { type: MessageType }): string {
  const messages: Record<
    MethodType,
    Record<MessageType, Record<LocaleType, string>>
  > = {
    create: {
      success: {
        en: `${moduleName} created successfully.`,
        ar: `تم إنشاء ${moduleName} بنجاح.`,
      },
      error: {
        en: `Failed to create ${moduleName}.`,
        ar: `فشل إنشاء ${moduleName}.`,
      },
    },
    update: {
      success: {
        en: `${moduleName} updated successfully.`,
        ar: `تم تعديل ${moduleName} بنجاح.`,
      },
      error: {
        en: `Failed to update ${moduleName}.`,
        ar: `فشل تعديل ${moduleName}.`,
      },
    },
    delete: {
      success: {
        en: `${moduleName} deleted successfully.`,
        ar: `تم حذف ${moduleName} بنجاح.`,
      },
      error: {
        en: `Failed to delete ${moduleName}.`,
        ar: `فشل حذف ${moduleName}.`,
      },
    },
    "get-all": {
      success: {
        en: `${moduleName} records retrieved successfully.`,
        ar: `تم استرجاع بيانات ${moduleName} بنجاح.`,
      },
      error: {
        en: `Failed to retrieve ${moduleName} records.`,
        ar: `فشل استرجاع بيانات ${moduleName}.`,
      },
    },
    "find-by": {
      success: {
        en: `${moduleName} retrieved successfully ${getBy ? `with ${getBy.key}: ${getBy?.value}` : ""}.`,
        ar: `تم استرجاع ${moduleName} بنجاح.`,
      },
      error: {
        en: `Failed to retrieve ${moduleName} ${getBy ? `with ${getBy.key}: ${getBy?.value}` : ""}.`,
        ar: `فشل استرجاع ${moduleName}.`,
      },
    },
    "find-by-id": {
      success: {
        en: `${moduleName} retrieved successfully ${id ? `with ID: ${id}` : ""}.`,
        ar: `تم استرجاع ${moduleName} بنجاح.`,
      },
      error: {
        en: `Failed to retrieve ${moduleName} ${id ? `with ID: ${id}` : ""}.`,
        ar: `فشل استرجاع ${moduleName}.`,
      },
    },
  };

  return messages[method][type][locale];
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
