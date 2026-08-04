import type { CorsOptions } from "@nestjs/common/interfaces/external/cors-options.interface";

export type AppOptions = {
  isMicroservice?: boolean;
  enableCors?: boolean;
  enableCookie?: boolean;
  enablePrefix?: boolean;
  enableUpload?: boolean;
  uploadFolder?: string;
  enableValidationPipe?: boolean;
  corsOptions?: CorsOptions;
};
