// ============================================================
// 欣子工作台 — B-group 杂志拼贴 SPA (v2 动态版)
// ============================================================

(function () {
  'use strict';

  const app = document.getElementById('app');
  let currentRoute = 'home';

  // ---------- localStorage 数据层 ----------
  const STORAGE = {
    get(key, fallback) {
      try {
        const data = localStorage.getItem('xinzi-' + key);
        return data ? JSON.parse(data) : fallback;
      } catch (e) { return fallback; }
    },
    set(key, data) {
      try { localStorage.setItem('xinzi-' + key, JSON.stringify(data)); } catch (e) {}
    }
  };

  // ---------- 消费数据（含用户记录）----------
  function getExpenseData() {
    const d = workbenchData.expense;
    const userRecords = STORAGE.get('expense-records', []);
    const allRecords = [...d.recent, ...userRecords];
    const total = d.monthTotal + userRecords.reduce((sum, r) => sum + r.amount, 0);
    const budget = d.monthBudget;
    const percent = Math.min(100, Math.round(total / budget * 100));
    return { total, budget, percent, records: allRecords, categories: d.categories };
  }

  // ---------- 动态今日日程 ----------
  function getTodaySchedule() {
    const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const todayName = weekDays[new Date().getDay()];
    const schedule = workbenchData.life.week.find(w => w.day === todayName);
    if (!schedule) return [];
    return schedule.activities.map(a => ({
      time: a.time,
      activity: a.name,
      location: a.type === '健身' ? '健身房' : a.type === '舞蹈' ? '舞蹈室' : ''
    }));
  }

  // ---------- 动态考研倒计时 ----------
  function getExamDaysLeft() {
    const cd = workbenchData.study.kaoyanCountdown;
    const exam = new Date(cd.examDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Math.max(0, Math.ceil((exam - today) / (1000 * 60 * 60 * 24)));
  }

  // ---------- 抽屉导航 ----------
  const drawerItems = [
    { id: 'home',     icon: '⌂', name: '主页' },
    { id: 'study',    icon: '✦', name: '学习' },
    { id: 'expense',  icon: '◐', name: '消费' },
    { id: 'poster',   icon: '◈', name: '海报' },
    { id: 'life',     icon: '❖', name: '生活' },
    { id: 'toolbox',  icon: '◊', name: 'AI' },
    { id: 'finance',  icon: '◉', name: '金融' }
  ];

  function renderDrawerNav() {
    return `
      <nav class="drawer-nav">
        <div class="drawer-brand">XINZI</div>
        ${drawerItems.map(item => `
          <div class="drawer-item ${item.id === currentRoute ? 'active' : ''}" data-nav="${item.id}">
            <div class="drawer-item-icon">${item.icon}</div>
            <div class="drawer-item-name">${item.name}</div>
          </div>
        `).join('')}
      </nav>`;
  }

  // ---------- 路由 ----------
  function navigate(route) {
    currentRoute = route;
    render(route);
    window.scrollTo(0, 0);
    const page = app.querySelector('.page');
    if (page) page.scrollTop = 0;
  }

  // ---------- 渲染入口 ----------
  function render(route) {
    let body = '';
    switch (route) {
      case 'home':     body = renderHome(); break;
      case 'study':    body = renderStudy(); break;
      case 'expense':  body = renderExpense(); break;
      case 'poster':   body = renderPoster(); break;
      case 'life':     body = renderLife(); break;
      case 'toolbox':  body = renderToolbox(); break;
      case 'finance':  body = renderFinance(); break;
      default:         body = renderHome();
    }
    app.innerHTML = renderDrawerNav() + body;
    bindEvents();
  }

  // =====================================================
  // B1 首页 — 杂志拼贴（动态版）
  // =====================================================
  function renderHome() {
    const d = workbenchData.home;

    // 动态问候
    const hour = new Date().getHours();
    const greet = hour < 6 ? '凌晨好' : hour < 12 ? '上午好' : hour < 18 ? '下午好' : '晚上好';
    const dateStr = formatDate();

    // 动态今日日程
    const todaySchedule = getTodaySchedule();
    const todayItems = todaySchedule.length > 0 ? todaySchedule : d.collage.today.items;

    // 动态考研倒计时
    const examDays = getExamDaysLeft();

    // 动态支出（含用户记录）
    const expData = getExpenseData();
    const expenseTotal = expData.total.toLocaleString();
    const expensePercent = expData.percent;

    return `
      <div class="page">
        <div class="home-collage">
          <h1 class="mega-title">${d.megaTitle || 'XINZI'}</h1>

          <div class="home-greeting">
            <div class="home-greeting-text">${greet}，<span class="name">${d.userName}</span></div>
          </div>
          <div class="home-meta">今日 · ${dateStr}</div>

          <div class="collage-grid">
            <!-- TODAY 拼贴 -->
            <div class="collage-card collage-today" data-nav="life" style="animation-delay: 0ms">
              <div class="collage-label">
                <div>
                  <span class="collage-label-text">Today</span>
                  <span class="collage-label-cn">今日日程</span>
                </div>
              </div>
              <div class="timeline-mini">
                ${todayItems.map(t => `
                  <div class="timeline-mini-item">
                    <div class="timeline-mini-time">${t.time}</div>
                    <div class="timeline-mini-activity">${t.activity}</div>
                    <div class="timeline-mini-loc">${t.location || ''}</div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- FINANCE 拼贴 -->
            <div class="collage-card collage-finance" data-nav="finance" style="animation-delay: 80ms">
              <div class="collage-label">
                <div>
                  <span class="collage-label-text">Market</span>
                  <span class="collage-label-cn">快讯</span>
                </div>
              </div>
              <div class="finance-capsules">
                ${d.collage.finance.capsules.map(c => `
                  <div class="finance-capsule">
                    <span class="finance-capsule-tag">${c.tag}</span>
                    <span class="finance-capsule-text">${c.title}</span>
                    <span class="finance-capsule-percent ${c.hot ? 'percent-up' : ''}">${c.hot ? '+' : ''}</span>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- AI TOOLS 拼贴 -->
            <div class="collage-card collage-tools" data-nav="toolbox" style="animation-delay: 160ms">
              <div class="collage-label">
                <div>
                  <span class="collage-label-text">AI</span>
                  <span class="collage-label-cn">工具</span>
                </div>
              </div>
              <div class="collage-tools-content">
                ${d.collage.tools.items.map(t => `
                  <div class="tool-mini">
                    <div>${t.icon}</div>
                    <div class="tool-mini-label">${t.name}</div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- POSTER 主拼贴 -->
            <div class="collage-card collage-poster" data-nav="poster" style="animation-delay: 240ms">
              <div class="collage-label">
                <div>
                  <span class="collage-label-text">Poster</span>
                  <span class="collage-label-cn">海报任务</span>
                </div>
              </div>
              <div class="poster-mini-list">
                ${d.collage.poster.tasks.map(t => `
                  <div class="poster-mini-item">
                    <span class="poster-mini-name">${t.name}</span>
                    <div class="poster-mini-meta">
                      <span class="poster-mini-status ${t.status === '进行中' ? 'ongoing' : 'pending'}">${t.status}</span>
                      <span>${t.deadline}</span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- 拼贴副卡 — 动态数据指标 -->
            <div class="collage-card collage-poster2" style="animation-delay: 320ms">
              <div class="bigstat">¥${expenseTotal}</div>
              <div class="bigstat-label">本月已支出 · ${expensePercent}%</div>
            </div>

            <div class="collage-card collage-poster3" style="animation-delay: 400ms">
              <div class="bigstat">${examDays}天</div>
              <div class="bigstat-label">考研倒计时</div>
            </div>
          </div>

          <div class="home-footer">
            <div class="home-footer-line"></div>
            <div class="home-footer-text">XINZI WORKBENCH</div>
          </div>
        </div>
      </div>`;
  }

  // =====================================================
  // B2 生活管理 — 日历 + 学习 + 消费 + 打卡
  // =====================================================
  function renderLife() {
    const d = workbenchData.life;
    const cal = d.calendar;
    const weekdayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

    // 动态今日
    const todayDate = new Date().getDate();

    // 计算本月第一天是星期几 & 月天数
    const firstDay = new Date(cal.year, cal.month - 1, 1).getDay();
    const daysInMonth = new Date(cal.year, cal.month, 0).getDate();

    let cells = '';
    for (let i = 0; i < firstDay; i++) {
      cells += '<div class="calendar-day empty"></div>';
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const isToday = day === todayDate;
      const activeType = cal.activityTypes[day];
      const cls = ['calendar-day'];
      if (isToday) cls.push('today');
      else if (activeType === 'dance') cls.push('active-dance');
      else if (activeType === 'fitness') cls.push('active-fitness');
      cells += `<div class="${cls.join(' ')}">${day}</div>`;
    }

    const expensePercent = d.expense.percent;
    const used = d.expense.used.toLocaleString();
    const budget = d.expense.budget.toLocaleString();
    const primarySlot = d.checkin.timeSlots[0];

    return `
      <div class="page">
        <div class="life-page">
          <div class="life-header">
            <h2 class="section-title-xl">LIFE</h2>
            <div class="life-header-cn">生活管理</div>
          </div>

          <div class="calendar-widget">
            <div class="calendar-month">
              <div class="calendar-month-name">${cal.month}月</div>
              <div class="calendar-month-year">${cal.year}</div>
            </div>
            <div class="calendar-grid">
              ${weekdayNames.map(w => `<div class="calendar-weekday">${w}</div>`).join('')}
              ${cells}
            </div>
          </div>

          <div class="life-info-card">
            <div class="life-info-header">
              <div>
                <span class="life-info-title">Learning</span>
                <span class="life-info-title-cn">学习进度</span>
              </div>
              <span class="life-info-meta">${d.learning.items.filter(i => i.progress > 0).length}/${d.learning.items.length}</span>
            </div>
            ${d.learning.items.map(it => `
              <div class="life-progress-row">
                <span class="life-progress-name">${it.name}</span>
                <span class="life-progress-value">${it.progress}%</span>
              </div>
              <div class="life-progress-bar">
                <div class="life-progress-fill" style="width: ${it.progress}%"></div>
              </div>
            `).join('')}
          </div>

          <div class="life-info-card">
            <div class="life-info-header">
              <div>
                <span class="life-info-title">Expense</span>
                <span class="life-info-title-cn">消费支出</span>
              </div>
              <span class="life-info-meta">本月</span>
            </div>
            <div class="expense-summary">
              <span class="expense-amount">¥${used}</span>
              <span class="expense-total">/ ¥${budget}</span>
            </div>
            <div class="life-progress-bar">
              <div class="life-progress-fill" style="width: ${expensePercent}%"></div>
            </div>
          </div>

          <div class="life-info-card">
            <div class="life-info-header">
              <div>
                <span class="life-info-title">Today</span>
                <span class="life-info-title-cn">今日打卡</span>
              </div>
            </div>
            <div class="today-checkin">
              <div class="circle-indicator" style="--progress: ${primarySlot.progress}">
                <div class="circle-indicator-content">
                  <div class="circle-indicator-time">${primarySlot.time.split('-')[0]}</div>
                  <div class="circle-indicator-label">${primarySlot.activity}</div>
                </div>
              </div>
              <div class="checkin-info">
                <div class="checkin-activity">${primarySlot.activity}</div>
                <div class="checkin-location">${primarySlot.time}</div>
                <button class="checkin-btn">打卡</button>
              </div>
            </div>
          </div>
        </div>
      </div>`;
  }

  // =====================================================
  // B3 AI 工具箱 — 2x3 可点击网格 + 海报拼贴
  // =====================================================
  function renderToolbox() {
    const d = workbenchData.toolbox;

    return `
      <div class="page">
        <div class="toolbox-page">
          <div class="toolbox-avatar">⌂</div>

          <div class="toolbox-header">
            <h2 class="section-title-xl">AI TOOLS</h2>
            <div class="toolbox-header-cn">海报AI</div>
          </div>

          <!-- 2x3 可点击工具网格 -->
          <div class="tool-grid-6">
            ${d.toolGrid.map((t, i) => {
              const content = `
                <div class="tool-btn-icon">${t.icon}</div>
                <div class="tool-btn-name">${t.name}</div>
                <div class="tool-btn-vendor">${t.vendor}</div>`;
              return t.url
                ? `<a href="${t.url}" target="_blank" rel="noopener" class="tool-btn-6" style="animation-delay: ${i * 60}ms">${content}</a>`
                : `<div class="tool-btn-6" style="animation-delay: ${i * 60}ms">${content}</div>`;
            }).join('')}
          </div>

          <div class="poster-collage-label">
            <span>Poster</span>
            <span class="poster-collage-label-cn">海报任务</span>
          </div>
          <div class="poster-collage-section">
            ${d.posterCollage.slice(0, 2).map((p, i) => `
              <div class="poster-collage-card pc-${i + 1}">
                <span class="poster-collage-tag">${p.tag}</span>
                <div class="poster-collage-arrow">↗</div>
                <div class="poster-collage-content">
                  <div class="poster-collage-title">${p.title}</div>
                  <div class="poster-collage-desc">用AI生成专业海报</div>
                </div>
              </div>
            `).join('')}
          </div>

          <div class="toolbox-routes">
            <div class="list-section-title" style="padding-left: 0;">Routes · 路线</div>
            ${d.routes.map(r => `
              <div class="route-card-mini" data-nav="poster">
                <div class="route-name-mini">${r.name}</div>
                <div class="route-tools-mini">${r.tools}</div>
              </div>
            `).join('')}
          </div>

          <button class="gold-btn-fixed">生成海报</button>
        </div>
      </div>`;
  }

  // =====================================================
  // 其余四页
  // =====================================================
  function topbar(title, subtitle) {
    return `
      <div class="topbar">
        <div class="topbar-row">
          <div class="topbar-title">
            <h1>${title}</h1>
            <div class="subtitle">${subtitle}</div>
          </div>
        </div>
      </div>`;
  }

  function renderStudy() {
    const d = workbenchData.study;
    const cd = d.kaoyanCountdown;
    const examDays = getExamDaysLeft();

    return `
      <div class="page">
        <div class="list-page-wrap">
          ${topbar(d.title, d.subtitle)}
          <div class="list-section">
            <div class="countdown-card">
              <div class="countdown-label">考研初试倒计时</div>
              <div class="countdown-number">${examDays}<span class="countdown-unit">天</span></div>
              <div class="countdown-note">初试 ${cd.examDate} · ${cd.note}</div>
            </div>

            <div class="list-section-title">AI工具学习</div>
            ${d.aiTools.map((t, i) => {
              const stClass = t.status === '进行中' ? 'status-active'
                : t.status === '已掌握' ? 'status-done'
                : 'status-pending';
              return `
                <div class="list-item" style="animation-delay:${i * 60}ms">
                  <div class="progress-item">
                    <div class="progress-header">
                      <span class="progress-name">${t.name}</span>
                      <span class="progress-percent">${t.progress}%</span>
                    </div>
                    <div class="progress-bar-bg">
                      <div class="progress-bar-fill" style="width:${t.progress}%"></div>
                    </div>
                    <div class="progress-desc">${t.desc}</div>
                    <div style="margin-top:8px"><span class="status-badge ${stClass}">${t.status}</span></div>
                  </div>
                </div>`;
            }).join('')}

            <div class="list-section-title">学习里程碑</div>
            ${d.milestones.map((m, i) => {
              const dotClass = m.status === '已完成' ? 'done'
                : m.status === '进行中' ? 'active'
                : 'pending';
              return `
                <div class="list-item milestone-card" style="animation-delay:${i * 60}ms">
                  <div class="milestone-dot ${dotClass}"></div>
                  <div class="milestone-content">
                    <div class="milestone-phase">${m.phase}</div>
                    <div class="milestone-title">${m.title}</div>
                    <div class="milestone-desc">${m.desc}</div>
                    <div style="margin-top:6px"><span class="status-badge ${m.status === '进行中' ? 'status-active' : m.status === '已完成' ? 'status-done' : 'status-pending'}">${m.status}</span></div>
                  </div>
                </div>`;
            }).join('')}
          </div>
        </div>
      </div>`;
  }

  function renderExpense() {
    const d = getExpenseData();
    const remaining = d.budget - d.total;
    const usedPercent = d.percent;

    // 按分类汇总
    const catMap = {};
    d.categories.forEach(c => { catMap[c.name] = { icon: c.icon, name: c.name, amount: 0, percent: 0 }; });
    d.records.forEach(r => {
      if (catMap[r.category]) catMap[r.category].amount += r.amount;
    });
    // 重新算分类占比
    const catList = Object.values(catMap).map(c => ({
      ...c,
      percent: d.total > 0 ? Math.round(c.amount / d.total * 100) : 0
    }));

    // 检查今日是否已有消费记录
    const todayStr = formatDate();
    const hasTodayRecord = d.records.some(r => r.date === todayStr);
    const isLate = new Date().getHours() >= 21;
    const reminderBanner = !hasTodayRecord
      ? `<div class="expense-reminder ${isLate ? 'urgent' : ''}">
          <span>${isLate ? '🔔 今天还没记账！' : '📝 今天还没记录消费'}</span>
        </div>`
      : '';

    return `
      <div class="page">
        <div class="list-page-wrap">
          ${topbar(workbenchData.expense.title, workbenchData.expense.subtitle)}
          <div class="list-section">
            <div class="countdown-card">
              <div class="countdown-label">本月已支出</div>
              <div class="countdown-number">¥${d.total.toLocaleString()}</div>
              <div class="countdown-note">预算 ¥${d.budget.toLocaleString()} · 剩余 ¥${remaining.toLocaleString()}</div>
              <div class="progress-bar-bg" style="margin-top:14px">
                <div class="progress-bar-fill" style="width:${usedPercent}%"></div>
              </div>
              <div style="font-size:11px;color:var(--text-faint);margin-top:6px">已用 ${usedPercent}%</div>
            </div>

            ${reminderBanner}

            <div class="list-section-title" style="display:flex;justify-content:space-between;align-items:center;">
              <span>分类支出</span>
              <button class="poster-add-btn" id="show-add-expense">＋ 快速记录</button>
            </div>
            ${catList.map((c, i) => `
              <div class="list-item" style="animation-delay:${i * 60}ms">
                <div class="progress-item">
                  <div class="progress-header">
                    <span class="progress-name">${c.icon || '📦'} ${c.name}</span>
                    <span class="progress-percent">¥${c.amount}</span>
                  </div>
                  <div class="progress-bar-bg">
                    <div class="progress-bar-fill" style="width:${c.percent}%"></div>
                  </div>
                  <div class="progress-desc">占比 ${c.percent}%</div>
                </div>
              </div>
            `).join('')}

            <div class="list-section-title">最近记录</div>
            ${d.records.slice(0, 15).map((r, i) => `
              <div class="list-item" style="display:flex;align-items:center;justify-content:space-between;animation-delay:${i * 60}ms">
                <div>
                  <div style="font-size:13px;font-weight:500;color:var(--text-primary)">${r.name}</div>
                  <div style="font-size:11px;color:var(--text-faint);margin-top:2px">${r.date || formatDate()} · ${r.category}</div>
                </div>
                <div style="font-size:14px;font-weight:600;color:var(--gold)">-¥${r.amount}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
      <!-- 快速记录模态框 -->
      <div class="modal-overlay" id="expense-modal" style="display:none">
        <div class="modal-content">
          <div class="modal-header">
            <span>快速记录</span>
            <span class="modal-close" id="expense-modal-close">✕</span>
          </div>
          <div class="modal-body">
            <input class="modal-input" id="expense-amount" type="number" inputmode="decimal" placeholder="金额（元）" min="0" step="0.01" />
            <select class="modal-select" id="expense-category">
              <option value="餐饮">🍜 餐饮</option>
              <option value="交通">🚇 交通</option>
              <option value="购物">🛍️ 购物</option>
              <option value="舞蹈课程">💃 舞蹈课程</option>
              <option value="健身">🏋️ 健身</option>
              <option value="其他">📦 其他</option>
            </select>
            <input class="modal-input" id="expense-name" placeholder="买了什么（选填）" />
            <button class="modal-submit" id="expense-submit">记录</button>
          </div>
        </div>
      </div>`;
  }

  // =====================================================
  // 海报任务 — 支持新建 + localStorage 持久化
  // =====================================================
  function renderPoster() {
    const d = workbenchData.poster;
    // 优先读取 localStorage 中的用户任务
    const userTasks = STORAGE.get('poster-tasks', []);
    const allTasks = [...d.tasks, ...userTasks];

    return `
      <div class="page">
        <div class="list-page-wrap">
          ${topbar(d.title, d.subtitle)}
          <div class="list-section">
            <div class="list-section-title" style="display:flex;justify-content:space-between;align-items:center;">
              <span>任务列表</span>
              <button class="poster-add-btn" id="show-add-task">＋ 新建</button>
            </div>
            ${allTasks.map((t, i) => {
              const statusClass = t.status === '待开始' ? 'status-pending'
                : t.status === '进行中' ? 'status-active'
                : 'status-done';
              return `
                <div class="list-item task-card" style="animation-delay:${i * 60}ms">
                  <div class="task-header">
                    <div class="task-name">${t.name}</div>
                    <span class="task-type">${t.type || '其他'}</span>
                  </div>
                  <div class="task-desc">${t.desc || '暂无描述'}</div>
                  <div class="task-footer">
                    <span class="task-deadline">截止 ${t.deadline}</span>
                    <span class="status-badge ${statusClass}">${t.status}</span>
                  </div>
                </div>`;
            }).join('')}
          </div>
        </div>
      </div>
      <!-- 新建任务模态框 -->
      <div class="modal-overlay" id="task-modal" style="display:none">
        <div class="modal-content">
          <div class="modal-header">
            <span>新建任务</span>
            <span class="modal-close" id="modal-close">✕</span>
          </div>
          <div class="modal-body">
            <input class="modal-input" id="task-name" placeholder="任务名称" />
            <select class="modal-select" id="task-type">
              <option value="八折海报">八折海报</option>
              <option value="价格海报">价格海报</option>
              <option value="其他">其他</option>
            </select>
            <input class="modal-input" id="task-deadline" type="date" placeholder="截止日期" />
            <textarea class="modal-textarea" id="task-desc" placeholder="任务描述（选填）"></textarea>
            <button class="modal-submit" id="task-submit">创建任务</button>
          </div>
        </div>
      </div>`;
  }

  function renderFinance() {
    const d = workbenchData.finance;
    return `
      <div class="page">
        <div class="list-page-wrap">
          ${topbar(d.title, d.subtitle)}
          <div class="list-section">
            <div class="list-section-title">今日快讯</div>
            ${d.news.map((n, i) => `
              <div class="list-item news-card" style="animation-delay:${i * 60}ms">
                <div class="news-header">
                  <span class="news-tag">${n.tag}</span>
                  ${n.hot ? '<span class="news-hot">●</span>' : ''}
                  <span class="news-time">${n.time}</span>
                </div>
                <div class="news-title">${n.title}</div>
                <div class="news-summary">${n.summary}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>`;
  }

  // ---------- 格式化日期 ----------
  function formatDate() {
    const days = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
    const d = new Date();
    return `${d.getMonth() + 1}月${d.getDate()}日 ${days[d.getDay()]}`;
  }

  // ---------- 事件绑定 ----------
  function bindEvents() {
    // 导航点击
    app.querySelectorAll('[data-nav]').forEach(el => {
      el.addEventListener('click', function (e) {
        e.stopPropagation();
        const route = this.getAttribute('data-nav');
        navigate(route);
      });
    });

    // 新建任务 — 显示模态框
    const addBtn = document.getElementById('show-add-task');
    if (addBtn) {
      addBtn.addEventListener('click', function () {
        const modal = document.getElementById('task-modal');
        if (modal) modal.style.display = 'flex';
      });
    }

    // 关闭模态框
    const closeBtn = document.getElementById('modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', function () {
        const modal = document.getElementById('task-modal');
        if (modal) modal.style.display = 'none';
      });
    }

    // 点击遮罩关闭
    const modal = document.getElementById('task-modal');
    if (modal) {
      modal.addEventListener('click', function (e) {
        if (e.target === this) this.style.display = 'none';
      });
    }

    // 提交新建任务
    const submitBtn = document.getElementById('task-submit');
    if (submitBtn) {
      submitBtn.addEventListener('click', function () {
        const name = document.getElementById('task-name').value.trim();
        if (!name) { alert('请输入任务名称'); return; }
        const type = document.getElementById('task-type').value;
        const deadline = document.getElementById('task-deadline').value || '待定';
        const desc = document.getElementById('task-desc').value.trim() || '暂无描述';

        const newTask = {
          id: 'U' + Date.now(),
          name: name,
          type: type,
          deadline: deadline,
          status: '待开始',
          desc: desc
        };

        const existing = STORAGE.get('poster-tasks', []);
        existing.push(newTask);
        STORAGE.set('poster-tasks', existing);

        document.getElementById('task-modal').style.display = 'none';
        navigate('poster');
      });
    }

    // ---------- 消费快速记录 ----------
    const addExpenseBtn = document.getElementById('show-add-expense');
    if (addExpenseBtn) {
      addExpenseBtn.addEventListener('click', function () {
        const modal = document.getElementById('expense-modal');
        if (modal) modal.style.display = 'flex';
      });
    }

    const expenseCloseBtn = document.getElementById('expense-modal-close');
    if (expenseCloseBtn) {
      expenseCloseBtn.addEventListener('click', function () {
        const modal = document.getElementById('expense-modal');
        if (modal) modal.style.display = 'none';
      });
    }

    const expenseModal = document.getElementById('expense-modal');
    if (expenseModal) {
      expenseModal.addEventListener('click', function (e) {
        if (e.target === this) this.style.display = 'none';
      });
    }

    const expenseSubmitBtn = document.getElementById('expense-submit');
    if (expenseSubmitBtn) {
      expenseSubmitBtn.addEventListener('click', function () {
        const amountInput = document.getElementById('expense-amount');
        const amount = parseFloat(amountInput.value);
        if (!amount || amount <= 0) { alert('请输入金额'); return; }
        const category = document.getElementById('expense-category').value;
        const name = document.getElementById('expense-name').value.trim() || category + '消费';

        const record = {
          id: 'E' + Date.now(),
          date: formatDate(),
          name: name,
          category: category,
          amount: amount
        };

        const existing = STORAGE.get('expense-records', []);
        existing.push(record);
        STORAGE.set('expense-records', existing);

        document.getElementById('expense-modal').style.display = 'none';
        navigate('expense');
      });
    }
  }

  // ---------- 启动 ----------
  render('home');

})();
