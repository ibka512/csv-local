# CSV Local · CSV 中文乱码本地修复

一个免费、开源、零依赖的 CSV 编码转换器。文件只在浏览器本地处理，可下载离线版。

**[立即使用](https://ibka512.github.io/csv-local/)** · **[离线版](https://github.com/ibka512/csv-local/releases/latest)** · **[乱码排查指南](https://ibka512.github.io/csv-local/docs/guide.html)**

## 能做什么

- 将 UTF-8、GB18030 / GBK、Big5、UTF-16 LE/BE、Shift JIS、Windows-1252 转成 UTF-8。
- 添加 UTF-8 BOM 供 Excel 打开，或移除 BOM 供程序导入。
- 自动识别有效 UTF-8 和带 BOM 的 UTF-16；其他编码需手选并核对预览。
- 支持逗号、Tab、分号预览；导出原样保留分隔符、引号、换行。
- 预览最多 8 行 / 12 列 / 每格 200 字，导出保留全部内容。文件上限 5 MiB。

## 使用

选择 CSV / TSV / TXT → 核对原始编码和预览 → 下载转换结果。

离线使用：下载 Release 中的 ZIP，解压，直接用现代浏览器打开 `index.html`。没有安装、注册、API Key 或外部运行时依赖。

## 边界与隐私

不上传文件、不加载第三方脚本、不设 Cookie、不记录文件内容。在线版本由 GitHub Pages 托管，平台可以收到网页请求；外部链接受各平台政策约束。

不支持 XLS / XLSX。不恢复已被保存为问号的文字，不更改公式，不修复长数字截断或前导零丢失。请保留原文件，只使用可信 CSV。Excel 导入时可将编号、手机号等列指定为文本。

## 为什么做这个

[微软官方说明](https://support.microsoft.com/en-us/excel/opening-csv-utf-8-files-correctly-in-excel)介绍了 UTF-8 BOM 与 Excel 导入方式。公开项目中也有[非拉丁文字 CSV 导出乱码报告](https://github.com/payloadcms/payload/issues/13929)以及[另一类工具对 BOM 兼容性不同的报告](https://github.com/hydroshare/hydroshare/issues/6263)。本项目提供手动可核对的本地转换流程，不宣称一种编码适用于所有系统。

## English

Free, offline-capable CSV encoding converter. Convert legacy Chinese encodings (GBK/GB18030, Big5), UTF-16, Shift JIS or Windows-1252 to UTF-8, with optional BOM for Excel. Browser-only processing, no uploads, analytics, dependencies or account. CSV text is preserved; parsing is used only for a bounded preview. This does not repair lost characters, sanitize formulas or prevent spreadsheet type inference.

## 开发与验证

直接打开 `index.html`。运行核心测试：`node --test tests/core.test.cjs`（仅测试需要 Node）。

## 支持

全部功能与离线版免费，MIT 许可。如果有帮助，可[在爱发电自愿支持 ibka](https://afdian.com/a/ibklp)。赞助不会解锁额外功能，也不包含人工服务承诺。
