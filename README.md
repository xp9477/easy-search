# EasySearch

聚合搜索入口：输入一次关键词，一键跳转到百度、Google、小红书、抖音、B站、淘宝、ChatGPT 等 20+ 平台。
Next.js 15 App Router + Tailwind v4 + PWA（可安装到手机桌面，移动端自动走 App 深链）。

## 开发

```bash
npm install
npm run dev        # http://localhost:3000
```

| 命令 | 作用 |
| --- | --- |
| `npm run dev` | 本地开发（PWA 在 dev 下禁用） |
| `npm run build` | 生产构建，同时生成 `public/sw.js` |
| `npm start` | 跑生产构建 |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |

## 添加 / 修改搜索引擎

只需要改 [`data/search-engines.json`](data/search-engines.json)，页面会自动渲染，不用动组件代码。

```jsonc
{
  "name": "百度",                              // 按钮文字，需唯一（用作 React key）
  "url": "https://www.baidu.com/s?wd={query}", // 桌面端 / 无 App 时打开的网址
  "url_scheme": "bilibili://search?keyword={query}", // 可选：移动端优先尝试的 App 深链
  "category": "搜索",                          // 搜索 | AI | 娱乐 | 购物，省略则归入「搜索」
  "prefill": "clipboard"                       // 可选：站点不支持 URL 预填时，复制到剪贴板再打开
}
```

`{query}` 会被 `encodeURIComponent` 后的关键词替换。

分类列表由 [`data/config.ts`](data/config.ts) 的 `CATEGORIES` 决定，且只会显示实际有条目的分类；
新增分类时改这一处即可。

## 主题

右上角按钮在「跟随系统 → 浅色 → 深色」之间循环，选择存在 `localStorage.theme`。
深浅两套色板都在 [`app/globals.css`](app/globals.css) 的 `:root` / `.dark` 里，
用的是同一套蓝（深色下把 `#1e90ff` 提亮成 `#4da6ff` 以保证在深底上的对比度）。

> 注意：`components/ui/button.tsx` 的 `outline` variant 自带
> `dark:bg-input/30`、`dark:hover:bg-input/50`，会盖掉 `bg-card` / `hover:bg-accent`。
> 引擎网格因此显式写了 `dark:bg-card dark:hover:bg-accent`，新增按钮时注意同样处理。

## URL 参数

`/?keyword=xxx` 可以预填搜索框，方便做浏览器自定义搜索引擎或系统分享目标。

## 部署

推送到默认分支后由 Vercel 自动部署。若部署到自定义域名，设置环境变量
`NEXT_PUBLIC_SITE_URL=https://your-domain` 以让 Open Graph 的绝对地址正确。

## 结构

```
app/
  layout.tsx             metadata / viewport / 主题 Provider
  page.tsx               Server Component，构建期注入引擎数据
  easy-search-client.tsx 搜索框、分类切换、跳转逻辑
  globals.css            深浅两套色板
components/
  search-engine-grid.tsx 引擎按钮网格
  theme-provider.tsx     next-themes 封装
  theme-toggle.tsx       右上角主题切换按钮
  ui/                    shadcn/ui (button, input)
data/
  config.ts              分类定义与类型
  search-engines.json    引擎数据（唯一数据源）
```

> `public/sw.js` 与 `public/workbox-*.js` 是 `@ducanh2912/next-pwa` 构建产物，已在 `.gitignore` 中忽略，不要提交。
