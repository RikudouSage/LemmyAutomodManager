export interface DisableableEntity {
  enabled: boolean;
}

export interface UserTargetingEntity {
  username: string | null;
  instance: string | null;
  userId: number | null;
}

export interface RemoveAllEntity {
  removeAll: boolean;
}

export interface RegexReasonEntity {
  regex: string;
  reason: string | null;
}
