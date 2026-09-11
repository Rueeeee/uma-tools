# 《闪耀优俊少女》排期查询

赛马娘国服（闪耀优俊少女）活动排期查询站，汇总游戏内的卡池、活动、大赛、兑换等时间线信息。

**线上地址**:https://rueeeee.github.io/uma-tools/

Fork 自 [mikumifa/uma-tools](https://github.com/mikumifa/uma-tools),在其情报汇总功能基础上重新设计了界面(粉黄主题、卡片式卡池布局、倒计时、进行中汇总等),并移除了身位图计算、种马设计模块,专注做排期查询。

## 功能

- **卡池**:角色 / 支援卡招募排期,含 UP 卡面预览、付费 / 免费抽标记、剩余天数倒计时,支持列表 / 日历两种视图
- **活动**:剧情活动、训练员技能考试、竞速嘉年华等排期与奖励一览,支持按类型 / 日期区间筛选和奖励汇总
- **大赛**:赛事排期、赛道条件(距离 / 场地 / 天气概率等)与赛程节点
- **兑换**:限时兑换商店明细(奖励 / 消耗 / 限购)
- 支持导出当前排期为长图(脚本自动化用)
- 响应式布局,宽屏居中、移动端单列

## 数据来源

所有排期数据来自国服客户端解包的 `master.mdb`(SQLite),由 `scripts/generate_site_results.py` 解析生成:

- `umalator/data/results_intel.json` —— 前端直接消费的情报 JSON
- `umalator/public/intel/` —— 图标、卡面、banner 等静态资源

`jp-master.mdb` 仅用于导出日服文本对照(`scripts/text_data_csv.py`),不参与网页展示。

## 常用命令

```bash
npm install        # 安装依赖
npm run dev        # 本地开发,端口 8000
npm run build      # 构建到 dist/(会自动先跑 generate_site_results.py 重新生成数据)
npm run preview    # 本地预览构建产物
```

## 更新数据

游戏数据更新后,替换仓库根目录的 `master.mdb`,然后:

```bash
npm run update:data
```

会重新生成所有数据文件并构建。也可以指定外部数据库路径:

```bash
python scripts/update_data.py D:\path\to\master.mdb --build
```

游戏图片资源需要配置解包出的 Texture2D 目录才会拷贝,在 `.env.local` 中设置:

```
UMA_TEXTURE2D_DIR=D:\Apps\umas\export\Texture2D
```

> 注意:数据生成脚本需要 Python 时区数据库。Windows 上若报 `No time zone found with key Asia/Shanghai`,先 `pip install tzdata`。

## 部署

推送到 `master` 分支后,GitHub Actions(`.github/workflows/jekyll-gh-pages.yml`)自动构建并部署到 GitHub Pages。仓库 Settings → Pages 的 Source 需设为 **GitHub Actions**。

## 项目结构

```
umalator/            前端应用(Preact + Vite)
  src/app/           页面入口、情报汇总面板、导出图片逻辑
  data/              生成的前端 JSON 数据(@data/*)
  public/            静态资源(图标、banner 等)
scripts/             数据解析脚本(master.mdb → JSON)
uma-skill-tools/     模拟器领域库(当前界面未使用,保留备用)
```
