export type ActivityDrop = {
  image?: string | null; name?: string; label?: string; rewardType?: number;
  rewardValue?: number; amount?: number; countOnly?: boolean; isPiece?: boolean;
};
export type ActivityEvent = { startTimestamp: number; endTimestamp: number; drops?: ActivityDrop[] };
export function dateRangeTimestamps(start: string, end: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(start) || !/^\d{4}-\d{2}-\d{2}$/.test(end)) return null;
  const s = Date.parse(`${start}T00:00:00+08:00`);
  const eBase = Date.parse(`${end}T00:00:00+08:00`);
  const e = eBase + 86400000;
  const validDate = (value: string, timestamp: number) => {
    const parts = value.split('-').map(Number);
    const date = new Date(timestamp + 8 * 3600000);
    return date.getUTCFullYear() === parts[0] && date.getUTCMonth() + 1 === parts[1] && date.getUTCDate() === parts[2];
  };
  if (!Number.isFinite(s) || !Number.isFinite(eBase) || !Number.isFinite(e) || !validDate(start, s) || !validDate(end, eBase) || e <= s) return null;
  return { startTimestamp: s / 1000, endExclusive: e / 1000 };
}
export function eventsOverlap(event: ActivityEvent, range: {startTimestamp:number; endExclusive:number}) {
  return event.startTimestamp < range.endExclusive && event.endTimestamp >= range.startTimestamp;
}
export function aggregateActivityRewards(events: ActivityEvent[]) {
  const map = new Map<string, { key:string; image?:string|null; name:string; amount:number; unknown:boolean }>();
  for (const event of events) for (const drop of event.drops || []) {
    if (drop.countOnly || !Number.isFinite(drop.rewardType) || !Number.isFinite(drop.rewardValue)) continue;
    // Generic consumables use a stable display identity even when the data has
    // campaign/version-specific item IDs. Variant rewards (cards, characters,
    // and pieces) remain keyed by their concrete type/value pair.
    const key = drop.rewardType === 174 && !drop.isPiece &&
      [195, 203, 208, 212].includes(drop.rewardValue!)
      ? 'generic:factor-research-report'
      : `${drop.rewardType}:${drop.rewardValue}`;
    const amount = drop.amount;
    const known = typeof amount === 'number' && Number.isFinite(amount) && amount > 0;
    let item = map.get(key);
    if (!item) { item = { key, image: drop.image, name: drop.name || drop.label || '奖励', amount: 0, unknown: false }; map.set(key, item); }
    if (known) item.amount += amount; else item.unknown = true;
  }
  const priority = (name: string) => {
    if (name === "宝石") return 0;
    if (name === "协助卡招募券") return 1;
    if (name === "养成优俊少女招募券") return 2;
    if (name === "彩虹结晶片") return 3;
    if (name === "因子研究报告") return 4;
    if (name === "稀有启发专业书") return 5;
    if (name === "稀有启发书") return 6;
    if (name === "启发专业书") return 7;
    if (name === "启发书") return 8;
    if (name.endsWith("超稀有兑换券")) return 9;
    if (name === "能量饮料30") return 10;
    if (name === "迷你胡萝卜果冻") return 11;
    if (name === "女神像") return 12;
    const shoeOrder = ["短距离跑鞋", "英里跑鞋", "中距离跑鞋", "长距离跑鞋", "泥地跑鞋"];
    const shoeIndex = shoeOrder.indexOf(name);
    if (shoeIndex >= 0) return 14 + shoeIndex;
    if (name.endsWith("碎片")) return 19;
    return 13;
  };
  return [...map.values()].sort((a, b) =>
    priority(a.name) - priority(b.name) || a.name.localeCompare(b.name, "zh-CN"),
  );
}
