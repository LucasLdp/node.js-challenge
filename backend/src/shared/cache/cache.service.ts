import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';

export interface GetOrSetOptions<T> {
  key: string;
  ttl: number;
  fetch: () => Promise<T>;
  skipWhen?: () => boolean;
}

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async getOrSet<T>({
    key,
    ttl,
    fetch,
    skipWhen,
  }: GetOrSetOptions<T>): Promise<T> {
    if (skipWhen?.()) {
      return fetch();
    }

    const cached = await this.cacheManager.get<T>(key);

    if (cached !== null && cached !== undefined) {
      return cached;
    }

    const result = await fetch();
    await this.cacheManager.set(key, result, ttl);

    return result;
  }

  async invalidate(key: string): Promise<void> {
    await this.cacheManager.del(key);
  }

  async invalidateMany(keys: string[]): Promise<void> {
    await Promise.all(keys.map((key) => this.cacheManager.del(key)));
  }
}
