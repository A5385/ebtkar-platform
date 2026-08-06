import { Injectable, LoggerService } from "@nestjs/common";
import { convertTitle } from "@repo/helpers";
import { format } from "date-fns";
import { utilities as nestWinstonModuleUtilities } from "nest-winston";
import * as winston from "winston";
import "winston-daily-rotate-file";
import { AppConfig } from "../app-config";

type InfoType = winston.Logform.TransformableInfo & {
  timestamp?: string; // بقت اختيارية
  context?: string;
  trace?: string;
};

@Injectable()
export class WinstonLoggerService implements LoggerService {
  private logger: winston.Logger;

  constructor() {
    const formatMsg = ({
      timestamp,
      level,
      message,
      context,
      trace,
    }: InfoType) => {
      const contextLength = context?.length ?? 0;
      const maxContextLength = 11 + 1;
      const spaces =
        contextLength < maxContextLength ? maxContextLength - contextLength : 0;

      return `${context?.toUpperCase() ?? "N/A"}${" ".repeat(spaces)}  |  ${level}  |  ${format(timestamp ?? "", "dd/MM/yyyy")}  |  ${format(timestamp ?? "", "hh:mm:ss")}  |  ${convertTitle(message as string)}${trace ? `\n${trace}` : ""}`;
    };

    const formatPrintF = winston.format.printf((info: InfoType) =>
      formatMsg(info),
    );

    const winstonConsole = new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.colorize(),
        nestWinstonModuleUtilities.format.nestLike(AppConfig.name, {
          colors: true,
          prettyPrint: true,
        }),
        formatPrintF,
      ),
    });

    const winstonTransports = new winston.transports.DailyRotateFile({
      filename: "logs/application-%DATE%.log",
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json(),
      ),
    });

    this.logger = winston.createLogger({
      level: AppConfig.production ? "info" : "debug",
      format: winston.format.combine(winston.format.timestamp(), formatPrintF),
      transports: [winstonConsole, winstonTransports],
    });
  }

  log(message: string, context?: string) {
    this.logger.info(message, { context });
  }

  error(message: string, trace?: string, context?: string) {
    this.logger.error(message, { trace, context });
  }

  warn(message: string, context?: string) {
    this.logger.warn(message, { context });
  }

  debug(message: string, context?: string) {
    this.logger.debug(message, { context });
  }

  verbose(message: string, context?: string) {
    this.logger.verbose(message, { context });
  }
}
