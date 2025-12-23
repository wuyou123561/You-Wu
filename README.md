
# 🕵️‍♂️ Digital Detective: The Tri-Lens Intelligence Suite

> **"Verification is not a score; it's a binary of trust."**
> 基于“污水理论”和红旗机制（Red Flag System）的高保真虚假信息分析终端。

---

## 🚀 教师阅卷/快速部署指南 (Submission Guide)

本程序已针对 **Google Gemini API 免费层级** 进行优化。无需支付任何费用即可运行完整功能。

### 1. 获取免费 API Key
1. 访问 [Google AI Studio](https://aistudio.google.com/)。
2. 点击左侧的 **"Get API Key"**。
3. 点击 **"Create API key in new project"**。
4. **重要**：只要不绑定信用卡开启 "Pay-as-you-go"，即默认使用免费层级（Free of charge）。

### 2. 环境配置
在项目根目录创建 `.env` 文件（或在部署平台如 Vercel 的 Environment Variables 中配置）：
```env
API_KEY=您的_GEMINI_API_KEY
```

### 3. 免费版使用限制说明 (Important)
- **频率限制 (Rate Limits)**：免费版 API 每分钟有调用次数限制（通常为 2-15 RPM）。若提示“侦探总部线路繁忙”，请等待 60 秒。
- **搜索增强**：本程序强制开启了 `Google Search Grounding`。在免费层级下，该功能依然可用，但响应速度受 Google 搜索频率限制影响。
- **隐私提醒**：Google 可能会使用免费层级的输入数据来优化模型（请勿输入敏感私人信息）。

---

## 🔍 核心逻辑：三维核查协议 (Tri-Lens Protocol)

我们不计算“平均分”，我们寻找“致命伤”：
1. **信源镜 (Source)**：核查提及的专家/机构是否真实存在，而非捏造。
2. **事实镜 (Fact)**：通过 Google 搜索进行实时在线比对，调取最新证据。
3. **逻辑镜 (Logic)**：识别情绪化语言、因果倒置等逻辑谬误。

---

## ✨ 亮点功能
- **实时语音侦听 (Live Scan)**：点击 Header 的 `LIVE SCAN`，可开启实时语音对话调查官。
- **情报踪迹 (Intelligence Trail)**：自动提取 AI 搜索时的原始网页链接，确保结果可追溯。
- **原子化拆解 (Atomization)**：将长篇报道拆解为独立的事实积木进行逐一审查。

---
**Developed for Truth Seekers**
*"Stay skeptic, stay sharp."*
