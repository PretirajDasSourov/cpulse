export type SupportedPlatform = 'CODEFORCES' | 'VJUDGE' | 'TOPH' | 'ATCODER' | 'CODECHEF' | 'LEETCODE';

export interface NormalizedProfile {
  username: string;
  rating?: number;
  highestRating?: number;
  rankTitle?: string;
  avatarUrl?: string;
  totalSolved?: number;
  isAvailable: boolean;
  unavailableReason?: string;
}

export interface NormalizedSubmission {
  externalId: string;
  problemExternalId: string;
  problemName: string;
  problemUrl: string;
  problemRating?: number;
  problemTags: string[];
  verdict: 'ACCEPTED' | 'WRONG_ANSWER' | 'TIME_LIMIT_EXCEEDED' | 'MEMORY_LIMIT_EXCEEDED' | 'RUNTIME_ERROR' | 'COMPILATION_ERROR' | 'OTHER';
  language: string;
  submittedAt: Date;
}

export interface AdapterResult<T> {
  success: boolean;
  data?: T;
  isAvailable: boolean;
  error?: string;
}

export interface IPlatformAdapter {
  platform: SupportedPlatform;
  displayName: string;
  getProfile(username: string): Promise<AdapterResult<NormalizedProfile>>;
  getSubmissions(username: string, sinceDate?: Date): Promise<AdapterResult<NormalizedSubmission[]>>;
  isFeatureSupported(feature: 'PROFILE' | 'SUBMISSIONS' | 'RATING'): boolean;
}\n