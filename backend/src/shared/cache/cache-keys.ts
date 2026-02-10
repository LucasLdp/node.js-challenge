export const CacheKeys = {
  balance: (userId: string) => `cash-flow:balance:${userId}`,
  cashFlows: (userId: string, page?: number, limit?: number) =>
    `cash-flow:list:${userId}:${page ?? 'all'}:${limit ?? 'all'}`,
  cashFlow: (id: string) => `cash-flow:${id}`,
} as const;

export const CacheTTL = {
  BALANCE: 30000,
  CASH_FLOWS: 30000,
  CASH_FLOW: 60000,
} as const;
