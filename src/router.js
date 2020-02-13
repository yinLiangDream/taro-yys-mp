/**
 * 斗技排行列表
 */
export const charts = () => `/package-charts/charts/index`;

/**
 * 斗技玩家详情
 * @param {*} id
 */
export const chartsDetailRouter = (id, server, originServer) =>
  `/package-charts/charts-detail/index?id=${id}&server=${server}&originServer=${originServer}`;

/**
 *  首页路由
 */
export const homeRouter = () => "/pages/index/index";

/**
 * 逢魔路由
 */
export const fengmoRouter = () => "/pages/fengmo/index";

/**
 * 悬赏封印路由
 */
export const rewardRouter = () => "/package-reward/reward-for-seal/index";

/**
 * 悬赏封印详情路由
 * @param {*} item
 */
export const rewardDetailRouter = detail =>
  `/package-reward/reward-for-seal/reward-for-seal-detail/index?id=${
    detail.id
  }&advice=${JSON.stringify(detail.advice)}&name=${detail.name}`;

/**
 * 斗技阵容路由
 */
export const chartsPopularListRouter = () =>
  "/package-charts/charts-popular-list/index";
