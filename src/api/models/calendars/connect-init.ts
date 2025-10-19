export interface ConnectInitRequest {
  provider: string;
  loginHint?: string;
}

export interface ConnectInitResponse {
  authorizationUrl?: string;
  state?: string;
}
