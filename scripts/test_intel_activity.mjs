import assert from 'node:assert/strict';
import ts from 'typescript';
import fs from 'node:fs';
// Import transpiled pure helper without Node's newer TypeScript loader.
const source = fs.readFileSync(new URL('../umalator/src/app/intelActivityAggregate.ts', import.meta.url), 'utf8');
const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2020 } }).outputText;
const mod = await import(`data:text/javascript;base64,${Buffer.from(js).toString('base64')}`);
const { dateRangeTimestamps, eventsOverlap, aggregateActivityRewards } = mod;
const day = dateRangeTimestamps('2024-01-01','2024-01-01');
assert.equal(day.endExclusive - day.startTimestamp, 86400);
assert.equal(dateRangeTimestamps('2024-02-30','2024-02-30'), null);
assert.equal(dateRangeTimestamps('2024-01-02','2024-01-01'), null);
const r = dateRangeTimestamps('2024-01-02','2024-01-03');
assert(eventsOverlap({ startTimestamp: r.startTimestamp - 1, endTimestamp: r.startTimestamp, drops: [] }, r));
assert(!eventsOverlap({ startTimestamp: r.endExclusive, endTimestamp: r.endExclusive + 1, drops: [] }, r));
const rewards = aggregateActivityRewards([{ startTimestamp: 0, endTimestamp: 1, drops: [
  { rewardType: 174, rewardValue: 195, amount: 3, name: '因子研究报告' },
  { rewardType: 174, rewardValue: 195, amount: 2, name: '因子研究报告' },
  { rewardType: 174, rewardValue: 203, amount: 1, name: '因子研究报告' },
  { rewardType: 2, rewardValue: 10, amount: 1, name: '角色碎片' },
  { rewardType: 2, rewardValue: 11, amount: 1, name: '角色碎片' },
  { rewardType: 9, rewardValue: 9, amount: 4, countOnly: true },
  { rewardType: 174, rewardValue: 195 }
] }]);
assert.equal(rewards.length, 3);
const report = rewards.find((x) => x.key === 'generic:factor-research-report');
assert.equal(report.amount, 6);
assert.equal(report.unknown, true);
assert.equal(rewards.filter((x) => x.name === '角色碎片').length, 2);
const expectedOrder = [
  '宝石', '协助卡招募券', '养成优俊少女招募券', '彩虹结晶片', '因子研究报告',
  '稀有启发专业书', '稀有启发书', '启发专业书', '启发书',
  '2.5周年庆典 超稀有兑换券', '能量饮料30', '迷你胡萝卜果冻', '女神像',
  '闹钟', '短距离跑鞋', '英里跑鞋', '中距离跑鞋', '长距离跑鞋', '泥地跑鞋', '角色碎片',
];
const sortedRewards = aggregateActivityRewards([{ startTimestamp: 0, endTimestamp: 1, drops:
  expectedOrder.map((name, index) => ({ name, rewardType: 1, rewardValue: index + 1, amount: 1 })).reverse(),
}]);
assert.deepEqual(sortedRewards.map((reward) => reward.name), expectedOrder);
console.log('intel activity tests passed');
