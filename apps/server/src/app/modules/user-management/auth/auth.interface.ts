export interface GoogleAuthData {
  authUrl: string;
  codeVerifier: string;
  state: string;
  scopes: string[];
}

export interface GoogleUserInfo {
  email: string;
  name: string;
  picture: string;
}
