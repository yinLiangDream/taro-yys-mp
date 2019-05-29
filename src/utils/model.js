export const ENV =
  process.env.NODE_ENV === 'development' ? 'test-ee83d3' : 'formal-265d2c';

export const LOADINGIMG =
  'https://mp-yys-1255362963.cos.ap-chengdu.myqcloud.com/loading.gif';

export const attrRoleKey = {
  /**
   * 攻击
   */
  ATTACK: 'attack',
  /**
   * 攻击加成
   */
  ATTACKRATE: 'attackRate',
  /**
   * 生命
   */
  MAXHP: 'maxHp',
  /**
   * 生命加成
   */
  MAXHPRATE: 'maxHpRate',
  /**
   * 防御
   */
  DEFENSE: 'defense',
  /**
   * 防御加成
   */
  DEFENSERATE: 'defenseRate',
  /**
   * 速度
   */
  SPEED: 'speed',
  /**
   * 暴击
   */
  CRITRATE: 'critRate',
  /**
   * 爆伤
   */
  CRITPOWER: 'critPower',
  /**
   * 抵抗
   */
  DEBUFFRESIST: 'debuffResist',
  /**
   * 命中
   */
  DEBUFFENHANCE: 'debuffEnhance'
};
