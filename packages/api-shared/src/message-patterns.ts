// MSM => Microservice Message Pattern
export const MSM_PATTERN = {
  "auth-service": {
    welcome: "welcome_auth",
    auth: {
      login: "login",
    },
    user: {
      register: "register",
      getAll: "get_all_users",
      findById: "find_by_id",
      findByEmail: "find_by_email",
      changePassword: "change_password",
    },
  },
  "warehouse-service": { welcome: "welcome_warehouse" },
};
