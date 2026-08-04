// // api\src\config\validation-pipe.config.ts

// import { BadRequestException } from "@nestjs/common";

// export const ValidationPipeConfig = {
//   whitelist: true,
//   transform: true,
//   skipUndefinedProperties: true,
//   transformOptions: { enableImplicitConversion: true },
//   exceptionFactory: (validationErrors = []) => {
//     const formattedErrors = validationErrors
//       .map((error) => {
//         const constraints = Object.values(error.constraints || {}).join(", ");
//         return `${error.property}: ${constraints}`;
//       })
//       .join(", ");

//     throw new BadRequestException({
//       message: `Validation failed. Please correct the following: ${formattedErrors}`,
//     });
//   },
// };
