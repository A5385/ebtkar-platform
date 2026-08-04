// // api\src\config\app.config.ts

// import { utilities as nestWinstonModuleUtilities, WinstonModuleOptions } from 'nest-winston';
// import * as winston from 'winston';
// import { AppConfig } from './app.config';

// export const WinstonConfig: WinstonModuleOptions = {
//     transports: [
//         new winston.transports.Console({
//             format: winston.format.combine(
//                 winston.format.timestamp(),
//                 winston.format.ms(),
//                 nestWinstonModuleUtilities.format.nestLike(AppConfig.name, {
//                     colors: true,
//                     prettyPrint: true,
//                 }),
//             ),
//         }),
//     ],
// };
