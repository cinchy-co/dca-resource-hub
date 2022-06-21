import {CinchyConfig} from "@cinchy-co/angular-sdk";

const cinchyConfig: CinchyConfig = {
  "authority": "https://datacollaboration.net/sso",
  "cinchyRootUrl": "https://datacollaboration.net",
  "clientId": "community-hub",
  "redirectUri": "https://localhost:3000/"
};

export const environment = {
  production: false,
  cinchyConfig
};
