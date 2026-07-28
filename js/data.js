// ============================================================
// 欣子工作台 — 示例数据
// ============================================================

const workbenchData = {
  // 首页概览
  home: {
    userName: '欣子',
    megaTitle: 'XINZI',
    collage: {
      today: {
        items: [
          { time: '18:30', activity: '核心+肩背', location: '健身房' }
        ],
        count: 1
      },
      finance: {
        capsules: [
          { tag: 'A股', title: '沪指收涨0.86%', hot: true },
          { tag: '基金', title: '权益基金净流入50亿', hot: false },
          { tag: '政策', title: '央行保持流动性充裕', hot: false }
        ]
      },
      tools: {
        items: [
          { name: 'Canva', icon: '🎨' },
          { name: 'MJ', icon: '🤖' },
          { name: 'SD', icon: '🖼️' },
          { name: 'Firefly', icon: '🔥' }
        ]
      },
      poster: {
        tasks: [
          { name: '夏季理财节', status: '进行中', deadline: '07-30' },
          { name: '新基金发行', status: '待开始', deadline: '08-02' }
        ]
      }
    },
    cards: [
      { id: 'study',   icon: '📚', title: '学习探索', summary: 'AI工具探索 + 考研规划', featured: true },
      { id: 'expense', icon: '💳', title: '消费支出', summary: '本月已支出 ¥3,280' },
      { id: 'poster',  icon: '🎨', title: '海报任务', summary: '2个待办任务' },
      { id: 'life',    icon: '💃', title: '生活管理', summary: '今晚核心+肩背训练' },
      { id: 'toolbox', icon: '🔧', title: 'AI工具箱', summary: '5个工具待测' },
      { id: 'finance', icon: '📰', title: '金融资讯', summary: '今日5条快讯' }
    ]
  },

  // 学习探索
  study: {
    title: '学习探索',
    subtitle: 'AI工具探索 + 考研准备',
    kaoyanCountdown: {
      examDate: '2026-12-23',
      resignDate: '2027-03',
      note: '辞职备考倒计时'
    },
    aiTools: [
      { name: 'WorkBuddy', status: '进行中', progress: 65, desc: '已搭建个人工作台，正在探索海报生成' },
      { name: 'ChatGPT', status: '进行中', progress: 40, desc: '日常对话使用，学习Prompt技巧' },
      { name: 'Codex', status: '未开始', progress: 0, desc: '待探索，关注代码辅助能力' },
      { name: 'Stable Diffusion', status: '未开始', progress: 0, desc: '待探索，关注AI绘图在海报中的应用' }
    ],
    milestones: [
      { phase: '第一阶段', title: 'AI工具摸底', status: '进行中', desc: '逐一测试各工具的核心能力' },
      { phase: '第二阶段', title: '工作流搭建', status: '未开始', desc: '选定主力工具，建立高效工作流' },
      { phase: '第三阶段', title: '考研启动', status: '未开始', desc: '确定院校专业，开始系统备考' }
    ]
  },

  // 消费支出（已清空，从0开始）
  expense: {
    title: '消费支出',
    subtitle: '从今天开始记录',
    monthTotal: 0,
    monthBudget: 5000,
    categories: [
      { name: '餐饮', amount: 0, percent: 0, icon: '🍜' },
      { name: '交通', amount: 0, percent: 0, icon: '🚇' },
      { name: '购物', amount: 0, percent: 0, icon: '🛍️' },
      { name: '舞蹈课程', amount: 0, percent: 0, icon: '💃' },
      { name: '健身', amount: 0, percent: 0, icon: '🏋️' },
      { name: '其他', amount: 0, percent: 0, icon: '📦' }
    ],
    recent: []
  },

  // 海报任务
  poster: {
    title: '海报任务',
    subtitle: '金融产品宣传',
    tasks: [
      {
        id: 'P001',
        name: '夏季理财节八折促销海报',
        type: '八折海报',
        deadline: '2026-07-30',
        status: '进行中',
        desc: '红底主视觉，突出"8折"数字，产品名称清晰，标注活动期限7月30日-8月15日'
      },
      {
        id: 'P002',
        name: '新基金发行价格海报',
        type: '价格海报',
        deadline: '2026-08-02',
        status: '待开始',
        desc: '价格数字醒目，原价划线对比，3条核心卖点，底部风险提示'
      },
      {
        id: 'P003',
        name: '7月定投优惠活动海报',
        type: '八折海报',
        deadline: '2026-07-28',
        status: '已完成',
        desc: '已完成定稿，红色渐变背景，金色折扣数字，已交付市场部'
      }
    ]
  },

  // 生活管理
  life: {
    title: '生活管理',
    subtitle: '舞蹈 · 健身 · 日程',
    today: [
      { time: '18:30-19:30', activity: '核心+肩背', location: '健身房', tag: '健身' }
    ],
    week: [
      { day: '周一', activities: [{ time: '18:30', name: '核心+肩背', type: '健身' }] },
      { day: '周二', activities: [{ time: '18:30', name: '爵士舞', type: '舞蹈' }] },
      { day: '周三', activities: [{ time: '18:30', name: '编舞', type: '舞蹈' }] },
      { day: '周四', activities: [{ time: '18:30', name: '爵士舞', type: '舞蹈' }] },
      { day: '周五', activities: [{ time: '18:30', name: '爵士舞', type: '舞蹈' }] },
      { day: '周六', activities: [{ time: '10:00', name: '核心+臀腿', type: '健身' }] },
      { day: '周日', activities: [] }
    ],
    calendar: {
      year: 2026,
      month: 7,
      activeDays: [21, 22, 23, 24, 25, 27, 28],
      activityTypes: { 21: 'fitness', 22: 'dance', 23: 'dance', 24: 'dance', 25: 'dance', 27: 'fitness', 28: 'dance' }
    },
    checkin: {
      timeSlots: [
        { time: '18:30', activity: '核心+肩背', status: 'pending', progress: 75 },
        { time: '20:00', activity: '阅读', status: 'done', progress: 100 },
        { time: '22:00', activity: '复盘', status: 'pending', progress: 0 }
      ]
    },
    learning: {
      items: [
        { name: 'AI工具测评', progress: 20 },
        { name: '考研规划', progress: 0 }
      ]
    },
    expense: {
      used: 0,
      budget: 5000,
      percent: 0
    }
  },

  // AI工具箱
  toolbox: {
    title: 'AI工具箱',
    subtitle: 'AI海报绘图工具探索',
    tools: [
      { name: 'DALL-E 3', vendor: 'OpenAI', status: '未测试', desc: '文本生成图像，擅长创意合成' },
      { name: 'Midjourney', vendor: 'Midjourney', status: '未测试', desc: '艺术风格突出，适合视觉设计' },
      { name: 'Stable Diffusion', vendor: '开源', status: '未测试', desc: '本地部署，可控性强' },
      { name: 'Adobe Firefly', vendor: 'Adobe', status: '未测试', desc: '与PS集成，商用安全' },
      { name: 'Canva AI', vendor: 'Canva', status: '未测试', desc: '模板丰富，快速出图' }
    ],
    routes: [
      { name: '路线A：快速出图', tools: 'Canva AI → DALL·E 3', progress: 0, desc: '以效率为主，快速生成可用海报' },
      { name: '路线B：风格化设计', tools: 'Midjourney → SD精修', progress: 0, desc: '以视觉质量为主，追求设计感' },
      { name: '路线C：工作流整合', tools: 'Firefly → PS联动', progress: 0, desc: '融入现有设计工作流' }
    ],
    toolGrid: [
      { name: 'Canva AI', icon: '🎨', vendor: 'Canva', url: 'https://www.canva.com' },
      { name: 'Midjourney', icon: '🤖', vendor: 'Midjourney', url: 'https://www.midjourney.com' },
      { name: 'Stable Diffusion', icon: '🖼️', vendor: '开源', url: 'https://stability.ai' },
      { name: 'Adobe Firefly', icon: '🔥', vendor: 'Adobe', url: 'https://www.adobe.com/products/firefly.html' },
      { name: 'DALL·E 3', icon: '✨', vendor: 'OpenAI', url: 'https://openai.com/dall-e-3' },
      { name: '更多工具', icon: '➕', vendor: '探索', url: 'https://www.codebuddy.cn' }
    ],
    posterCollage: [
      { title: '夏季理财节', tag: '进行中', gradient: 'from-red-900 to-yellow-900' },
      { title: '新基金发行', tag: '待开始', gradient: 'from-gray-800 to-gray-900' },
      { title: '定投优惠', tag: '已完成', gradient: 'from-yellow-900 to-black' }
    ]
  },

  // 金融资讯
  finance: {
    title: '金融资讯',
    subtitle: '每日精选快讯',
    news: [
      {
        time: '14:30',
        tag: 'A股',
        title: '沪指收涨0.86%，金融板块领涨',
        summary: '今日上证指数报3245.78点，上涨27.63点。银行、保险板块表现强势，两市成交额达8200亿元。',
        hot: true
      },
      {
        time: '13:15',
        tag: '基金',
        title: '权益类基金本周净流入超50亿',
        summary: '本周新发权益基金募集规模突破50亿元，市场风险偏好回升，科技成长方向受追捧。',
        hot: false
      },
      {
        time: '11:00',
        tag: '政策',
        title: '央行：保持流动性合理充裕',
        summary: '人民银行公开市场操作净投放1500亿元，7天逆回购利率维持1.80%不变，释放稳货币信号。',
        hot: false
      },
      {
        time: '09:30',
        tag: '理财',
        title: '银行理财收益率小幅回升',
        summary: '本周银行理财平均年化收益率回升至3.12%，固收+产品表现稳健，净值波动收窄。',
        hot: false
      },
      {
        time: '08:00',
        tag: '宏观',
        title: '6月CPI同比上涨0.2%',
        summary: '国家统计局公布6月CPI数据，同比上涨0.2%，环比下降0.1%，物价运行总体平稳。',
        hot: false
      }
    ]
  }
};
