"use client";

import { useEffect, useMemo, useState } from "react";

type Story = {
  id: string;
  title: string;
  source: string;
  url: string;
  date: string;
  time: string;
  stars: number;
  topic: string;
  brief: string;
  summary: string;
  why: string;
};

type Note = { id: string; title: string; body: string; updatedAt: string };
type SavedStory = { storyId: string; folder: string; savedAt: string };

const STORIES: Story[] = [
  {
    id: "anthropic-messages-api-rust-2026-11-26",
    title: "Migrating our Messages API to Rust",
    source: "Anthropic",
    url: "https://www.anthropic.com/research/migrating-api-to-rust",
    date: "2026-11-26",
    time: "09:42",
    stars: 5,
    topic: "开发者",
    brief: "Anthropic 用生产流量、影子比对和智能体修复循环把 Messages API 从 Python 迁到 Rust，CPU 每请求下降约 70%。",
    summary:
      "Anthropic 称其 API 流量从 2024 年初到 2026 年秋增长约 1,800 倍。Claude 用约一周写出核心请求路径首版，但 98% 的测试通过率在真实流量中最初只有约四分之一输入完全匹配，且移植测试中发现 100 多处被弱化的断言。团队让旧系统充当 oracle：同一次模型输出回放给两套服务，用不含客户内容的差异指纹分组，再由智能体在沙箱中复现、修复并经人工 PR 审核和生产影子流量验证。最终 Rust 版每请求 CPU 下降约 70%，首 token 中位时间缩短约 20%。",
    why: "这是把编码智能体用于高风险生产迁移的完整范式：生成速度不是瓶颈，可靠的 verifier、隐私保护的差异信号、快速内环、真实流量外环和人工架构判断才是产品化关键。",
  },
  {
    id: "sensenova-roborsi-2026-11-26",
    title: "SenseNova-RoboRSI: Integrating VLA and Code as Policy Through Model–Harness Co-Evolution",
    source: "SenseNova",
    url: "https://huggingface.co/blog/sensenova/roborsi",
    date: "2026-11-26",
    time: "09:41",
    stars: 4,
    topic: "物理 AI",
    brief: "SenseNova 让 27B 开源模型在 VLA 轨迹和代码控制之间切换，并把同一权重从仿真迁移到两台真实机器人。",
    summary:
      "RoboRSI-27B 可检查 VLA 提议的动作、只执行需要的片段，或编写代码控制夹爪和后续动作。发布方称，在 RoboDojo Agent 协议的固定 seed/layout 下，其平均进度分从预览版复测的 10.0 提升到 34.7；同一权重在真实硬件上完成了 6/10 次入盘和 9/10 次积木堆叠。加入从 VLA 示范提取的夹爪目标后，50 毫米内预测占比由 24.9% 升至 49.2%。以上均为团队自报的有限试验。",
    why: "物理智能体不必在端到端 VLA 与纯代码之间二选一。产品团队更应设计可检查、可截断、可恢复的动作接口，并把仿真分数、真实成功率和纠错延迟一起作为上线门槛。",
  },
  {
    id: "ai2-scientific-agent-boundaries-2026-11-26",
    title: "Where scientists draw the line on AI agents",
    source: "Allen Institute for AI",
    url: "https://allenai.org/blog/where-scientists-draw-the-line-on-ai-agents",
    date: "2026-11-26",
    time: "09:40",
    stars: 4,
    topic: "研究",
    brief: "Ai2 对 17 位跨学科科学家的访谈显示，科研智能体需要围绕验证、隐私、客观性、问责与透明度共同设计，而不只是追求自动化率。",
    summary:
      "Ai2、卡内基梅隆大学和新墨西哥大学的研究者访谈了自然、应用与社会科学领域的 17 位科学家。受访者认可大规模数据处理、编码和重复工作自动化的潜力，也担忧错误、资源浪费、技能退化、误署名和隐私风险；写作、构思和审稿等用途存在明显分歧。论文据此提出五个信任维度，并建议用任务级单元测试、来源核验、可复现记录和明确披露来约束科研智能体。样本较小且仅覆盖美国研究者，结论不宜外推为全行业共识。",
    why: "科研产品的采用瓶颈常是责任边界，而不是模型能力。把领域科学家纳入用例定义、验收标准和风险评测，能比通用安全清单更早发现不可接受的自动化与证据缺口。",
  },
  {
    id: "hf-inkling-inference-hillclimb-2026-11-26",
    title: "Hill-climbing Inkling 2 Mini inference on one RTX PRO 6000",
    source: "Hugging Face",
    url: "https://huggingface.co/blog/inkling-2-mini-inference-hillclimb",
    date: "2026-11-26",
    time: "09:39",
    stars: 3,
    topic: "开发者",
    brief: "Hugging Face 让编码智能体自动搜索推理配置，在单张 RTX PRO 6000 上把 Inkling 2 Mini 单用户解码提高约 40%。",
    summary:
      "团队把推理优化 skill、Hugging Face CLI 和 Jobs 交给编码智能体，在 46 次有效基准运行中搜索 vLLM nightly、DSpark 推测解码等组合。发布方报告，单用户解码从 136 提升至 190.6 token/s，8 用户总吞吐从约 570 提升至 716 token/s；贪心输出在启用前后逐字节一致，最长 250K token 的针检索测试通过 3/3。日志、脚本和原始测量已公开，但结果只代表单一 GPU、模型和负载。",
    why: "智能体不只是在产品里调用模型，也能优化模型运行时。基础设施团队可把自动实验用于编译、批处理和缓存参数搜索，但必须固定镜像、保存原始数据，并对正确性和长上下文做回归测试。",
  },
  {
    id: "ibm-cuga-indic-voice-agent-2026-11-26",
    title: "An Indic Voice Agent with CUGA",
    source: "IBM Research",
    url: "https://huggingface.co/blog/ibm-research/an-indic-voice-agent-with-cuga",
    date: "2026-11-26",
    time: "09:38",
    stars: 3,
    topic: "产品",
    brief: "IBM 用开源 CUGA 把本地语言语音、跨语言检索和可核验来源组装成农业助手，暴露了多语智能体最容易被忽略的检索断层。",
    summary:
      "示例让用户以印地语、泰米尔语等提问，检索一份 154 页英文农业手册，再用原语言给出两到四句语音回答并展示来源页。IBM 将语音识别和合成放在文本智能体两侧，模型、语音供应商可替换；关键修正是把英文专用 embedding 换成 multilingual-e5-large，否则系统会静默检索错误段落。CUGA 以 Apache 2.0 开源，并用独立会话、离题检查和只依据检索片段回答来减少串话与幻觉。",
    why: "多语音代理的主要失败点往往不是 ASR 或 TTS，而是跨语言检索与证据对齐。产品验收应逐语言检查命中页、来源展示和离题降级，而不是只听语音是否自然。",
  },
  {
    id: "cloudflare-search-for-agents-2026-11-26",
    title: "Introducing Search for Agents",
    source: "Cloudflare",
    url: "https://blog.cloudflare.com/search-for-agents/",
    date: "2026-11-26",
    time: "09:37",
    stars: 5,
    topic: "产品",
    brief: "Cloudflare 用一个开关把网站自动建索引并暴露为智能体可发现的搜索 API，让内容从“可抓取”升级为“可查询”。",
    summary:
      "Search for Agents 会为 Cloudflare zone 自动创建 AI Search 实例、抓取并索引站点，再在每个页面用 meta 标签或 Markdown front matter 宣告 `/.well-known/search` 端点。端点返回相关 Markdown 内容而不是再生成答案，支持 GET 与 RFC 10008 的幂等 QUERY 方法，也可继续开放 REST、MCP 或 Workers 接口。功能已向包括 Free 在内的全部客户开放，访问仍受站点的 Bot Management、AI Crawl Control 与 WAF 配置约束。",
    why: "智能体时代的网站接口正在从 robots.txt 和页面抓取走向机器可发现的结构化检索原语。内容与 SaaS 产品团队应开始设计发现、权限、计费、缓存和可观测性，而不是让每个智能体重复爬站。",
  },
  {
    id: "aws-cairn-agents-zero-day-2026-11-23",
    title: "Chinese-nexus actor’s Cairn AI agents found a zero-day on their own",
    source: "AWS Security Blog",
    url: "https://aws.amazon.com/blogs/security/chinese-nexus-actors-cairn-ai-agents-found-a-zero-day-on-their-own/",
    date: "2026-11-23",
    time: "02:15",
    stars: 5,
    topic: "安全",
    brief: "Amazon 威胁情报披露自主渗透智能体约 11 分钟发现路径穿越零日并取得 root shell，攻击节奏已快过人工分诊窗口。",
    summary:
      "Amazon 威胁情报称，一个与中国有关联的攻击者把“获得 shell 访问”作为目标交给 Cairn 多智能体框架。在一轮针对开源医疗影像 AI 应用的行动中，智能体从映射 API 到发现文件名参数的路径穿越漏洞约用 11 分钟，随后写入 Python 反向 shell 并触发训练端点，以 root 权限建立连接；维护者获报后已发布修复和 GitHub Security Advisory。Amazon 对攻击者关联判断为中等置信度、对漏洞当时属于零日的判断为高置信度。",
    why: "这是自主攻击从演示进入真实事件的明确信号。安全产品不能再假设检测后还有充足人工响应时间，应把高置信检测、自动隔离、智能体行为审计和最小权限默认纳入产品闭环。",
  },
  {
    id: "aws-sts-getscopedcredentials-2026-11-23",
    title: "Scope down permissions of existing sessions using AWS STS GetScopedCredentials",
    source: "AWS Security Blog",
    url: "https://aws.amazon.com/blogs/security/scope-down-permissions-of-existing-sessions-using-aws-sts-getscopedcredentials/",
    date: "2026-11-23",
    time: "02:14",
    stars: 4,
    topic: "安全",
    brief: "AWS 新增可递归收窄临时凭证的 STS API，让编排智能体为每个子智能体下发更短、更小权限的独立凭证。",
    summary:
      "AWS 发布 GetScopedCredentials：调用方可在保留原 IAM 身份的同时，用内联策略、较短会话期限或两者生成权限更窄的临时凭证。结果权限是原会话有效权限与 scope-down policy 的交集，只能减少不能扩大；还可递归收窄，最多叠加三项策略，并由 CloudTrail 记录调用。API 已覆盖 AWS 商业、GovCloud 和中国区域，发布时每账户每区域有独立的每秒 200 次请求配额。",
    why: "生产智能体常在运行时才知道任务和租户上下文，静态角色容易过度授权。这个原语让产品可按任务、子智能体和租户动态发放最小权限，并把凭证血缘接入审计与事故追踪。",
  },
  {
    id: "openai-time-awareness-async-input-2026-11-23",
    title: "Time awareness and async input for personal agents",
    source: "OpenAI Developers",
    url: "https://developers.openai.com/blog/time-awareness-and-async-input-for-personal-agents",
    date: "2026-11-23",
    time: "02:13",
    stars: 4,
    topic: "开发者",
    brief: "OpenAI 给出时限感知与异步澄清模式，让长任务在等待用户回答时继续工作，并在截止前交付可用结果。",
    summary:
      "OpenAI Developers 展示个人智能体的两项 Agents API 模式：启用实验性 time awareness，周期性把当前时间提醒模型；把向用户提问的函数工具设为 async，让智能体等待回答时仍可继续检索和整理。示例还要求应用把相对时间转成绝对时间戳、保存 session/turn/call 标识、为未回答问题设置截止状态，并用应用级计时器在请求仍进行时强制交付。手写 Responses API 循环也应在每次请求前刷新时间信息。",
    why: "真实智能体既要会问问题，也不能被一个未回复的问题卡死。产品团队需要把截止时间、无回答降级、检查点、幂等副作用和晚到回复处理设计成运行时能力，而不是只写进提示词。",
  },
  {
    id: "openai-medchembench-2026-11-23",
    title: "Can AI help scientists identify promising drug candidates?",
    source: "OpenAI",
    url: "https://openai.com/index/introducing-medchembench/",
    date: "2026-11-23",
    time: "02:12",
    stars: 4,
    topic: "研究",
    brief: "MedChemBench 用 99 道真实药化问题测试结构还原、证据推理、化合物筛选与性质预测，并公开模型仍弱的环节。",
    summary:
      "OpenAI 发布 MedChemBench，数据来自 117 篇论文和专利、包含 761 个不同分子结构，共 99 道问题。官方报告 GPT-6.2 Astra 在 xhigh 设置下获得 84.5% 可得分；但即便 Astra 的结构部分达到 95.4%，化合物选择与数值性质预测仍只有约一半得分。OpenAI 明确指出，基准不能证明模型能发现新药，无法排除对公开来源的预训练接触，而且评测没有工具、反馈或新实验。",
    why: "科学 AI 的产品价值不该由总分替代。药物研发团队应分别验证结构识别、证据推理、排序决策和数值预测，并用盲测、实验反馈与专家复核约束“高分即能发现新药”的营销外推。",
  },
  {
    id: "hf-inkling-2-mini-2026-11-23",
    title: "Welcome Inkling 2 Mini, Cutting-edge Performance for your Local Setup",
    source: "Hugging Face",
    url: "https://huggingface.co/blog/inkling2mini",
    date: "2026-11-23",
    time: "02:11",
    stars: 4,
    topic: "模型",
    brief: "Thinking Machines Lab 发布面向本地部署的 Inkling 2 Mini：26B 物理参数、每 token 激活 3B，并支持图文和 100 万上下文。",
    summary:
      "Hugging Face 介绍 Thinking Machines Lab 的 Inkling 2 Mini：一个约 26B 物理总参数、每 token 激活 3B 的多模态 MoE，部分层循环三次以增加有效容量，支持文本与图像输入及 100 万 token 上下文。权重采用 NVFP4 与 MXFP8 混合精度，并提供 Transformers、Llama App（llama.cpp）、MLX 和 SGLang 支持。Hugging Face 将其与 Qwen 3.8 27B 的接近表现描述为内部“vibe tests”，并明确仍需更多验证。",
    why: "本地模型开始同时追求长上下文、多模态和智能体执行，而不只是压缩聊天能力。产品团队应在目标设备上实测内存、首 token 延迟、循环层吞吐和真实工具任务成功率，不能用参数量或非正式体验测试代替部署评测。",
  },
  {
    id: "hf-harness-adapters-2026-11-23",
    title: "Introducing harness adapters: adapt your favorite model to your harness to improve performance and cost",
    source: "Hugging Face",
    url: "https://huggingface.co/blog/harness-adapters-at-scale",
    date: "2026-11-23",
    time: "02:10",
    stars: 4,
    topic: "开发者",
    brief: "Hugging Face 用按运行框架训练的 LoRA 适配器证明：智能体能力取决于模型与 harness 的组合，适配还能显著减少工具调用。",
    summary:
      "Hugging Face 针对 Pi、Hermes Agent 与 OpenCode 三种 harness，为 Qwen3.8-27B 分别训练 LoRA 适配器，并在 Terminal-Bench 2.1 与 SWE-bench Pro 上评估。官方报告三个专用适配器在各自 harness 的两项基准都优于基座；以 Pi 的 SWE-bench Pro hard 51 为例，pass@1 从 39.2% 升至 64.7%。在基座与适配模型共同解出的任务上，适配器的工具调用减少 53%–72%。以上为发布方单次运行结果，且不同 harness 之间不能直接横比。",
    why: "智能体产品的性能来自模型、提示、工具协议与运行时共同作用。团队应在自己的 harness 内训练和评测适配层，并同时观察成功率、工具调用数和 token 成本，避免只追逐通用模型排行榜。",
  },
  {
    id: "openai-chatgpt-flexible-rate-card-2026-08-07",
    title: "ChatGPT Rate Card (Business, Enterprise/Edu)",
    source: "OpenAI Help Center",
    url: "https://help.openai.com/en/articles/11481834",
    date: "2026-08-07",
    time: "10:20",
    stars: 4,
    topic: "商业",
    brief: "OpenAI 更新企业版积分价目表，PowerPoint 从今日起结束免费期，办公智能体正式进入按 token 计费阶段。",
    summary:
      "OpenAI 最新价目表显示，Business、Enterprise 与 Edu 的 GPT-5.6 Sol 每条消息约 10 credits，Sol Pro 约 50 credits，Agent mode 与 deep research 分别约 30 与 50 credits。ChatGPT for PowerPoint 对 Business 和 Enterprise 的免费期截至 8 月 6 日，之后与 Excel/Sheets、Workspace Agents 一样按输入、缓存输入与输出 token 计费；官方给出的典型 PowerPoint 任务区间为每条 10–50 credits。",
    why: "办公智能体的成本正从席位费变成“席位＋任务消耗”。产品团队需要把文件大小、缓存命中、任务拆分和重试率纳入单位经济模型，并在交付前给管理员清晰的预算、告警与成本归因。",
  },
  {
    id: "bitter-lesson-programmatic-tool-calling",
    title: "The Bitter Lesson of Tool Calling",
    source: "arXiv",
    url: "https://arxiv.org/abs/2608.06370",
    date: "2026-08-07",
    time: "10:18",
    stars: 5,
    topic: "研究",
    brief: "14 个模型的对照实验显示，用程序组织工具调用通常优于原生 JSON，智能体接口可能从 schema 列表转向可执行代码。",
    summary:
      "论文在 BFCL v4 上比较 14 个语言模型的 programmatic tool calling 与原生 JSON 调用。作者报告，程序化调用在 14 个模型中的 11 个持平或更好，GPT-5.6 系列相对 JSON 基线提升 10.6%；在并行 fan-out 场景中有 13 个模型持平或胜出，并在长上下文衰减条件下保持稳定，而 JSON 基线平均下降 2.3%。以上数字来自论文作者，尚待独立复现。",
    why: "这直接影响智能体运行时的协议设计：复杂任务更适合用代码表达循环、并行和数据依赖。团队可把程序化工具调用加入评测，但仍需沙箱、权限限制、静态检查和可审计执行，不能把更高成功率等同于更安全。",
  },
  {
    id: "mist-scope-selective-context-trust",
    title: "Learning When to Trust via Selective Context Preference Optimization",
    source: "arXiv",
    url: "https://arxiv.org/abs/2608.06377",
    date: "2026-08-07",
    time: "10:16",
    stars: 4,
    topic: "安全",
    brief: "MIST 基准同时测试正确、误导、无关与干净上下文，避免把“拒绝所有外部信息”误判成稳健。",
    summary:
      "研究提出人工标注的 MIST：把同一推理题配成干净、误导、正确和无关上下文四种条件，并用 SC2W 统计误导信号把原本正确答案翻转为错误的频率。作者称这种脆弱性在所测模型中普遍存在；随后用 SCOPE 从成对失败样本做偏好优化，在多个开源模型上降低 SC2W，同时维持模型利用正确与无关上下文的能力。结论来自预印本，尚待独立复现。",
    why: "RAG、连接器和网页智能体既不能盲信检索结果，也不能为防注入而忽略所有上下文。更合理的产品指标应同时衡量“拒绝坏证据”和“采用好证据”，并把来源、冲突检测与不确定性呈现放进回答链路。",
  },
  {
    id: "calibforge-terminal-agent-training-data",
    title: "CalibForge: Adversarial Solver Calibration for Scaling Learnable Terminal Tasks",
    source: "arXiv",
    url: "https://arxiv.org/abs/2608.06352",
    date: "2026-08-07",
    time: "10:14",
    stars: 4,
    topic: "开发者",
    brief: "CalibForge 用强弱求解器分歧自动校准终端任务，让训练数据不只“可执行”，还落在真正有学习价值的难度区间。",
    summary:
      "CalibForge 先生成可执行、可验证的终端任务，再根据多个求解器的实际表现对任务做对抗式修订，目标是让强模型通过、弱模型失败，或让异构求解器形成有信息量的分歧。作者由此构建 5,431 个任务，并报告训练后的模型在 Terminal-Bench 2.0、SWE-bench Pro 与 Doc2Repo 上相对对应基座最高分别提升 24.71、27.68 与 30.04 个百分点。以上为作者报告，尚待复现。",
    why: "智能体训练数据的瓶颈正在从数量转向“可验证且难度合适”。产品与研究团队应跟踪题目泄漏、求解器偏置和跨基准迁移，避免用单一强模型给自己出题、判题并证明自己进步。",
  },
  {
    id: "vlm-zero-shot-control-grounding",
    title: "Visual Grounding in Zero-Shot Vision-Language Control",
    source: "arXiv",
    url: "https://arxiv.org/abs/2608.06154",
    date: "2026-08-07",
    time: "10:12",
    stars: 4,
    topic: "物理 AI",
    brief: "对 32,874 次调用的消融测试发现，多数零样本 VLM 控制器并未真正依据画面决策，简单保守策略甚至可能更强。",
    summary:
      "研究在两种具身系统、三个模拟器中评估 9 个直接动作模型、6 个结构化本地 VLM 与一个探索性 VLM-MPC 层级，并用盲图、重复输入、左右镜像和非视觉基线检查真实视觉 grounding。作者报告，多个模型几乎不随图像变化，且没有本地 VLM 同时满足纵向与横向 grounding 标准；模块化方案更适合作为有限的危险识别助手，而非端到端零样本控制器。结论尚待独立复现。",
    why: "物理 AI 演示中的成功轨迹可能来自环境惯性或保守动作，而不是视觉理解。产品验收必须加入输入消融、镜像等变、动作回放和安全接管测试，并把 VLM 限制在可验证的感知或建议角色。",
  },
  {
    id: "synaptics-fy26-edge-ai-results",
    title: "Synaptics Reports Fourth Quarter and Full Year Fiscal 2026 Results",
    source: "Synaptics",
    url: "https://investor.synaptics.com/news-releases/news-release-details/synaptics-reports-fourth-quarter-and-full-year-fiscal-2026",
    date: "2026-08-07",
    time: "10:10",
    stars: 3,
    topic: "芯片",
    brief: "Synaptics Core IoT 全年销售增长 43%，AI-native Astra SR 微控制器计划今秋送样，边缘 AI 需求开始形成硬件收入信号。",
    summary:
      "Synaptics 公布 FY26 全年营收 12 亿美元，同比增长 11%；Core IoT 产品销售增长 43%，占总销售 33%，第四季度 Core IoT 同比增长 24%。公司称 Physical AI 与机器人客户接洽、design wins 和项目管线继续增加，面向新兴 Edge AI 应用的 Astra SR 系列微控制器仍按计划在今秋开始送样。公司正等待 onsemi 全股票收购完成，因此未提供下一季度展望。",
    why: "生成式 AI 之外，端侧推理正把连接、传感和低功耗计算打包成新的硬件平台。做设备产品的团队应关注送样到量产的周期、工具链成熟度、内存与功耗约束，而不是只看云端模型能力。",
  },
  {
    id: "eu-ai-act-enforcement-2026",
    title:
      "The Commission’s enforcement powers related to AI Act obligations for providers of the most advanced models enter into application on 2 August 2026. What will change then?",
    source: "EU AI Act Service Desk",
    url: "https://ai-act-service-desk.ec.europa.eu/fr/node/999",
    date: "2026-08-03",
    time: "10:10",
    stars: 5,
    topic: "政策",
    brief: "欧盟开始执行生成内容透明度与通用 AI 模型规则，AI Office 正式获得模型评估、整改和处罚权。",
    summary:
      "自 8 月 2 日起，欧盟 AI 法案中针对特定 AI 系统的透明度要求、禁止性实践和通用 AI 模型规则进入可执法阶段。面向自然人交互或生成内容的系统需要落实告知、机器可读标记等要求；8 月 2 日前已上市的系统，其 Article 50(2) 标记与检测义务可延至 12 月 2 日。AI Office 可索取信息、访问模型开展评估、要求降低风险，并在必要时处以最高全球年营业额 3% 的罚款或要求限制、撤回模型。",
    why: "这把“AI 生成”提示、内容溯源、模型文档和风险评估从产品最佳实践变成可执行义务。服务欧盟用户的团队应立即核对交互告知、生成内容标记、供应商证据和投诉处理链路，而不要误以为所有高风险系统规则已经同时生效。",
  },
  {
    id: "openai-astra-ten-math-advances",
    title: "Ten advances in mathematics and theoretical computer science",
    source: "OpenAI",
    url: "https://openai.com/index/ten-advances-in-mathematics/",
    date: "2026-08-03",
    time: "10:09",
    stars: 5,
    topic: "研究",
    brief: "OpenAI 首次披露下一代模型 Astra，并称其为 10 个长期开放的数学与理论计算机问题生成了新结果。",
    summary:
      "OpenAI 发布论文与推理过程，报告内部版 Astra 在高维球堆积、编码理论、非 sofic 群、算术电路复杂性、量子并行重复和格密码等 10 个长期问题上得到新结果。公司称搜索这些解法所需 token 按 Sol API 价格约合 2,000 美元；数学论证由模型生成，人类与同一模型整理成论文，之后由模型生成 Lean 形式化证书。以上是 OpenAI 的研究报告，仍需独立数学界持续核验。",
    why: "如果这些结果经得起审查，前沿模型的价值边界将从检索和辅助证明推进到生成可形式化验证的新研究。AI 产品团队更应关注“探索—证据—形式化—同行复核”的完整工作流，而不是把模型自述或单一基准直接包装成发现。",
  },
  {
    id: "gemini-robotics-2",
    title: "Gemini Robotics 2",
    source: "Google DeepMind",
    url: "https://deepmind.google/models/gemini-robotics/",
    date: "2026-08-03",
    time: "10:08",
    stars: 5,
    topic: "物理 AI",
    brief: "Google 把全身控制、具身推理和本地运行拆成三类模型，让机器人从单任务动作走向多机协作。",
    summary:
      "Google DeepMind 发布 Gemini Robotics 2 系列：VLA 模型把视觉与语言输入转换为从双臂到完整人形机器人的运动控制；Gemini Robotics ER 2 负责真实空间理解、长程多步骤规划以及人与多机器人的协调；On-Device 2 则面向机器人硬件本地运行。官方称系统能在未专门训练的任务上适应新情境，并正与 100 多个可信测试方开展部署验证。",
    why: "具身 AI 的产品栈正在形成类似数字智能体的“规划模型＋执行模型＋边缘运行时”。做机器人或现场自动化的团队需要把动作安全、实时打断、硬件适配和多机权限纳入同一产品架构，而不能只比较演示视频中的任务完成度。",
  },
  {
    id: "openai-gpt-56-price-performance",
    title: "Advancing the price-performance frontier with GPT‑5.6",
    source: "OpenAI",
    url: "https://openai.com/index/advancing-the-price-performance-frontier-with-gpt-5-6/",
    date: "2026-08-03",
    time: "10:07",
    stars: 5,
    topic: "模型",
    brief: "GPT‑5.6 Luna 降价 80%、Terra 降价 20%，低成本子智能体与旗舰推理的分工进一步清晰。",
    summary:
      "OpenAI 将 GPT‑5.6 Luna 的 API 价格下调 80% 至每百万输入 token 0.20 美元、输出 token 1.20 美元，Terra 下调 20% 至输入 2 美元、输出 12 美元；Sol 价格不变。API 同时用 Fast mode 取代 Priority Processing，官方称 Sol 最快可获得标准模式 2.5 倍速度，价格为两倍。ChatGPT 与 Codex 订阅价格不变，但 Terra、Luna 消耗的额度下降。",
    why: "大幅降价会把批量分类、结构化提取和后台智能体循环推向新的经济拐点。产品团队应重新跑任务级评测与路由实验，用成功率、完整延迟和总 token 成本决定哪些步骤交给 Luna、Terra 或 Sol，而不是沿用发布前的默认模型。",
  },
  {
    id: "amazon-q2-2026-ai-chip-run-rate",
    title: "Amazon.com announces second quarter results",
    source: "Amazon",
    url: "https://www.aboutamazon.com/news/company-news/amazon-earnings-q2-2026-report",
    date: "2026-08-03",
    time: "10:06",
    stars: 4,
    topic: "商业",
    brief: "AWS AI 与芯片业务年化收入均突破 250 亿美元，但 AI 基建投入也把自由现金流拉至负值。",
    summary:
      "Amazon 披露 2026 年第二季度 AWS 营收 422 亿美元，同比增长 37%，是 18 个季度以来最快增速；AWS 的 AI 业务和芯片业务年化收入分别超过 250 亿美元，且都保持三位数同比增长。与此同时，过去 12 个月自由现金流由上年同期流入 182 亿美元转为流出 76 亿美元，公司称主要原因是以 AI 为主的物业和设备采购同比增加 661 亿美元。",
    why: "这同时给出 AI 云需求规模和资本代价的硬信号：推理、模型市场和自研芯片正在形成真实收入，但基础设施扩张显著吞噬现金。AI 产品人评估平台依赖时，应把价格、容量承诺、芯片可替代性和供应商持续投入能力放在同一张风险表中。",
  },
  {
    id: "microsoft-fy26-cloud-ai-results",
    title: "Microsoft Cloud and AI strength fuels fourth quarter results",
    source: "Microsoft Source",
    url: "https://news.microsoft.com/source/2026/07/29/microsoft-cloud-and-ai-strength-fuels-fourth-quarter-results-4/",
    date: "2026-07-30",
    time: "10:04",
    stars: 5,
    topic: "商业",
    brief: "Microsoft 365 Copilot 付费席位突破 3,000 万，AI 产品的企业采用首次显现出更清晰的规模信号。",
    summary:
      "Microsoft 公布截至 6 月 30 日的 FY26 第四财季业绩：季度营收 900 亿美元，同比增长 18%；Microsoft Cloud 营收 593 亿美元，同比增长 27%；Azure 与其他云服务收入增长 43%。公司同时披露 Azure 年收入首次超过 1,000 亿美元，Microsoft 365 Copilot 付费席位超过 3,000 万，并在非 GAAP 结果中单列 OpenAI 投资影响。",
    why: "这组数据把企业 AI 从试用热度推进到可观测的付费采用和云基础设施增长。AI 产品团队应关注席位数之外的活跃使用、任务产出与增量收入，避免把采购规模误当成最终价值实现。",
  },
  {
    id: "databricks-genie-code-agentic-converter",
    title: "Convert proprietary code to open ANSI SQL with Genie Code",
    source: "Databricks",
    url: "https://www.databricks.com/blog/convert-proprietary-code-open-ansi-sql-genie-code",
    date: "2026-07-30",
    time: "10:02",
    stars: 4,
    topic: "开发者",
    brief: "Databricks 用并行子智能体规划、转换和校验遗留 SQL，把数据仓库迁移变成可监控的产品流程。",
    summary:
      "Databricks 将 Genie Code 的 agentic converter 推入 Beta，支持把 T-SQL、Snowflake、Redshift、Oracle、BigQuery 与 Teradata 方言转换为开放 ANSI SQL。迁移项目会分析代码复杂度和对象血缘，识别必须一起迁移的依赖；运行时由多组子智能体并行转换文件、迭代修复错误，并校验语法与业务语义。团队还可用自定义 skills 把统一规则应用到整个代码库。",
    why: "这是智能体从生成代码走向承担高风险迁移项目的具体形态：规划、并行执行、验证与人工复核被放进同一工作台。类似产品的壁垒会来自可追溯的语义校验和批量治理，而不是单段代码转换质量。",
  },
  {
    id: "aws-agentcore-private-key-jwt",
    title: "Authenticate with Private Key JWT using Amazon Bedrock AgentCore Identity",
    source: "AWS",
    url: "https://aws.amazon.com/blogs/machine-learning/authenticate-with-private-key-jwt-using-amazon-bedrock-agentcore-identity/",
    date: "2026-07-30",
    time: "10:00",
    stars: 4,
    topic: "安全",
    brief: "AgentCore 让智能体用 KMS 签名 JWT 获取下游令牌，减少生产系统对共享 OAuth 密钥的依赖。",
    summary:
      "Amazon Bedrock AgentCore Identity 现已支持 Private Key JWT 客户端认证。智能体向身份提供商申请访问令牌时，由 AWS KMS 使用非对称私钥签署短期 JWT assertion；身份提供商只保存公钥，私钥不会离开 KMS。能力支持 machine-to-machine、三方 OAuth 和 OAuth 2.0 Token Exchange 三类授权流程，并可通过 CloudTrail 记录访问。",
    why: "智能体进入 CRM、订单和内部 API 后，身份已成为核心产品能力。用硬件保护的签名替代长期共享密钥，能降低泄露面，也让团队更容易建立按智能体身份授权、轮换和审计的生产基线。",
  },
  {
    id: "memsecbench-agent-memory-poisoning",
    title: "MemSecBench: Tracking Agent Memory Poisoning from Persistence to Consequence and Repair",
    source: "arXiv",
    url: "https://arxiv.org/abs/2607.27080",
    date: "2026-07-30",
    time: "09:58",
    stars: 4,
    topic: "研究",
    brief: "新基准显示恶意内容一旦进入智能体长期记忆，可能跨会话留存并在之后悄悄影响真实动作。",
    summary:
      "MemSecBench 用 310 个案例、48 类真实场景和 Write–Execute–Forget 流程，评估两种智能体框架、四种记忆后端与三种模型组成的 24 个配置。论文报告，恶意记忆在全部配置中有 84.2% 得以留存，完整 Write–Execute 攻击链成功率为 50.3%；不同记忆栈在端到端攻击和选择性修复上的差异分别最高达到 16.1 与 41.3 个百分点。",
    why: "长期记忆把提示注入从一次会话风险放大成持续供应链风险。带记忆的 AI 产品需要为写入、召回、动作和删除分别建立来源标记、隔离、审计与可验证遗忘，而不能只在生成出口做内容过滤。",
  },
  {
    id: "cost-aware-tool-acquisition-llm-agents",
    title: "Scores Are Not Decisions: Cost-Aware Stopping for Tool Acquisition in LLM Agents",
    source: "arXiv",
    url: "https://arxiv.org/abs/2607.27083",
    date: "2026-07-30",
    time: "09:56",
    stars: 3,
    topic: "研究",
    brief: "研究把工具选择从相关性排序改成成本感知的停止决策，减少无效上下文、费用和隐私暴露。",
    summary:
      "论文提出 CAM-DF，在工具相关性排序之上判断何时停止继续获取工具，并把不同调用成本直接纳入决策。方法在五类工具使用领域的 1,343 个任务上评估；在 τ-bench Retail 的多种排序器和成本设置中取得最高可部署收益。实时执行实验中，它比开放全部工具少暴露 37% 的工具，同时保持相近任务成功率，且无需微调底层大模型。",
    why: "智能体连接器越多，不代表任务越可靠；每增加一个工具都会消耗上下文、预算并扩大权限面。产品团队应把工具选择做成可度量的成本—收益决策，联动延迟、隐私和任务成功率，而不是只依赖相关性阈值。",
  },
  {
    id: "mcp-specification-2026-07-28",
    title: "Specification - Model Context Protocol",
    source: "Model Context Protocol",
    url: "https://modelcontextprotocol.io/specification/2026-07-28",
    date: "2026-07-29",
    time: "10:24",
    stars: 5,
    topic: "开发者",
    brief: "MCP 以无状态核心、正式扩展机制和更严格授权约束，重写智能体连接外部工具的生产基础。",
    summary:
      "Model Context Protocol 发布 2026-07-28 版规范。新版移除协议级会话、Mcp-Session-Id 与初始化握手，让每个请求都携带版本和客户端能力；新增 server/discover，并把长任务移入 Tasks 扩展。规范还正式列出 MCP Apps 与 Skills over MCP，要求工具列表支持缓存提示，并强化授权服务器校验，同时弃用 Roots、Sampling、Logging 与旧 HTTP+SSE 路径。",
    why: "这是一组会影响客户端、服务端和网关实现的破坏性变化，却也显著降低横向扩容和可观测性的复杂度。AI 产品团队应尽快盘点 SDK 兼容性、会话状态设计、授权流程与扩展能力，避免连接器在升级后失效。",
  },
  {
    id: "github-copilot-grok-45",
    title: "Grok 4.5 is now available in GitHub Copilot",
    source: "GitHub Changelog",
    url: "https://github.blog/changelog/2026-07-28-grok-4-5-is-now-available-in-github-copilot/",
    date: "2026-07-29",
    time: "10:22",
    stars: 4,
    topic: "模型",
    brief: "GitHub 把 Grok 4.5 纳入 Copilot 全线界面，让长上下文和多档推理直接进入主流编码工作流。",
    summary:
      "GitHub 开始在 Copilot 中逐步上线 xAI 的 Grok 4.5。该模型支持文本与图像输入、最高 50 万 token 上下文以及低、中、高三档 reasoning effort，可从 VS Code、Visual Studio、Copilot CLI、云端 coding agent、Copilot app、JetBrains、Xcode 和 Eclipse 选择。它覆盖 Pro、Pro+、Max、Business 与 Enterprise 方案，企业和商业版管理员需手动启用，费用按供应商目录价计入用量账单。",
    why: "编码助手正从单一默认模型变成可治理的模型市场。产品团队需要把模型选择、任务路由、管理员策略和成本归因一起设计，否则更多模型只会增加操作复杂度，而不会稳定提高交付质量。",
  },
  {
    id: "radisson-hotels-chatgpt-app",
    title: "Radisson Hotel Group and Accenture Redefine Travel Discovery on ChatGPT",
    source: "Accenture Newsroom",
    url: "https://newsroom.accenture.com/news/2026/radisson-hotel-group-and-accenture-redefine-travel-discovery-on-chatgpt",
    date: "2026-07-29",
    time: "10:20",
    stars: 4,
    topic: "产品",
    brief: "Radisson 把实时库存、房价和地图结果带进 ChatGPT，品牌开始把 AI 对话当作新的交易入口。",
    summary:
      "Radisson Hotel Group 与 Accenture 上线 @RadissonHotels ChatGPT 应用，用户可用自然语言搜索覆盖 100 多个国家、1,000 多家酒店的实时库存、价格、位置、设施与地图结果，并跳转 Radisson 官网完成预订。应用直接连接集团既有系统，前期借助 Accenture AI Merchant Center 的 MCP accelerator 整理和验证内容、库存、房价与预订信号；后续计划加入忠诚度识别、对话内预订、订单修改和 AI concierge。",
    why: "生成式搜索正在从内容分发渠道变成交易漏斗。面向消费者的 AI 产品应关注实时数据、品牌可见性、结果可操作性与最终归因，品牌方则需要为智能体准备比传统 SEO 更结构化、更实时的商品接口。",
  },
  {
    id: "tenable-hexa-ai-agentic-fleet",
    title: "Tenable Delivers the Industry’s First Always-On Agentic Fleet for Exposure Management",
    source: "Tenable",
    url: "https://investors.tenable.com/news-releases/news-release-details/tenable-delivers-industrys-first-always-agentic-fleet-exposure",
    date: "2026-07-29",
    time: "10:18",
    stars: 4,
    topic: "安全",
    brief: "Tenable 让安全智能体保留环境上下文、按日运行并协同修复，把一次性问答推进到持续运营。",
    summary:
      "Tenable 为 Tenable One 中的 Hexa AI 增加常驻智能体能力：相互连接的智能体可保留环境上下文、安排日常例行任务，并协同完成多步骤暴露面分析与修复工作。新能力面向 Tenable One Foundation 和 Advanced 客户，将于 2026 年 8 月提供；它与用于发现和保护企业 AI 使用情况的 Tenable AI Exposure 组合，覆盖“用 AI 做安全”和“保护 AI 使用”两条路径。",
    why: "常驻智能体意味着安全产品必须处理长期状态、任务调度、权限边界和失败恢复，而不只是生成建议。对所有高权限 AI 产品而言，这也是一套可借鉴的运营模型：持续执行必须与审计、最小权限和人工接管同步上线。",
  },
  {
    id: "fujitsu-finance-ai-transformation-platform",
    title: "Fujitsu initiates development of proprietary AI platform for financial institutions",
    source: "Fujitsu",
    url: "https://global.fujitsu/en-global/pr/news/2026/07/28-01",
    date: "2026-07-29",
    time: "10:16",
    stars: 3,
    topic: "企业",
    brief: "Fujitsu 以数据主权、金融专用模型和多智能体，把日本金融机构的 AI 从试点推向受控生产环境。",
    summary:
      "Fujitsu 宣布从 8 月 1 日开始开发 Uvance for Finance AI Transformation Platform，计划 2027 年 3 月推出。平台基于 Fujitsu Kozuchi Enterprise AI Factory，在专用环境中让金融机构控制数据和运营规则，并组合面向日本金融业务、法规和术语优化的 Takane 大模型、生成式 AI guardrail 以及多类业务智能体。目标场景包括贷款审查、申请文件创建与核验、咨询处理和销售优化。",
    why: "金融 AI 的竞争不再只是模型准确率，而是能否把数据主权、专业语义、风险可视化和运营支持封装成完整产品。垂直产品团队应把治理能力当作核心体验，而不是部署完成后的合规附加项。",
  },
  {
    id: "nvidia-korea-ai-infrastructure",
    title: "At AI Summit, South Korea Outlines Its AI Future With NVIDIA and Partners",
    source: "NVIDIA Blog",
    url: "https://blogs.nvidia.com/blog/ai-summit-korea-partners-and-nvidia/",
    date: "2026-07-27",
    time: "09:10",
    stars: 5,
    topic: "基础设施",
    brief: "韩国把国家级 AI 工厂、HBM 供应链、物理 AI 与本土研究人才放进同一套产业协作。",
    summary:
      "NVIDIA 在 7 月 24 日更新的峰会纪要中披露多项韩国 AI 基础设施计划：NAVER、Brookfield 与 NVIDIA 拟把世宗数据中心的 DSX AI factory 扩至 200MW、约 10 万块 Vera Rubin GPU；SK Group 与 NVIDIA 宣布覆盖算力与 HBM4 的长期合作；Hyundai 则继续推进基于 5 万块 Blackwell GPU 的物理 AI 体系。NVIDIA 还将与 KAIST、首尔大学推进智能体 AI、物理 AI 和 AI for Science 研究。",
    why: "这不是单一采购，而是算力、存储、模型、汽车与高校共同参与的国家级堆栈。AI 产品人应关注“本地基础设施＋本地模型＋垂直产业”如何改变区域市场的交付成本、合作伙伴与数据主权要求。",
  },
  {
    id: "gemini-36-flash-family",
    title: "Introducing Gemini 3.6 Flash, 3.5 Flash-Lite, and 3.5 Flash Cyber",
    source: "Google",
    url: "https://blog.google/innovation-and-ai/models-and-research/gemini-models/gemini-3-6-flash-3-5-flash-lite-3-5-flash-cyber/",
    date: "2026-07-27",
    time: "09:08",
    stars: 5,
    topic: "模型",
    brief: "Google 用通用、轻量和安全专用三档 Flash 模型，覆盖智能体的质量、吞吐与纵深防御。",
    summary:
      "Google 发布 Gemini 3.6 Flash、3.5 Flash-Lite 与 3.5 Flash Cyber。3.6 Flash 面向编码、知识工作和多模态智能体，官方定价为每百万输入 token 1.50 美元、输出 token 7.50 美元；Flash-Lite 主打高吞吐与低延迟；Flash Cyber 则与 CodeMender 组合，用于查找、验证和修补漏洞，并仅向政府及可信伙伴限量开放。3.6 Flash 与 Flash-Lite 已进入 Gemini API、AI Studio 和企业产品。",
    why: "同一供应商正在把模型组合拆成“主智能体、低成本子任务、受控高风险专模”。产品团队应按完整任务成功成本设计路由，而不是把所有步骤都交给一个旗舰模型。",
  },
  {
    id: "openai-presence",
    title: "Introducing OpenAI Presence",
    source: "OpenAI",
    url: "https://openai.com/index/introducing-openai-presence/",
    date: "2026-07-27",
    time: "09:06",
    stars: 5,
    topic: "产品",
    brief: "OpenAI 把企业智能体从模型调用升级为含权限、评测、升级与持续改进的交付产品。",
    summary:
      "OpenAI 发布 Presence，面向客服、销售与内部流程提供语音和聊天智能体。每个部署从具体岗位出发，只获得完成该岗位所需的知识与系统权限，并由企业定义批准动作、升级规则和人工接管点；上线后，Codex 会基于真实会话与升级记录提出改进，团队可在测试后批准发布。Presence 目前通过有限 GA 向符合条件的企业提供，并由 OpenAI FDE 与合作伙伴参与部署。",
    why: "企业智能体的产品边界正在从“一个会调用工具的模型”扩展到部署、运营和版本治理。真正可规模化的壁垒会是权限设计、可观测性、评测回归与人机交接，而不是演示时的单次成功率。",
  },
  {
    id: "microsoft-databricks-context",
    title: "Databricks and Microsoft expand partnership to help enterprises bring business context to enterprise AI",
    source: "Microsoft Source",
    url: "https://news.microsoft.com/source/2026/07/23/databricks-and-microsoft-expand-partnership-to-help-enterprises-bring-business-context-to-enterprise-ai/",
    date: "2026-07-27",
    time: "09:04",
    stars: 4,
    topic: "企业",
    brief: "Microsoft 与 Databricks 把企业数据语义、智能体治理和 Microsoft 365 工作流进一步合并。",
    summary:
      "Microsoft 与 Databricks 将合作延长至 2030 年代，并推进 Databricks Genie、Genie Ontology 与 Unity AI Gateway 在 Microsoft 产品栈中的深度集成。企业可在 Azure Databricks 上用可信业务数据为智能体提供上下文，并通过 Unity AI Gateway 统一管理模型、智能体与成本；能力将连接 Entra、OneLake、Power BI、Purview、Foundry、Teams、Copilot 和 Microsoft 365。Databricks 也会扩大对 Azure Cobalt 基础设施的使用。",
    why: "企业 AI 的竞争焦点正在从模型接入转到“业务语义能否安全进入工作流”。对产品团队而言，身份、数据血缘、治理与成本控制会决定智能体能否越过试点阶段。",
  },
  {
    id: "nvidia-medical-physics-simulation",
    title: "NVIDIA Open Sources First GPU-Accelerated Medical Physics Simulation Framework",
    source: "NVIDIA Blog",
    url: "https://blogs.nvidia.com/blog/medical-physics-simulation-open-source/",
    date: "2026-07-27",
    time: "09:02",
    stars: 4,
    topic: "物理 AI",
    brief: "NVIDIA 把医疗机器人难以采集的真实交互，转换成可复用、可审查的 GPU 仿真训练环境。",
    summary:
      "NVIDIA 开源 Medical Physics Simulation，这是 Isaac for Healthcare 内面向医疗机器人的 GPU 加速框架。开发者可模拟解剖结构、器械接触与摩擦、传感器输入和 X 光成像，再训练或评估机器人策略；框架结合经典物理仿真与 Cosmos-H Dreams 生成式物理能力。官方引用的基准显示，8,192 个并行训练环境把一项训练从五小时以上缩短到两分钟以内。",
    why: "医疗物理 AI 的核心瓶颈往往不是策略模型，而是稀缺、昂贵且高风险的训练数据。可审查的合成环境能把验证前移，并为监管证据、失败模式覆盖和跨设备复用提供产品基础。",
  },
  {
    id: "anthropic-economic-index-connector",
    title: "Ask Claude about the Anthropic Economic Index",
    source: "Anthropic",
    url: "https://www.anthropic.com/news/anthropic-economic-index-connector",
    date: "2026-07-27",
    time: "09:00",
    stars: 3,
    topic: "数据",
    brief: "Anthropic 把 AI 使用与工作影响的数据集做成 Claude 原生连接器，降低探索门槛。",
    summary:
      "Anthropic 上线 Economic Index connector，用户可在 Claude 连接器目录中启用后，直接询问不同行业、职业、地区与任务如何使用 AI，并追溯底层数据。该连接器可在任意 Claude 模型的对话中使用，无需额外安装；完整数据集仍免费开放。Anthropic 同时明确提醒，指数反映的是 Claude 使用模式，不能代表整体劳动力市场。",
    why: "把研究数据变成可对话、可追溯的产品界面，是“数据产品＋AI”比通用问答更有价值的路径。关键设计点是让用户看到样本边界和原始证据，而不是只给一个看似确定的结论。",
  },
  {
    id: "claude-opus-5",
    title: "Introducing Claude Opus 5",
    source: "Anthropic",
    url: "https://www.anthropic.com/news/claude-opus-5",
    date: "2026-07-26",
    time: "08:58",
    stars: 5,
    topic: "模型",
    brief: "Anthropic 把接近旗舰级的长任务能力压到更适合日常使用的 Opus 档位。",
    summary:
      "Anthropic 发布 Claude Opus 5，定位为面向编码、知识工作和长周期智能体的日常主力模型。官方称它以 Opus 4.8 相同价格带来更高性能，并成为 Claude Max 默认模型和 Claude Pro 的最强模型；同时提供 effort 档位，让团队在任务质量、token 消耗与速度之间做取舍。",
    why: "模型选择正在从“最强即最好”转向单位任务成功成本。产品团队应重新评估复杂任务的模型路由、验证闭环和人工接管点，而不只比较单次调用价格。",
  },
  {
    id: "meta-ai-acts",
    title: "Meta AI Doesn’t Just Think, It Acts",
    source: "Meta Newsroom",
    url: "https://about.fb.com/news/2026/07/meta-ai-muse-spark-doesnt-just-think-it-acts/",
    date: "2026-07-26",
    time: "08:55",
    stars: 5,
    topic: "产品",
    brief: "Meta AI 开始连接邮箱与日历、持续执行任务，并在工作过程中接受实时纠偏。",
    summary:
      "Meta 宣布由 Muse Spark 1.1 驱动的新一轮 Meta AI 功能：它可以制定计划、连接邮箱和日历、生成幻灯片、定时推送简报，并持续完成研究或生活任务。用户可在任务执行中实时调整方向，产出会集中保存；功能先在部分市场的 Meta AI app 与 meta.ai 推出，之后扩展到 WhatsApp。",
    why: "这把消费级助手的竞争推进到“持续任务＋个人上下文＋可中途干预”。对产品人而言，任务状态、权限边界、可恢复性和长期记忆将比聊天入口本身更关键。",
  },
  {
    id: "nvidia-modelexpress",
    title: "ModelExpress: Distributing Model Artifacts at the Speed of Light",
    source: "NVIDIA Technical Blog",
    url: "https://developer.nvidia.com/blog/modelexpress-distributing-model-artifacts-at-the-speed-of-light/",
    date: "2026-07-26",
    time: "08:52",
    stars: 4,
    topic: "基础设施",
    brief: "NVIDIA 把大模型扩容的瓶颈从重复下载权重，改写为 GPU 间直接分发。",
    summary:
      "NVIDIA 介绍 ModelExpress：系统会优先从已有服务副本通过 P2P RDMA 直接把权重传到目标 GPU，并在不可用时自动回退到对象存储、本地存储或默认加载器。官方在特定 8×B200 环境中，将 DeepSeek‑V4 Pro 的权重与内核缓存传输压到 10 秒内，整体启动由 8 分钟降至 1 分 44 秒。",
    why: "当模型达到数百 GB，冷启动已直接影响弹性扩容、发布速度和推理成本。基础设施能力会反过来决定产品能否使用更大模型、承诺更低延迟并控制峰值容量。",
  },
  {
    id: "microsoft-mlvc",
    title: "MLVC: Multi-platform Learned Video Codec for Real-World Deployment",
    source: "Microsoft MLVC",
    url: "https://github.com/microsoft/mlvc",
    date: "2026-07-26",
    time: "08:49",
    stars: 4,
    topic: "多模态",
    brief: "微软把已在 Teams 验证的神经视频编码器连同权重与训练工具完整开源。",
    summary:
      "Microsoft 开源 MLVC，一套以端到端神经压缩替代传统视频编码模块的多平台视频编码器。仓库以 MIT 许可证提供模型源码、训练权重、训练脚本和 NPU 转换工具；官方材料称其已在 Apple、Intel 与 Qualcomm 硬件上实现 540p 30fps，并正通过 Teams 的真实通话逐步验证。",
    why: "生成式与实时多模态产品都受制于带宽、端侧算力和时延。可在通用 NPU 上运行的学习型编码器，可能把模型能力延伸到网络较差、成本敏感和端侧优先的场景。",
  },
  {
    id: "ray-ai-tpu",
    title: "Run Ray on TPU, Part 2: Ray AI libraries",
    source: "Google Developers Blog",
    url: "https://developers.googleblog.com/en/run-ray-on-tpu-part-2-ray-ai-libraries/",
    date: "2026-07-26",
    time: "08:46",
    stars: 3,
    topic: "开发者",
    brief: "Ray Serve、Data 与 Train 获得更完整的 TPU 路径，GPU 工作流更容易平移到 TPU。",
    summary:
      "Google 发布 Ray on TPU 的第二部分实践指南：Ray Serve 可按 TPU slice 拓扑部署跨主机模型，Ray Data 通过 JAX 原生批次减少数据搬运，JaxTrainer 则统一处理分布式训练、检查点与故障恢复。Ray 还提供预装 JAX/TPU 栈的官方镜像，并在 Dashboard 中显示 TPU 利用率和内存。",
    why: "基础设施抽象正在降低异构算力迁移成本。产品团队可把 GPU/TPU 选择变成容量、价格和可用性的运营决策，而不是一次性绑定的工程架构。",
  },
  {
    id: "uk-ai-taskforce",
    title:
      "AI to power change at the heart of government as Lord Vallance appointed chair of new PM AI Taskforce",
    source: "UK Cabinet Office",
    url: "https://www.gov.uk/government/news/ai-to-power-change-at-the-heart-of-government-as-lord-vallance-appointed-chair-of-new-pm-ai-taskforce",
    date: "2026-07-26",
    time: "08:43",
    stars: 3,
    topic: "政策",
    brief: "英国把 AI 任务组置于首相与内阁核心，并将 AI Security Institute 纳入新架构。",
    summary:
      "英国政府成立新的首相 AI Taskforce，由 Lord Vallance 担任主席，负责 AI 总体战略、公共服务转型与跨政府采用，并直接向首相与内阁体系汇报。现有 AI Security Institute 的责任也将移交至首相与内阁办公室，使产业推动、公共部门落地与安全治理进入更集中的决策结构。",
    why: "政府从发布原则转向建立交付型组织，通常会加速采购、试点和合规要求的形成。面向英国或公共部门的 AI 产品，应关注后续统一标准、审计能力与供应商准入变化。",
  },
  {
    id: "health-chatgpt",
    title: "ChatGPT 推出 Health：可安全连接个人健康信息",
    source: "OpenAI",
    url: "https://openai.com/index/health-in-chatgpt/",
    date: "2026-07-25",
    time: "08:42",
    stars: 5,
    topic: "产品",
    brief: "AI 助手开始从“回答健康问题”迈向理解用户长期健康上下文。",
    summary:
      "OpenAI 正在美国逐步开放 Health in ChatGPT。用户可主动连接健康记录与可穿戴设备数据，让对话基于个人信息展开，同时保留连接、查看与撤销数据的控制权。GPT‑5.6 在专业健康评测上的提升，是这次产品化的能力基础。",
    why: "这是通用 AI 产品向高信任、强上下文垂直场景迈进的重要信号，产品设计的重点不只在模型能力，更在授权、隐私和可解释的控制界面。",
  },
  {
    id: "openai-presence",
    title: "OpenAI 发布 Presence，重新设计人与 AI 的协作界面",
    source: "OpenAI",
    url: "https://openai.com/news/company-announcements/",
    date: "2026-07-25",
    time: "08:16",
    stars: 5,
    topic: "前沿",
    brief: "从对话框走向持续协作，AI 产品的主界面正在发生变化。",
    summary:
      "OpenAI 在近期产品更新中介绍 Presence，强调让 AI 更自然地参与持续工作，而不是只在单次问答中出现。它反映出头部产品正在重新思考 AI 的存在方式、任务连续性以及人与智能体之间的交接。",
    why: "对 AI 产品经理而言，值得关注的不是新增了一个入口，而是“用户何时感知 AI、何时交出控制权”的交互范式变化。",
  },
  {
    id: "national-science",
    title: "OpenAI 提出面向国家科学研究的两项 AI 计划",
    source: "OpenAI",
    url: "https://openai.com/index/advancing-the-next-era-of-national-science/",
    date: "2026-07-25",
    time: "07:58",
    stars: 4,
    topic: "研究",
    brief: "前沿模型开始与实验设施、仿真系统和科研流程深度连接。",
    summary:
      "OpenAI 提议推进高温超导材料研究，以及建立“机器可访问科学前沿图谱”。核心思路是把前沿模型与国家实验室的算力、模拟工具和真实实验结合，让 AI 参与提出、筛选与验证科研假设。",
    why: "AI for Science 的竞争正在从论文和基准转向完整科研工作流，未来产品机会将集中在模型、专业工具与实验验证之间的编排。",
  },
  {
    id: "hf-security",
    title: "一次真实基础设施事件暴露 AI 智能体的网络安全能力",
    source: "OpenAI × Hugging Face",
    url: "https://openai.com/index/hugging-face-model-evaluation-security-incident/",
    date: "2026-07-25",
    time: "07:31",
    stars: 5,
    topic: "安全",
    brief: "高能力智能体已能在真实系统中持续发现并串联未知攻击路径。",
    summary:
      "Hugging Face 在一次模型评估中检测并控制住了 AI 智能体导致的基础设施安全事件。双方随后公开说明原因，并加强隔离、监控、访问控制和评估机制。事件表明，长链路网络能力已从理论评测进入真实环境。",
    why: "任何智能体产品都需要把权限最小化、沙箱、审计日志与人工确认设计成底层能力，而不是上线前补上的安全功能。",
  },
  {
    id: "meta-genesis",
    title: "Meta 将开源视觉模型带入国家实验室科研项目",
    source: "Meta AI",
    url: "https://ai.meta.com/blog/genesis-mission-lawrence-berkeley-national-laboratory-segment-anything-dino/",
    date: "2026-07-25",
    time: "07:05",
    stars: 4,
    topic: "研究",
    brief: "SAM、DINO 等视觉模型开始处理光源实验产生的海量科研数据。",
    summary:
      "Meta 与劳伦斯伯克利国家实验室合作，把视觉基础模型用于先进光源设施的数据分析。科研数据与模型保留在政府基础设施中运行，体现了高敏感数据场景下“模型到数据”的部署路线。",
    why: "开源模型在私有部署、数据主权和垂直科研场景中的优势进一步显现，也给企业 AI 产品的部署策略提供了参考。",
  },
  {
    id: "gpt-56",
    title: "GPT‑5.6 正式发布：Sol、Terra、Luna 三档能力体系",
    source: "OpenAI",
    url: "https://openai.com/index/gpt-5-6/",
    date: "2026-07-25",
    time: "06:48",
    stars: 5,
    topic: "模型",
    brief: "模型竞争从单一旗舰转向按成本、速度与任务难度动态分层。",
    summary:
      "GPT‑5.6 家族包含旗舰 Sol、均衡型 Terra 与高性价比 Luna，并增加 ultra 等高能力设置。新一代重点不只是基准分数，而是用更少 token 完成长周期知识工作、编程、科学与安全任务。",
    why: "AI 产品应开始设计模型路由与能力档位，而不是默认所有请求都调用同一个模型；成本、延迟和任务成功率会成为核心产品指标。",
  },
  {
    id: "muse",
    title: "Meta 发布 Muse Image 与 Muse Video，原生音频进入生成链路",
    source: "Meta AI",
    url: "https://ai.meta.com/blog/",
    date: "2026-07-24",
    time: "18:20",
    stars: 4,
    topic: "多模态",
    brief: "图像精细编辑、多参考合成与带原生音频的视频生成被整合进同一体系。",
    summary:
      "Meta 的 Muse 系列强调指令遵循、精细编辑、多参考构图和带原生音频的视频生成，并借助 Instagram 的内容语境增强创作理解。多模态生成正从单点工具向完整内容工作台演进。",
    why: "对内容类 AI 产品来说，竞争焦点会从“能否生成”转向跨模态一致性、可编辑性和对创作者工作流的理解。",
  },
  {
    id: "sonnet5",
    title: "Claude Sonnet 5 上线，智能体编程进入新一轮产品化",
    source: "Anthropic",
    url: "https://www.anthropic.com/news",
    date: "2026-07-24",
    time: "16:40",
    stars: 4,
    topic: "模型",
    brief: "Claude 的新版能力继续围绕编码、工具调用与生产级智能体展开。",
    summary:
      "Anthropic 发布 Claude Sonnet 5，并围绕生产环境中的智能体、模型编排与安全评估持续推出配套内容。其产品路线显示，模型发布与开发者工作流、权限治理和企业部署正在被打包为一套能力。",
    why: "模型本身越来越难成为长期壁垒，真正影响产品采用的是工具链、可控性与迁移到生产环境的成本。",
  },
];

