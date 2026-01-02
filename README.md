# SparkleMe

<h3 align="center">Another <a href="https://github.com/MetaCubeX/mihomo">Mihomo</a> GUI</h3>

<p align="center">
  <a href="https://github.com/Kuingsmile/sparkleme/releases">
    <img src="https://img.shields.io/github/release/Kuingsmile/sparkleme/all.svg" alt="Release">
  </a>
</p>

本项目为用了各种GUI软件结果纷纷跑路后的自用开发版，fork自Sparkle，改动自用为主。

## 特性

- [x] 开箱即用，无需服务模式的 Tun
- [x] 多种配色主题可选，UI 焕然一新
- [x] 支持大部分 Mihomo 常用配置修改
- [x] 内置稳定版和预览版 Mihomo 内核
- [x] 通过 WebDAV 一键备份和恢复配置
- [x] 强大的覆写功能，任意修订配置文件
- [x] 深度集成 Sub-Store，轻松管理订阅

## 开发

### 环境要求

- **Node.js**: >= 20.0.0 (推荐使用 LTS 版本)
- **pnpm**: >= 9.0.0 (必需)
- **Git**: 最新版本

### 技术架构

SparkleMe 基于 Electron + React + TypeScript 构建

#### 前端技术栈

- **React 19** - 用户界面框架
- **TypeScript** - 类型安全的 JavaScript
- **HeroUI (NextUI)** - UI 组件库
- **Tailwind CSS** - 原子化 CSS 框架
- **Monaco Editor** - 代码编辑器

#### 后端技术栈

- **Electron** - 应用主进程
- **Mihomo Core** - 代理内核
- **sysproxy-go** - 系统代理集成

### 快速开始

1. **克隆项目**

```bash
git clone https://github.com/Kuingsmile/sparkleme.git
cd sparkleme
```

2. **安装依赖**

```bash
pnpm install
```

3. **处理 Electron 安装问题**（如果遇到 pnpm dev 等命令无法成功运行）

```bash
# 如果 Electron 没有正确安装，执行以下命令
cd node_modules/electron
node install.js
cd ../..
```

4. **启动开发服务器**

```bash
pnpm dev
```

### 注意事项

windows 开发时可能会出现页面白屏，关闭 tun（虚拟网卡）即可

### 可用脚本

#### 开发命令

- `pnpm dev` - 启动开发服务器（前端热重载，后端需要手动重启）
- `pnpm typecheck` - TypeScript 类型检查
- `pnpm typecheck:node` - 主进程类型检查
- `pnpm typecheck:web` - 渲染进程类型检查
- `pnpm lint` - 运行代码检查
- `pnpm format` - 格式化代码

#### 构建命令

- `pnpm build:win` - 构建 Windows 版本
- `pnpm build:mac` - 构建 macOS 版本
- `pnpm build:linux` - 构建 Linux 版本

#### 其他命令

- `pnpm prepare` - 准备构建环境
- `pnpm postinstall` - 安装 Electron 依赖

### 构建发布

#### 环境准备

根据目标平台准备相应的构建环境：

**Windows 构建：**

```bash
pnpm build:win
```

**macOS 构建：**

```bash
pnpm build:mac
```

**Linux 构建：**

```bash
pnpm build:linux
```

**指定架构：**

```bash
pnpm build:win --x64/--arm64
pnpm build:mac --arm64/--x64
pnpm build:linux --x64/--arm64
```

**指定产物类型：**

```bash
pnpm build:win 7z/nsis
pnpm build:linux deb/rpm/pacman
pnpm build:mac pkg/dmg
```

**指定架构和产物类型：**

```bash
pnpm build:win 7z --x64
pnpm build:mac pkg --arm64
pnpm build:linux deb --x64
```

#### 构建产物

- **Windows**: `.exe` 安装包和 `.7z` 便携版
- **macOS**: `.pkg` 安装包
- **Linux**: `.deb`、`.rpm`、`.pkg.tar.xz(pacman)` 等格式

### 许可证

GNU General Public License v3.0
