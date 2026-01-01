### Breaking Changes

- 1.5.0 之后 macOS 改用 pkg 安装方式，不再支持 dmg 安装方式，因此本次更新需要手动下载安装包进行安装
- electron33 已不再支持 macOS 10.15，故为 10.15 提供单独的安装包，需要的用户请自行下载安装，应用内更新时会自动检测系统版本，安装后后续可正常在应用内直接更新
- 1.5.1 之后 Windows 下 `productName` 改为 `Mihomo Party`, 更新后若出现找不到文件报错，手动以管理员权限运行 `Mihomo Party.exe` 即可
- 由于更改了应用名称，开机启动失效是正常现象，在设置中重新开关一下即可

### Features

- 添加出站接口查看
- 添加更多嗅探配置

### Bug Fixes

- null

### 下载地址：

#### Windows10/11：

- 安装版：[64位](https://github.com/xishang0128/sparkle/releases/download/1.7.0/sparkle-windows-1.7.0-x64-setup.exe) | [ARM64](https://github.com/xishang0128/sparkle/releases/download/1.7.0/sparkle-windows-1.7.0-arm64-setup.exe)


#### macOS 11+：

- PKG：[Intel](https://github.com/xishang0128/sparkle/releases/download/1.7.0/sparkle-macos-1.7.0-x64.pkg) | [Apple Silicon](https://github.com/xishang0128/sparkle/releases/download/1.7.0/sparkle-macos-1.7.0-arm64.pkg)


#### Linux：

- DEB：[64位](https://github.com/xishang0128/sparkle/releases/download/1.7.0/sparkle-linux-1.7.0-amd64.deb) | [ARM64](https://github.com/xishang0128/sparkle/releases/download/1.7.0/sparkle-linux-1.7.0-arm64.deb) | [loong64](https://github.com/xishang0128/sparkle/releases/download/1.7.0/sparkle-linux-1.7.0-loong64.deb) | [loong64(aosc-compatible)](https://github.com/xishang0128/sparkle/releases/download/1.7.0/sparkle-linux-1.7.0-loongarch64.deb)

- RPM：[64位](https://github.com/xishang0128/sparkle/releases/download/1.7.0/sparkle-linux-1.7.0-x86_64.rpm) | [ARM64](https://github.com/xishang0128/sparkle/releases/download/1.7.0/sparkle-linux-1.7.0-aarch64.rpm) | [loong64](https://github.com/xishang0128/sparkle/releases/download/1.7.0/sparkle-linux-1.7.0-loongarch64.rpm)

- PACMAN：[64位](https://github.com/xishang0128/sparkle/releases/download/1.7.0/sparkle-linux-1.7.0-x64.pkg.tar.xz) | [ARM64](https://github.com/xishang0128/sparkle/releases/download/1.7.0/sparkle-linux-1.7.0-aarch64.pkg.tar.xz) | [loong64](https://github.com/xishang0128/sparkle/releases/download/1.7.0/sparkle-linux-1.7.0-loong64.pkg.tar.xz)