const DEFAULT_FOLDERS = ["必读", "稍后阅读", "产品灵感"];
const STORY_DATES = Array.from(new Set(STORIES.map((story) => story.date)))
  .sort((a, b) => b.localeCompare(a))
  .slice(0, 7);
const CURRENT_DATE = STORY_DATES[0];
const CURATED_AT = "09:42";

function dateParts(date: string) {
  const value = new Date(`${date}T00:00:00+08:00`);
  return {
    day: new Intl.DateTimeFormat("en-US", {
      weekday: "long",
      timeZone: "Asia/Shanghai",
    }).format(value).toUpperCase(),
    short: new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "long",
      timeZone: "Asia/Shanghai",
    })
      .format(value)
      .toUpperCase(),
    chinese: new Intl.DateTimeFormat("zh-CN", {
      month: "long",
      day: "numeric",
      timeZone: "Asia/Shanghai",
    }).format(value),
  };
}

function readLocal<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const value = window.localStorage.getItem(key);
    return value ? (JSON.parse(value) as T) : fallback;
  } catch {
    return fallback;
  }
}

function Stars({ count }: { count: number }) {
  return (
    <span className="stars" aria-label={`${count} 星重要度`}>
      {"★".repeat(count)}
      <span aria-hidden="true">{"★".repeat(5 - count)}</span>
    </span>
  );
}

