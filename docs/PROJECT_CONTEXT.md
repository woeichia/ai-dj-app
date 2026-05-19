# Project Context

## 项目定位

这是一个个人使用的中文 AI DJ 情绪音乐陪伴 PWA。它不是普通播放器，也不是 Spotify clone，而是一个能听懂用户此刻心情、用自然中文回应、再用音乐陪用户慢慢进入状态的深夜陪伴型音乐应用。

MVP 重点是验证核心体验闭环：

1. 用户用中文表达情绪。
2. AI 分析情绪和语境。
3. AI 推荐一首合适的歌。
4. AI 用中文解释为什么选这首歌。
5. AI voice 先说话。
6. AI 说话时音乐保持低音量。
7. AI 说完后音乐平滑 fade in。

## 核心语言

- App UI 使用简体中文。
- AI DJ 使用自然中文说话。
- 推荐歌曲可以是中文歌，也可以是英文歌。
- AI 必须用中文解释推荐原因。

## 产品气质

关键词：

- 温柔
- 深夜陪伴感
- calm
- emotional
- 有一点诗意
- 高级感
- cinematic
- 极简
- mobile-first

AI DJ 不应该像客服、助手、工具提示或机器人。它更像一个有分寸的深夜电台 DJ：理解用户的情绪，但不过度治疗化；能给出音乐选择，但不强行解释人生。

## 技术方向

MVP 技术方案：

- React
- TypeScript
- Vite
- Tailwind CSS
- Framer Motion
- OpenAI 负责 AI reasoning
- OpenAI TTS 负责 AI voice
- Mock songs first
- 后续再接入网易云音乐
- Web Audio API 负责 audio ducking / fade in

## Provider Architecture

项目采用可替换 Provider 架构：

- `AIProvider`: 负责情绪分析、推荐理由、DJ 文案生成。
- `VoiceProvider`: 负责把 DJ 文案转成语音。
- `MusicProvider`: 负责歌曲来源和播放资源。
- `AudioMixer`: 负责音乐、语音之间的音量关系、ducking 和 fade in。

MVP provider 映射：

- `AIProvider = OpenAI`
- `VoiceProvider = OpenAI TTS`
- `MusicProvider = Mock songs`
- `Future MusicProvider = NetEase`

## 推荐优先级

推荐时按以下优先级决策：

1. 用户情绪
2. 用户输入内容
3. 用户音乐偏好
4. 歌曲语言偏好（中文 / 英文 / 不限制）
5. 时间
6. 天气

时间和天气是后续增强维度。MVP 可以先设计接口和数据结构，不强制接入真实天气服务。

## 非目标

MVP 不做以下事情：

- 不接入真实网易云音乐 API。
- 不做完整账号系统。
- 不做社交功能。
- 不做大型曲库管理。
- 不做复杂 DJ deck、beat matching 或专业混音台。
- 不伪装已经拥有真实版权播放能力。

## 成功标准

MVP 成功的标准是：用户输入一句中文情绪表达后，App 能给出一段温柔自然的中文 DJ 旁白，推荐一首 mock 歌曲，并完成“AI 先说话、音乐低音量铺底、AI 结束后音乐渐入”的情绪体验。
