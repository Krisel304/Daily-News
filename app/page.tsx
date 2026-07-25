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
  const [activeDate, setActiveDate] = useState("2026-07-25");
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

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("pulse-saved", JSON.stringify(saved));
    localStorage.setItem("pulse-folders", JSON.stringify(folders));
    localStorage.setItem("pulse-notes", JSON.stringify(notes));
  }, [saved, folders, notes, hydrated]);

  const topics = ["全部", ...Array.from(new Set(STORIES.map((story) => story.topic)))];
  const dayStories = STORIES.filter((story) => story.date === activeDate);
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
                <p className="eyebrow">{activeDate === "2026-07-25" ? "SATURDAY · 25 JULY" : "FRIDAY · 24 JULY"}</p>
                <h1>{activeDate === "2026-07-25" ? "今天，AI 世界" : "7月24日，AI 世界"}<br />发生了什么？</h1>
                <p className="subhead">
                  从 <strong>42 个可信来源</strong> 中筛选、去重并压缩成 {dayStories.length} 条值得你知道的更新。
                </p>
              </div>
              <div className="brief-status">
                <span>LAST CURATED</span>
                <strong>08:42</strong>
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

            <div className="date-divider"><span>{activeDate === "2026-07-25" ? "FRIDAY · 24 JULY" : "SATURDAY · 25 JULY"}</span><i /></div>
            <button
              className="older-button"
              onClick={() => {
                setActiveDate(activeDate === "2026-07-25" ? "2026-07-24" : "2026-07-25");
                setTopic("全部");
                setQuery("");
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              {activeDate === "2026-07-25" ? "查看昨日归档" : "返回今日简报"} <span>→</span>
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
