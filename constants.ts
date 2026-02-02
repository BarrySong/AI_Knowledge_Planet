
import { GraphData } from './types';

export const COLORS = {
  core: '#FF6B6B', // 人工智能核心
  tech: '#4D96FF', // 技术细节
  bridge: '#6BCB77', // 连接/协议
  future: '#FFD93D', // 应用场景
};

export const KNOWLEDGE_DATA: GraphData = {
  nodes: [
    {
      id: 'ai',
      label: '人工智能 (AI)',
      category: 'core',
      summary: '模拟人类智慧的机器，是所有技术的“源头”。',
      analogy: '就像是人类文明中的“电力”，驱动一切。',
      detail: '它是所有概念的起点。目标是让机器像人一样能思考、能判断。',
      importance: '它是数字时代的底层底座。',
      level: 0
    },
    {
      id: 'big_model',
      label: '大模型 (Big Model)',
      category: 'core',
      summary: '读过人类几乎所有书籍的“巨型大脑”。',
      analogy: '像是一个装满了人类文明所有知识的超级图书馆。',
      detail: '基于海量数据训练出来的基础模型，它是 AI 能够变聪明的核心逻辑。',
      importance: '它是现代 AI 爆发的燃料。',
      level: 1
    },
    {
      id: 'llm',
      label: 'LLM (语言大模型)',
      category: 'tech',
      summary: '大模型中目前最成功的“聊天专家”。',
      analogy: '图书馆里最健谈的管理员，能帮你写信、翻译、讲故事。',
      detail: '专门处理语言的模型。我们平时用的 ChatGPT、Claude、Gemini、Qwen 都属于这一类。',
      importance: '它让机器第一次能真正理解并说人类的语言。',
      level: 2
    },
    {
      id: 'qwen',
      label: '通义千问 (Qwen)',
      category: 'tech',
      summary: '来自阿里巴巴的国产顶尖大模型。',
      analogy: '像是 LLM 家族中中文最好的“全能学霸”，数学和代码也很强。',
      detail: 'Qwen（通义千问）是阿里云研发的超大规模语言模型。它在理解中国文化、处理中文复杂逻辑以及编写程序方面有着世界级的表现。',
      importance: '展示了国产大模型在国际舞台上的竞争实力。',
      level: 3
    },
    {
      id: 'agent',
      label: 'AI 智能体 (Agent)',
      category: 'future',
      summary: '不仅会聊天，还会自己规划干活的“数字员工”。',
      analogy: '如果 LLM 是个“聪明的脑袋”，Agent 就是“脑袋+手脚”。',
      detail: '基于 LLM，能够自主使用工具、进行逻辑推理并完成复杂任务。',
      importance: '它是 AI 从“玩具”变成“生产力工具”的关键。',
      level: 1
    },
    {
      id: 'mcp',
      label: 'MCP (模型上下文协议)',
      category: 'bridge',
      summary: 'AI 连接外部工具和数据的“通用语言”。',
      analogy: '就像是手机上的“通用充电接口”，让不同的 AI 都能插上就能用各种工具。',
      detail: 'MCP 是一种开放标准，解决了 AI 如何安全、高效地访问你的文件、数据库和软件的问题。',
      importance: '它让 AI 不再只是空谈，而是能真正动手干活。',
      level: 2
    },
    {
      id: 'mcp_client',
      label: 'MCP 客户端 (发起者)',
      category: 'tech',
      summary: '负责协调任务的“指挥中心”。',
      analogy: '就像是公司的“项目经理”，他负责把你的需求翻译成指令发给具体的人。',
      detail: '例如你使用的 Claude Desktop 或智能编程工具。它负责管理连接，并将 AI 的意图转化为 MCP 协议指令。',
      importance: '它是用户意图与技术执行之间的桥梁。',
      level: 3,
      usageExample: '交互场景：\n1. 你问：帮我分析下这张表格并做个 PPT。\n2. 客户端（如 Claude）感知到需求，通过 MCP 协议向后方喊话：谁能做 PPT？'
    },
    {
      id: 'mcp_server',
      label: 'MCP 服务端 (执行者)',
      category: 'tech',
      summary: '真正去操作软件、读取数据的“老师傅”。',
      analogy: '就像是后厨里拿铲子的厨师，他真的去开火（操作软件）做出一道菜。',
      detail: '服务端连接着具体的工具。比如一个连接 PowerPoint 的 MCP 服务端，它在收到指令后，会通过代码直接在你的电脑上新建幻灯片、排版。',
      importance: '它赋予了 AI 操作现实世界工具的硬核能力。',
      level: 3,
      usageExample: '制作 PPT 案例：\n1. 接收大纲：服务端收到客户端发来的结构化内容。\n2. 自动化执行：服务端自动打开 PPT 进程，创建幻灯片并填充内容。\n3. 反馈结果：任务完成后告知客户端，PPT 已生成在桌面。'
    },
    {
      id: 'long_term_memory',
      label: '长期记忆',
      category: 'bridge',
      summary: '让 AI 记住你的偏好、历史和专属知识。',
      analogy: '就像给 AI 装了一个大硬盘，让它不再是“转头就忘”的金鱼。',
      detail: '通过各种技术手段让 AI 在不同对话中保持记忆的连贯性。',
      importance: '它是实现个性化 AI 助手的必经之路。',
      level: 2
    },
    {
      id: 'rag',
      label: 'RAG (检索增强生成)',
      category: 'tech',
      summary: '给 AI 配一台“实时翻书机”。',
      analogy: '考试时允许 AI 带一本随时更新的参考书。',
      detail: 'AI 先去你的文档库里找答案，再总结给你。这是实现记忆最稳妥的方法。',
      importance: '解决了 AI 知识过时和胡说八道的问题。',
      level: 3
    },
    {
      id: 'vector_db',
      label: '向量数据库',
      category: 'tech',
      summary: 'AI 专属的“高效知识仓库”。',
      analogy: '像是一个带有超级索引的档案柜，AI 能瞬间找到相关的历史片段。',
      detail: '专门存储和快速检索 AI 能够理解的“数字语义”。',
      importance: '它是 RAG 技术的底层支撑设施。',
      level: 4
    }
  ],
  links: [
    { source: 'ai', target: 'big_model', label: '核心驱动' },
    { source: 'ai', target: 'agent', label: '终极形态' },
    { source: 'big_model', target: 'llm', label: '主流实现' },
    { source: 'llm', target: 'qwen', label: '家族成员' },
    { source: 'llm', target: 'long_term_memory', label: '能力补齐' },
    { source: 'agent', target: 'long_term_memory', label: '核心大脑' },
    { source: 'long_term_memory', target: 'rag', label: '技术手段' },
    { source: 'rag', target: 'vector_db', label: '数据基础' },
    { source: 'mcp', target: 'mcp_client', label: '包含' },
    { source: 'mcp', target: 'mcp_server', label: '包含' },
    { source: 'mcp_client', target: 'agent', label: '工具赋能' },
    { source: 'mcp_server', target: 'rag', label: '数据读取' }
  ]
};
