import {CinchyConfig} from "@cinchy-co/angular-sdk";

const cinchyConfig: CinchyConfig = {
  "authority": "https://datacollaboration.net/sso",
  "cinchyRootUrl": "https://datacollaboration.net",
  "clientId": "community-hub-prod",
  "redirectUri": "https://datacollaboration.net/privacyTools/",
};

export const environment = {
  production: true,
  cinchyConfig
};
