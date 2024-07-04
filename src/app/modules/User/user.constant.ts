export const USER_ROLE = {
  superAdmin: 'superAdmin',
  user: 'user',
} as const;

export interface DashboardData {
  totalShoppingAmount: number;
  totalProductsBought: number;
  totalProductsCancelled: number;
  totalRewardsPoints: number;
}