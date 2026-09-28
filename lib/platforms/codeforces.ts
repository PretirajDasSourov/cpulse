import { IPlatformAdapter, SupportedPlatform, NormalizedProfile, NormalizedSubmission, AdapterResult } from './types';

export class CodeforcesAdapter implements IPlatformAdapter {
  platform: SupportedPlatform = 'CODEFORCES';
  displayName = 'Codeforces';
  private baseUrl = 'https://codeforces.com/api';

  isFeatureSupported(feature: 'PROFILE' | 'SUBMISSIONS' | 'RATING'): boolean {
    return true;
  }

  async getProfile(username: string): Promise<AdapterResult<NormalizedProfile>> {
    try {
      const res = await fetch(`${this.baseUrl}/user.info?handles=${encodeURIComponent(username)}`);
      if (res.status === 400 || res.status === 404) {
        return { success: false, isAvailable: true, error: 'Codeforces user handle not found' };
      }
      if (!res.ok) {
        return { success: false, isAvailable: false, error: `Codeforces returned HTTP ${res.status}` };
      }
      const json = await res.json();
      if (json.status !== 'OK' || !json.result || json.result.length === 0) {
        return { success: false, isAvailable: true, error: json.comment || 'Failed to read profile' };
      }
      const user = json.result[0];
      return {
        success: true,
        isAvailable: true,
        data: {
          username: user.handle,
          rating: user.rating,
          highestRating: user.maxRating,
          rankTitle: user.rank,
          avatarUrl: user.titlePhoto?.startsWith('//') ? `https:${user.titlePhoto}` : user.titlePhoto,
          isAvailable: true,
        },
      };
    } catch {
      return { success: false, isAvailable: false, error: 'Network failure connecting to Codeforces' };
    }
  }

  async getSubmissions(username: string, sinceDate?: Date): Promise<AdapterResult<NormalizedSubmission[]>> {
    try {
      const res = await fetch(`${this.baseUrl}/user.status?handle=${encodeURIComponent(username)}&from=1&count=1000`);
      if (!res.ok) return { success: false, isAvailable: false, error: 'Submissions query failed' };
      const json = await res.json();
      if (json.status !== 'OK') return { success: false, isAvailable: true, error: json.comment };

      const normalized: NormalizedSubmission[] = [];
      for (const item of json.result) {
        const submittedAt = new Date(item.creationTimeSeconds * 1000);
        if (sinceDate && submittedAt <= sinceDate) continue;

        const p = item.problem;
        const problemKey = p.contestId ? `${p.contestId}${p.index}` : p.name;
        const problemUrl = p.contestId
          ? `https://codeforces.com/contest/${p.contestId}/problem/${p.index}`
          : `https://codeforces.com/problemset/problem/${p.problemsetName}/${p.index}`;

        let verdict: NormalizedSubmission['verdict'] = 'OTHER';
        if (item.verdict === 'OK') verdict = 'ACCEPTED';
        else if (item.verdict === 'WRONG_ANSWER') verdict = 'WRONG_ANSWER';
        else if (item.verdict === 'TIME_LIMIT_EXCEEDED') verdict = 'TIME_LIMIT_EXCEEDED';
        else if (item.verdict === 'MEMORY_LIMIT_EXCEEDED') verdict = 'MEMORY_LIMIT_EXCEEDED';
        else if (item.verdict === 'RUNTIME_ERROR') verdict = 'RUNTIME_ERROR';
        else if (item.verdict === 'COMPILATION_ERROR') verdict = 'COMPILATION_ERROR';

        normalized.push({
          externalId: item.id.toString(),
          problemExternalId: problemKey,
          problemName: p.name,
          problemUrl,
          problemRating: p.rating,
          problemTags: p.tags || [],
          verdict,
          language: item.programmingLanguage,
          submittedAt,
        });
      }
      return { success: true, isAvailable: true, data: normalized };
    } catch {
      return { success: false, isAvailable: false, error: 'Failed to fetch Codeforces submissions' };
    }
  }
}\n