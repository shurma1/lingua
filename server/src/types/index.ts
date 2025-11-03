
export interface MiniAppUser {
  id: number;
  first_name?: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  photo_url?: string;
  is_premium?: boolean;
}

export interface InitData {
  user?: MiniAppUser;
  hash: string;
  query_id?: string;
}

export interface JwtPayload {
  userId: number;
  externalId: number;
  username: string;
  iat?: number;
  exp?: number;
}

