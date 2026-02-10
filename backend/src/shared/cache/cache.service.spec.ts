import { CacheService } from '@/shared/cache/cache.service';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import { Test } from '@nestjs/testing';
import { mock, mockReset } from 'vitest-mock-extended';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('CacheService', () => {
  const cacheManagerMock = mock<Cache>();
  let service: CacheService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CacheService,
        {
          provide: CACHE_MANAGER,
          useValue: cacheManagerMock,
        },
      ],
    }).compile();

    service = module.get<CacheService>(CacheService);
    mockReset(cacheManagerMock);
  });

  describe('getOrSet', () => {
    it('should return cached value if exists', async () => {
      const cachedValue = { data: 'cached' };
      cacheManagerMock.get.mockResolvedValueOnce(cachedValue);
      const fetchMock = vi.fn().mockResolvedValue({ data: 'fresh' });

      const result = await service.getOrSet({
        key: 'test-key',
        ttl: 30000,
        fetch: fetchMock,
      });

      expect(cacheManagerMock.get).toHaveBeenCalledWith('test-key');
      expect(fetchMock).not.toHaveBeenCalled();
      expect(result).toEqual(cachedValue);
    });

    it('should fetch and cache if not cached', async () => {
      cacheManagerMock.get.mockResolvedValueOnce(null);
      const freshValue = { data: 'fresh' };
      const fetchMock = vi.fn().mockResolvedValue(freshValue);

      const result = await service.getOrSet({
        key: 'test-key',
        ttl: 30000,
        fetch: fetchMock,
      });

      expect(fetchMock).toHaveBeenCalled();
      expect(cacheManagerMock.set).toHaveBeenCalledWith(
        'test-key',
        freshValue,
        30000,
      );
      expect(result).toEqual(freshValue);
    });

    it('should skip cache when skipWhen returns true', async () => {
      const freshValue = { data: 'fresh' };
      const fetchMock = vi.fn().mockResolvedValue(freshValue);

      const result = await service.getOrSet({
        key: 'test-key',
        ttl: 30000,
        fetch: fetchMock,
        skipWhen: () => true,
      });

      expect(cacheManagerMock.get).not.toHaveBeenCalled();
      expect(cacheManagerMock.set).not.toHaveBeenCalled();
      expect(fetchMock).toHaveBeenCalled();
      expect(result).toEqual(freshValue);
    });

    it('should use cache when skipWhen returns false', async () => {
      const cachedValue = { data: 'cached' };
      cacheManagerMock.get.mockResolvedValueOnce(cachedValue);
      const fetchMock = vi.fn().mockResolvedValue({ data: 'fresh' });

      const result = await service.getOrSet({
        key: 'test-key',
        ttl: 30000,
        fetch: fetchMock,
        skipWhen: () => false,
      });

      expect(cacheManagerMock.get).toHaveBeenCalledWith('test-key');
      expect(fetchMock).not.toHaveBeenCalled();
      expect(result).toEqual(cachedValue);
    });
  });

  describe('invalidate', () => {
    it('should delete key from cache', async () => {
      await service.invalidate('test-key');

      expect(cacheManagerMock.del).toHaveBeenCalledWith('test-key');
    });
  });

  describe('invalidateMany', () => {
    it('should delete multiple keys from cache', async () => {
      const keys = ['key1', 'key2', 'key3'];

      await service.invalidateMany(keys);

      expect(cacheManagerMock.del).toHaveBeenCalledTimes(3);
      expect(cacheManagerMock.del).toHaveBeenCalledWith('key1');
      expect(cacheManagerMock.del).toHaveBeenCalledWith('key2');
      expect(cacheManagerMock.del).toHaveBeenCalledWith('key3');
    });
  });
});