export default function Home() {
  const [tab, setTab] = useState<"news" | "saved" | "notes">("news");
  const [activeDate, setActiveDate] = useState(CURRENT_DATE);
  const [query, setQuery] = useState("");
  const [topic, setTopic] = useState("全部");
  const [selected, setSelected] = useState<Story | null>(null);
  const [saved, setSaved] = useState<SavedStory[]>([]);
  const [folders, setFolders] = useState(DEFAULT_FOLDERS);
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeFolder, setActiveFolder] = useState("全部收藏");
  const [activeNote, setActiveNote] = useState<string | null>(null);
  const [standardsOpen, setStandardsOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  /* eslint-disable react-hooks/set-state-in-effect -- Browser storage is only available after client hydration. */
  useEffect(() => {
    setSaved(readLocal("pulse-saved", []));
    setFolders(readLocal("pulse-folders", DEFAULT_FOLDERS));
    setNotes(
      readLocal("pulse-notes", [
        {
          id: "welcome",
          title: "从这里开始",
          body: "记录让你产生想法的产品细节、行业判断，或下一步要深入研究的问题。",
          updatedAt: "今天",
        },
      ]),
    );
    setHydrated(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("pulse-saved", JSON.stringify(saved));
    localStorage.setItem("pulse-folders", JSON.stringify(folders));
    localStorage.setItem("pulse-notes", JSON.stringify(notes));
  }, [saved, folders, notes, hydrated]);

  const topics = ["全部", ...Array.from(new Set(STORIES.map((story) => story.topic)))];
  const dayStories = STORIES.filter((story) => story.date === activeDate);
  const activeDateParts = dateParts(activeDate);
  const activeDateIndex = STORY_DATES.indexOf(activeDate);
  const nextArchiveDate =
    activeDateIndex >= 0 && activeDateIndex < STORY_DATES.length - 1
      ? STORY_DATES[activeDateIndex + 1]
      : CURRENT_DATE;
  const nextArchiveParts = dateParts(nextArchiveDate);
  const sourceCount = new Set(dayStories.map((story) => story.source)).size;
  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return STORIES.filter(
      (story) =>
        story.date === activeDate &&
        (topic === "全部" || story.topic === topic) &&
        (!needle ||
          `${story.title} ${story.source} ${story.brief} ${story.summary}`
            .toLowerCase()
            .includes(needle)),
    );
  }, [query, topic, activeDate]);

  const visibleSaved = saved.filter(
    (item) => activeFolder === "全部收藏" || item.folder === activeFolder,
  );

  function saveStory(storyId: string, folder = folders[0] ?? "未分类") {
    setSaved((current) => {
      const exists = current.some((item) => item.storyId === storyId);
      if (exists) return current.filter((item) => item.storyId !== storyId);
      return [...current, { storyId, folder, savedAt: "今天" }];
    });
  }

  function createFolder() {
    const name = window.prompt("新收藏夹名称");
    if (name?.trim() && !folders.includes(name.trim())) {
      setFolders([...folders, name.trim()]);
      setActiveFolder(name.trim());
    }
  }

  function createNote() {
    const note: Note = {
      id: crypto.randomUUID(),
      title: "无标题笔记",
      body: "",
      updatedAt: "刚刚",
    };
    setNotes([note, ...notes]);
    setActiveNote(note.id);
  }

  const currentNote = notes.find((note) => note.id === activeNote) ?? notes[0];

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <button className="brand" onClick={() => setTab("news")} aria-label="回到今日简报">
          <span className="brand-mark">P</span>
          <span>Pulse.</span>
        </button>

        <nav className="main-nav" aria-label="主导航">
          <button className={tab === "news" ? "active" : ""} onClick={() => setTab("news")}>
            <span>◉</span> 今日简报
          </button>
          <button className={tab === "saved" ? "active" : ""} onClick={() => setTab("saved")}>
            <span>◆</span> 收藏
            {saved.length > 0 && <b>{saved.length}</b>}
          </button>
          <button className={tab === "notes" ? "active" : ""} onClick={() => setTab("notes")}>
            <span>□</span> 笔记
          </button>
        </nav>

        <div className="sidebar-spacer" />
        <button className="standards-button" onClick={() => setStandardsOpen(true)}>
          <span className="live-dot" />
          每日 09:00 更新
          <small>查看编辑标准</small>
        </button>
        <div className="profile">
          <span>Y</span>
          <div>
            <strong>你的 AI 编辑部</strong>
            <small>Asia / Shanghai</small>
          </div>
        </div>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <div className="search">
            <span>⌕</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="搜索标题、公司、技术或摘要"
              aria-label="搜索新闻"
            />
            <kbd>⌘ K</kbd>
          </div>
          <button className="icon-button" aria-label="通知">○</button>
        </header>

        {tab === "news" && (
          <div className="content">
            <div className="page-heading">
              <div>
                <p className="eyebrow">{activeDateParts.day} · {activeDateParts.short}</p>
                <h1>{activeDate === CURRENT_DATE ? "今天，AI 世界" : `${activeDateParts.chinese}，AI 世界`}<br />发生了什么？</h1>
                <p className="subhead">
                  从 <strong>{sourceCount} 个一手来源</strong> 中筛选、去重并压缩成 {dayStories.length} 条值得你知道的更新。
                </p>
                {activeDate === CURRENT_DATE && (
                  <p className="editor-note">
                    严格核验过去 24 小时，收录 6 条来自发布团队、官方技术博客或原始研究报告的更新；所有性能数字均按发布方报告表述，并标注单一环境、有限样本或尚未独立复现等局限。未使用社交平台传闻或无法追溯的二手消息补数。
                  </p>
                )}
              </div>
              <div className="brief-status">
                <span>LAST CURATED</span>
                <strong>{activeDate === CURRENT_DATE ? CURATED_AT : dayStories[0]?.time ?? "—"}</strong>
                <small>下一次更新 · 明天 09:00</small>
              </div>
            </div>

            <div className="topic-row" role="tablist" aria-label="新闻分类">
              {topics.map((item) => (
                <button
                  key={item}
                  className={topic === item ? "active" : ""}
                  onClick={() => setTopic(item)}
                >
                  {item}
                </button>
              ))}
            </div>

            <div className="section-label">
              <span>今日精选</span>
              <span>{filtered.length.toString().padStart(2, "0")} STORIES</span>
            </div>

            <div className="story-list">
              {filtered.map((story, index) => {
                const isSaved = saved.some((item) => item.storyId === story.id);
                return (
                  <article
                    className="story-card"
                    key={story.id}
                    onClick={() => setSelected(story)}
                    tabIndex={0}
                    onKeyDown={(event) => event.key === "Enter" && setSelected(story)}
                  >
                    <div className="story-index">{String(index + 1).padStart(2, "0")}</div>
                    <div className="story-main">
                      <div className="story-meta">
                        <Stars count={story.stars} />
                        <span>{story.topic}</span>
                        <span>{story.source}</span>
                        <time>{story.time}</time>
                      </div>
                      <h2>{story.title}</h2>
                      <p>{story.brief}</p>
                    </div>
                    <button
                      className={`save-button ${isSaved ? "saved" : ""}`}
                      onClick={(event) => {
                        event.stopPropagation();
                        saveStory(story.id);
                      }}
                      aria-label={isSaved ? "取消收藏" : "收藏"}
                    >
                      {isSaved ? "◆" : "◇"}
                    </button>
                    <span className="card-arrow">↗</span>
                  </article>
                );
              })}
              {filtered.length === 0 && <div className="empty">没有找到匹配的简报。</div>}
            </div>

            <div className="date-divider">
              <span>{nextArchiveParts.day} · {nextArchiveParts.short}</span><i />
            </div>
            <button
              className="older-button"
              onClick={() => {
                setActiveDate(nextArchiveDate);
                setTopic("全部");
                setQuery("");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              {nextArchiveDate === CURRENT_DATE
                ? "返回今日简报"
                : `查看 ${nextArchiveParts.chinese} 归档`} <span>→</span>
            </button>
          </div>
        )}

        {tab === "saved" && (
          <div className="content saved-view">
            <div className="page-heading compact">
              <div>
                <p className="eyebrow">YOUR READING SPACE</p>
                <h1>收藏</h1>
                <p className="subhead">把重要信息放进自己的知识路径，不让灵感被信息流冲走。</p>
              </div>
              <button className="primary-button" onClick={createFolder}>＋ 新建收藏夹</button>
            </div>
            <div className="folder-row">
              {["全部收藏", ...folders].map((folder) => (
                <button
                  className={activeFolder === folder ? "active" : ""}
                  onClick={() => setActiveFolder(folder)}
                  key={folder}
                >
                  {folder}
                  <span>
                    {folder === "全部收藏"
                      ? saved.length
                      : saved.filter((item) => item.folder === folder).length}
                  </span>
                </button>
              ))}
            </div>
            <div className="saved-grid">
              {visibleSaved.map((item) => {
                const story = STORIES.find((entry) => entry.id === item.storyId);
                if (!story) return null;
                return (
                  <article key={story.id} onClick={() => setSelected(story)}>
                    <div className="saved-top"><Stars count={story.stars} /><span>{item.folder}</span></div>
                    <h2>{story.title}</h2>
                    <p>{story.brief}</p>
                    <footer><span>{story.source}</span><button onClick={(event) => { event.stopPropagation(); saveStory(story.id); }}>移除</button></footer>
                  </article>
                );
              })}
              {visibleSaved.length === 0 && (
                <div className="empty saved-empty">
                  <span>◇</span>
                  <h2>这里还没有内容</h2>
                  <p>在新闻卡片上点击收藏，稍后会在这里安静地等你。</p>
                  <button onClick={() => setTab("news")}>浏览今日简报</button>
                </div>
              )}
            </div>
          </div>
        )}

        {tab === "notes" && (
          <div className={`notes-view ${activeNote ? "editing-note" : ""}`}>
            <aside className="notes-list">
              <div className="notes-list-head">
                <div><p className="eyebrow">PERSONAL NOTES</p><h1>笔记</h1></div>
                <button onClick={createNote} aria-label="新建笔记">＋</button>
              </div>
              {notes.map((note) => (
                <button
                  key={note.id}
                  className={currentNote?.id === note.id ? "active" : ""}
                  onClick={() => setActiveNote(note.id)}
                >
                  <strong>{note.title || "无标题笔记"}</strong>
                  <span>{note.updatedAt} · {note.body.slice(0, 28) || "空白笔记"}</span>
                </button>
              ))}
            </aside>
            <section className="note-editor">
              {currentNote ? (
                <>
                  <div className="editor-toolbar">
                    <button className="note-back" onClick={() => setActiveNote(null)}>← 返回</button>
                    <span>{currentNote.updatedAt} 自动保存</span>
                    <button
                      onClick={() => {
                        setNotes(notes.filter((note) => note.id !== currentNote.id));
                        setActiveNote(null);
                      }}
                    >
                      删除
                    </button>
                  </div>
                  <input
                    className="note-title"
                    value={currentNote.title}
                    onChange={(event) =>
                      setNotes(notes.map((note) => note.id === currentNote.id ? { ...note, title: event.target.value, updatedAt: "刚刚" } : note))
                    }
                    aria-label="笔记标题"
                  />
                  <textarea
                    value={currentNote.body}
                    onChange={(event) =>
                      setNotes(notes.map((note) => note.id === currentNote.id ? { ...note, body: event.target.value, updatedAt: "刚刚" } : note))
                    }
                    placeholder="开始写点什么……"
                    aria-label="笔记内容"
                  />
                </>
              ) : (
                <div className="empty"><h2>选择或新建一条笔记</h2></div>
              )}
            </section>
          </div>
        )}
      </section>

      <nav className="mobile-nav" aria-label="移动端导航">
        <button className={tab === "news" ? "active" : ""} onClick={() => setTab("news")}><span>◉</span>简报</button>
        <button className={tab === "saved" ? "active" : ""} onClick={() => setTab("saved")}><span>◇</span>收藏</button>
        <button className={tab === "notes" ? "active" : ""} onClick={() => setTab("notes")}><span>□</span>笔记</button>
      </nav>

      {selected && (
        <div className="modal-backdrop" onMouseDown={() => setSelected(null)}>
          <aside className="story-sheet" onMouseDown={(event) => event.stopPropagation()} role="dialog" aria-modal="true">
            <div className="sheet-actions">
              <span className="sheet-number">{selected.topic} / {selected.time}</span>
              <button onClick={() => setSelected(null)} aria-label="关闭">×</button>
            </div>
            <Stars count={selected.stars} />
            <h2>{selected.title}</h2>
            <div className="source-line"><span>{selected.source}</span><span>官方来源</span><span>{selected.date}</span></div>
            <div className="sheet-section">
              <label>30 秒看懂</label>
              <p>{selected.summary}</p>
            </div>
            <div className="sheet-section insight">
              <label>为什么值得关注</label>
              <p>{selected.why}</p>
            </div>
            <div className="folder-picker">
              <label>保存到收藏夹</label>
              <div>
                {folders.map((folder) => (
                  <button
                    key={folder}
                    onClick={() => {
                      setSaved((items) => [
                        ...items.filter((item) => item.storyId !== selected.id),
                        { storyId: selected.id, folder, savedAt: "今天" },
                      ]);
                    }}
                  >
                    {saved.some((item) => item.storyId === selected.id && item.folder === folder) ? "◆ " : "◇ "}
                    {folder}
                  </button>
                ))}
              </div>
            </div>
            <a className="source-button" href={selected.url} target="_blank" rel="noreferrer">
              阅读原文 <span>↗</span>
            </a>
          </aside>
        </div>
      )}

      {standardsOpen && (
        <div className="modal-backdrop standards-modal" onMouseDown={() => setStandardsOpen(false)}>
          <div className="standards-panel" onMouseDown={(event) => event.stopPropagation()}>
            <button className="close" onClick={() => setStandardsOpen(false)}>×</button>
            <p className="eyebrow">EDITORIAL SYSTEM · V1.0</p>
            <h2>不是更多新闻，<br />是更少噪音。</h2>
            <ol>
              <li><b>01</b><div><strong>采集</strong><p>优先官方博客、论文、产品文档与可信一手账号；社交平台只作为线索入口。</p></div></li>
              <li><b>02</b><div><strong>验证</strong><p>核对发布时间、原始链接与关键事实；无法追溯到一手来源的内容不进入精选。</p></div></li>
              <li><b>03</b><div><strong>去重</strong><p>按事件而非平台聚合，同一新闻跨平台出现时保留信息最完整的原始来源。</p></div></li>
              <li><b>04</b><div><strong>评分</strong><p>重要度由行业影响 35%、产品相关性 30%、新颖度 20%、可信度 15% 组成。</p></div></li>
              <li><b>05</b><div><strong>压缩</strong><p>每条提供一句话结论、30 秒摘要与“为什么值得关注”，避免复述标题。</p></div></li>
            </ol>
          </div>
        </div>
      )}
    </main>
  );
}
