# StickGram

基于 Vue 3、Pinia、Naive UI 的表情制作工具，支持文字表情、贴纸和连贯横幅。静态导出 WebP，动态导出 VP9 WebM，横幅按编号打包为 ZIP。

## 开发

使用 pnpm 10.11.1，版本声明在 `package.json` 的 `packageManager`。`pnpm-workspace.yaml` 明确包含根项目，并使用此版本支持的依赖构建许可配置。

```sh
pnpm install
pnpm dev
pnpm test
pnpm build
```

构建包含应用、测试和 Vite 配置的类型检查。`pnpm format` 统一源码、测试和文档格式。

## 部署

```sh
pnpm install --frozen-lockfile
pnpm run deploy
```

`wrangler.toml` 的 `[build] command = "pnpm build"` 会在部署前执行类型检查和 Vite 编译，产物写入 `dist`，再由 `[assets]` 上传并按 SPA 处理路由。无需手动预先构建。构建配置见 [Cloudflare 自定义构建文档](https://developers.cloudflare.com/workers/wrangler/configuration/#custom-builds)。

只验证编译和部署打包、不上传时，运行 `pnpm exec wrangler deploy --dry-run`。

正式构建在应用入口初始化 Microsoft Clarity（项目 ID：`ytaqmsk629`）；开发模式不启用统计。

`wrangler.toml` 使用 `custom_domain = true` 声明 `sticker.tgda.sh`，部署时由 Wrangler 配置域名绑定。域名所属的 `tgda.sh` 区域需在部署账号中处于激活状态。配置方式见 [Cloudflare 自定义域名文档](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/#set-up-a-custom-domain-in-your-wrangler-configuration-file)。

## 目录

| 目录                 | 职责                                             |
| -------------------- | ------------------------------------------------ |
| `src/app`            | 启动、路由、应用布局、国际化装配和全局样式       |
| `src/core`           | 纯数据模型、默认配置和领域规则                   |
| `src/application`    | 模块注册、项目状态、编辑会话、预览和导出编排     |
| `src/features`       | 各功能的界面、渲染器、效果、预设、创建表单和文案 |
| `src/infrastructure` | 浏览器存储、历史数据转换、图片／视频编码与 ZIP   |
| `src/shared`         | 不知道具体项目类型的画布、字体和浏览器工具       |
| `public`             | 示例贴纸与字体许可证                             |
| `tests`              | 单元、集成和架构边界测试，复用独立测试辅助工具   |
| `docs`               | 架构与扩展说明、验证记录                         |

新增项目类型从 `src/features/*/module.ts` 开始；新增效果和格式分别使用效果、编码器注册表。具体步骤见 [架构与扩展说明](docs/architecture.md)。

动态导出需要浏览器支持 VP9 MediaRecorder。已有项目在存储边界转换；打开项目和更新缩略图不会改变更新时间或排序。
