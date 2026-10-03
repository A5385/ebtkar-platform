export type AdminConfigScope =
    | 'ALL'
    | 'GLOBAL'
    | 'ACCESS'
    | 'NETWORK'
    | 'AUTH'
    | 'WAREHOUSE'
    | 'INVOICE';

export interface AdminAccessOrigin {
   originId     :string
  origin       :string
  credentials    :boolean
  methods      :  string[]
  allowedHeaders :string[]
  exposedHeaders :string[]

  accessSettingsId :boolean
 
}

export interface AdminAccessSettings {
    corsEnabled: boolean;
    origins: AdminAccessOrigin[];
}

export interface AdminGlobalSettings {
    platformName: string;
    logo: string | null;
    favicon: string | null;
    maintenanceMode: boolean;
    registrationEnabled: boolean;
    defaultLocale: string;
    defaultTimezone: string;
}

export interface AdminNetworkSettings {
    httpClientRetries: number;
    requestTimeoutMs: number;
}

export interface AdminTokensConfig {
    accessTokenExp: number;
    refreshTokenExp: number;
}

export interface AdminConfigSnapshot {
    version: number;
    updatedAt: string;
    global: AdminGlobalSettings | null;
    access: AdminAccessSettings | null;
    network: AdminNetworkSettings | null;
    tokens: AdminTokensConfig | null;
    warehouse: unknown[];
    invoice: unknown[];
}

export interface AdminConfigPublicView {
    version: number;
    updatedAt: string;
    platformName: string;
    logo: string | null;
    favicon: string | null;
    maintenanceMode: boolean;
    registrationEnabled: boolean;
    defaultLocale: string;
    defaultTimezone: string;
}
