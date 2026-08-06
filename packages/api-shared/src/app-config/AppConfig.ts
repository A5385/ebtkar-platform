export const AppConfig = {
  name: (process.env.SERVER_PREFIX || "API").split("/").join("-").toUpperCase(),
  production: process.env.NODE_ENV === "production",
};
