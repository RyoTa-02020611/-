let stocks = [];
let briefHeadlines = [];
let insightItems = [];
let communityFeed = [];
let sessions = [];
let sparklineData = [];
let sparklineMeta = { label: '世界株式指数' };

const fallbackDashboard = Object.freeze({
  watchlist: [
    {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      price: 191.62,
      change: 1.38,
      changePercent: 0.73,
      volatility: '中',
      volume: 58792145,
      marketCap: '2.97T',
      sentiment: 'positive',
      sector: 'Tech',
    },
    {
      symbol: 'MSFT',
      name: 'Microsoft Corp.',
      price: 415.12,
      change: -2.07,
      changePercent: -0.5,
      volatility: '低',
      volume: 24650811,
      marketCap: '3.10T',
      sentiment: 'neutral',
      sector: 'Tech',
    },
    {
      symbol: 'NVDA',
      name: 'NVIDIA Corp.',
      price: 894.32,
      change: 16.43,
      changePercent: 1.87,
      volatility: '高',
      volume: 48600751,
      marketCap: '2.24T',
      sentiment: 'positive',
      sector: 'Tech',
    },
    {
      symbol: 'GOOGL',
      name: 'Alphabet Inc. Class A',
      price: 154.19,
      change: -0.94,
      changePercent: -0.61,
      volatility: '中',
      volume: 20114709,
      marketCap: '1.92T',
      sentiment: 'neutral',
      sector: 'Tech',
    },
    {
      symbol: 'JPM',
      name: 'JPMorgan Chase & Co.',
      price: 197.25,
      change: 2.86,
      changePercent: 1.47,
      volatility: '低',
      volume: 9312456,
      marketCap: '571B',
      sentiment: 'positive',
      sector: 'Finance',
    },
    {
      symbol: 'MA',
      name: 'Mastercard Inc.',
      price: 463.72,
      change: 3.91,
      changePercent: 0.85,
      volatility: '中',
      volume: 3819054,
      marketCap: '436B',
      sentiment: 'positive',
      sector: 'Finance',
    },
    {
      symbol: 'TSLA',
      name: 'Tesla Inc.',
      price: 206.41,
      change: 4.65,
      changePercent: 2.3,
      volatility: '高',
      volume: 61249087,
      marketCap: '657B',
      sentiment: 'positive',
      sector: 'Energy',
    },
    {
      symbol: 'XOM',
      name: 'Exxon Mobil Corp.',
      price: 113.58,
      change: -0.73,
      changePercent: -0.64,
      volatility: '中',
      volume: 20411509,
      marketCap: '461B',
      sentiment: 'neutral',
      sector: 'Energy',
    },
    {
      symbol: 'NEE',
      name: 'NextEra Energy Inc.',
      price: 72.44,
      change: 1.11,
      changePercent: 1.56,
      volatility: '中',
      volume: 13490876,
      marketCap: '149B',
      sentiment: 'positive',
      sector: 'Energy',
    },
    {
      symbol: 'UNH',
      name: 'UnitedHealth Group Inc.',
      price: 514.06,
      change: -3.42,
      changePercent: -0.66,
      volatility: '低',
      volume: 2864155,
      marketCap: '478B',
      sentiment: 'neutral',
      sector: 'Healthcare',
    },
  ],
  headlines: [
    {
      title: '米国株概況',
      detail: 'NYダウは小幅続伸。半導体と金融が市場をけん引',
      tone: 'positive',
    },
    {
      title: '欧州セッション',
      detail: 'ECBの議事要旨公表を控え、主要指数は横ばい推移',
      tone: 'neutral',
    },
    {
      title: 'アジア市場',
      detail: '日経平均は反落も、TOPIXは年初来高値を維持',
      tone: 'neutral',
    },
  ],
  insights: [
    {
      title: 'NVIDIA、データセンター需要が想定を上回る',
      summary:
        '北米ハイパースケーラー向け受注が過去最高を更新。FY25の売上高ガイダンスを上方修正。',
      confidence: 88,
    },
    {
      title: '再生可能エネルギー銘柄に資金回帰',
      summary: 'NEEを中心としたクリーン電力企業が米国の税制優遇で買い直される。',
      confidence: 74,
    },
    {
      title: 'メガバンクの自己資本比率が改善',
      summary: 'JPMとMAが資本効率を高め、配当利回りも3%台を堅持。',
      confidence: 69,
    },
  ],
  community: [
    {
      author: 'Hinata · Tech Growth',
      mood: '🟢 強気',
      post: 'NVDAの週次RSIがまだ60台。短期押し目を拾っていく予定です。',
      time: '3 分前',
    },
    {
      author: 'Akira · Income',
      mood: '🧠 ニュートラル',
      post: 'NEEを毎月積立中。配電網アップグレード需要でEPSの上振れに期待。',
      time: '11 分前',
    },
    {
      author: 'Maya · Macro',
      mood: '🌱 長期',
      post: 'ドル高一服でEM ETFを追加。リスクパリティでヘッジを入れています。',
      time: '28 分前',
    },
  ],
  sessions: [
    {
      title: '米国株決算ナイト: 4月セッション',
      mentor: 'Guest: Naomi Takeda (Equity Strategist)',
      schedule: '本日 20:00',
    },
    {
      title: 'AIセクターの本質価値を探る',
      mentor: 'Mentor: Kota Ishii',
      schedule: '木曜 19:30',
    },
    {
      title: '配当ポートフォリオのアップデート術',
      mentor: 'Mentor: Daniel Park',
      schedule: '土曜 11:00',
    },
  ],
  sparkline: {
    label: 'MSCI ACWI (10日間)',
    series: [100, 101, 102, 103, 102, 104, 106, 108, 109, 110.2],
  },
});

async function fetchJSON(url) {
  const response = await fetch(url, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Failed to load ${url}: ${response.status}`);
  }
  return response.json();
}

function showDataStatus(message, variant) {
  const status = document.getElementById('data-status');
  if (!status) {
    return;
  }

  status.textContent = message;
  status.classList.remove('is-success', 'is-warning');

  if (variant === 'success') {
    status.classList.add('is-success');
  } else if (variant === 'warning') {
    status.classList.add('is-warning');
  }
}

function applyDashboardData(data) {
  stocks = Array.isArray(data.watchlist) ? data.watchlist : [];
  briefHeadlines = Array.isArray(data.headlines) ? data.headlines : [];
  insightItems = Array.isArray(data.insights) ? data.insights : [];
  communityFeed = Array.isArray(data.community) ? data.community : [];
  sessions = Array.isArray(data.sessions) ? data.sessions : [];
  sparklineData = Array.isArray(data.sparkline?.series) ? data.sparkline.series : [];
  sparklineMeta = {
    label: data.sparkline?.label || '世界株式指数',
  };
}

async function loadDashboardData() {
  try {
    const liveData = await fetchJSON('data/dashboard.json');
    applyDashboardData(liveData);
    showDataStatus('最新のマーケットデータを表示中', 'success');
  } catch (error) {
    console.error('ライブデータの取得に失敗しました', error);
    applyDashboardData(fallbackDashboard);
    showDataStatus('ライブデータを取得できませんでした。サンプルを表示しています。', 'warning');
  }
}

const formatter = new Intl.NumberFormat('ja-JP', { maximumFractionDigits: 0 });
const priceFormatter = new Intl.NumberFormat('ja-JP', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
});

const state = {
  sector: 'all',
  search: '',
};

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function formatChange(change, changePercent) {
  const direction = changePercent > 0 ? '+' : '';
  return `${direction}${change.toFixed(2)} (${direction}${changePercent.toFixed(2)}%)`;
}

function createSentimentBadge(sentiment) {
  const badge = document.createElement('span');
  badge.className = `badge ${sentiment}`;
  badge.textContent =
    sentiment === 'positive'
      ? '強気'
      : sentiment === 'negative'
      ? '弱気'
      : 'フラット';
  return badge;
}

function renderWatchlist() {
  const tbody = document.getElementById('watchlist-body');
  tbody.innerHTML = '';

  const filtered = stocks.filter((stock) => {
    const sectorMatch = state.sector === 'all' || stock.sector === state.sector;
    const searchLower = state.search.toLowerCase();
    const queryMatch =
      !state.search ||
      stock.symbol.toLowerCase().includes(searchLower) ||
      stock.name.toLowerCase().includes(searchLower);
    return sectorMatch && queryMatch;
  });

  if (!filtered.length) {
    const emptyRow = document.createElement('tr');
    emptyRow.innerHTML =
      '<td class="empty-state" colspan="8">該当する銘柄がありません。条件を調整してください。</td>';
    tbody.appendChild(emptyRow);
    return;
  }

  filtered.forEach((stock) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>
        <div class="stock-name">
          <strong>${stock.symbol}</strong>
          <span>${stock.name}</span>
        </div>
      </td>
      <td>${priceFormatter.format(stock.price)}</td>
      <td class="${stock.changePercent >= 0 ? 'text-positive' : 'text-negative'}">
        ${formatChange(stock.change, stock.changePercent)}
      </td>
      <td>${stock.volatility}</td>
      <td>${formatter.format(stock.volume)}</td>
      <td>${stock.marketCap}</td>
      <td></td>
      <td><button class="watch-action" type="button">取引</button></td>
    `;

    const sentimentCell = row.children[6];
    sentimentCell.appendChild(createSentimentBadge(stock.sentiment));

    tbody.appendChild(row);
  });
}

function updateMetrics() {
  const leaderElement = document.getElementById('metric-leader');
  const volatilityElement = document.getElementById('metric-volatility');
  const aiElement = document.getElementById('metric-ai');

  if (!stocks.length) {
    leaderElement.textContent = '—';
    volatilityElement.textContent = '—';
    aiElement.textContent = '—';
    return;
  }

  const leader = stocks.reduce((best, stock) => {
    if (!best || stock.changePercent > best.changePercent) {
      return stock;
    }
    return best;
  }, null);

  leaderElement.textContent = `${leader.symbol} ${leader.changePercent.toFixed(2)}%`;

  const avgVolatility = stocks.reduce((sum, stock) => {
    return sum + (stock.volatility === '高' ? 3 : stock.volatility === '中' ? 2 : 1);
  }, 0);
  const normalized = avgVolatility / stocks.length;
  const volatilityLabel = normalized > 2 ? 'アクティブ' : normalized > 1.4 ? 'バランス' : '落ち着き';
  volatilityElement.textContent = volatilityLabel;

  const aiScore = clamp(Math.round(72 + Math.sin(Date.now() / 100000) * 12), 60, 88);
  aiElement.textContent = `${aiScore} / 100`;
}

function renderBrief() {
  const container = document.getElementById('brief-container');
  container.innerHTML = '';

  briefHeadlines.forEach((item) => {
    const div = document.createElement('div');
    div.className = `brief-item ${item.tone}`;
    div.innerHTML = `
      <strong>${item.title}</strong>
      <span>${item.detail}</span>
    `;
    container.appendChild(div);
  });
}

function renderSparkline() {
  const path = document.getElementById('sparkline-path');
  const legend = document.getElementById('sparkline-legend');
  const deltaChip = document.getElementById('sparkline-delta');
  const card = document.getElementById('sparkline-card');

  const width = 300;
  const height = 120;
  const max = Math.max(...sparklineData);
  const min = Math.min(...sparklineData);

  if (!sparklineData.length || !Number.isFinite(max) || !Number.isFinite(min)) {
    path.removeAttribute('d');
    legend.innerHTML = '<span>指数データを取得できませんでした</span>';
    if (deltaChip) {
      deltaChip.textContent = '0.00%';
      deltaChip.classList.remove('success', 'warning');
    }
    card?.setAttribute('data-trend', 'flat');
    return;
  }

  const points = sparklineData
    .map((value, index) => {
      const x = sparklineData.length === 1 ? width / 2 : (index / (sparklineData.length - 1)) * width;
      const normalized = (value - min) / (max - min || 1);
      const y = height - normalized * (height - 20) - 10;
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');

  path.setAttribute('d', `M ${points}`);

  const first = sparklineData[0];
  const last = sparklineData[sparklineData.length - 1];
  const delta = first ? ((last - first) / first) * 100 : 0;

  if (deltaChip) {
    deltaChip.textContent = `${delta >= 0 ? '+' : ''}${delta.toFixed(2)}%`;
    deltaChip.classList.remove('success', 'warning');
    deltaChip.classList.add(delta >= 0 ? 'success' : 'warning');
  }

  card?.setAttribute('data-trend', delta > 0 ? 'up' : delta < 0 ? 'down' : 'flat');

  legend.innerHTML = `
    <span>${sparklineMeta.label}</span>
    <span>${first.toFixed(1)} → ${last.toFixed(1)}</span>
  `;
}

function renderInsights() {
  const container = document.getElementById('insight-feed');
  container.innerHTML = '';

  insightItems.forEach((item) => {
    const card = document.createElement('article');
    card.className = 'insight-card';
    card.innerHTML = `
      <header>
        <h3>${item.title}</h3>
        <span class="badge positive">信頼度 ${item.confidence}%</span>
      </header>
      <p>${item.summary}</p>
    `;
    container.appendChild(card);
  });
}

function renderCommunity() {
  const list = document.getElementById('community-feed');
  list.innerHTML = '';

  communityFeed.forEach((item) => {
    const li = document.createElement('li');
    li.className = 'pulse-card';
    li.innerHTML = `
      <header>
        <h3>${item.author}</h3>
        <span>${item.mood}</span>
      </header>
      <p>${item.post}</p>
      <div class="pulse-meta">
        <span>⏱ ${item.time}</span>
        <span>💬 反応を追加</span>
      </div>
    `;
    list.appendChild(li);
  });
}

function renderSessions() {
  const grid = document.getElementById('session-grid');
  grid.innerHTML = '';

  sessions.forEach((session) => {
    const article = document.createElement('article');
    article.className = 'session-card';
    article.innerHTML = `
      <h3>${session.title}</h3>
      <p>${session.mentor}</p>
      <footer>
        <span>${session.schedule}</span>
        <button class="secondary" type="button">登録</button>
      </footer>
    `;
    grid.appendChild(article);
  });
}

function updateMarketTime() {
  const now = new Date();
  const timeElement = document.getElementById('market-time');
  const formatted = now.toLocaleTimeString('ja-JP', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  timeElement.textContent = formatted;
}

function registerNavInteractions() {
  const navButtons = document.querySelectorAll('.nav-chip');
  navButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const target = document.getElementById(button.dataset.target);
      target?.scrollIntoView({ behavior: 'smooth', block: 'start' });

      navButtons.forEach((btn) => btn.classList.remove('is-active'));
      button.classList.add('is-active');
    });
  });
}

function registerFilters() {
  const chips = document.querySelectorAll('.chip-group .chip');
  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      chips.forEach((c) => c.classList.remove('is-active'));
      chip.classList.add('is-active');
      state.sector = chip.dataset.sector;
      renderWatchlist();
    });
  });

  const searchInput = document.getElementById('watchlist-search');
  searchInput.addEventListener('input', (event) => {
    state.search = event.target.value.trim();
    renderWatchlist();
  });
}

function registerThemeToggle() {
  const toggle = document.getElementById('theme-toggle');
  toggle.addEventListener('click', () => {
    const isLight = document.body.classList.toggle('theme-light');
    document.body.classList.toggle('theme-dark', !isLight);
    toggle.querySelector('.icon').textContent = isLight ? '☾' : '☀︎';
  });
}

async function hydrate() {
  document.body.classList.add('theme-dark');
  registerNavInteractions();
  registerFilters();
  registerThemeToggle();

  await loadDashboardData();

  renderWatchlist();
  updateMetrics();
  renderBrief();
  renderSparkline();
  renderInsights();
  renderCommunity();
  renderSessions();

  updateMarketTime();
  setInterval(updateMarketTime, 1000);
}

document.addEventListener('DOMContentLoaded', () => {
  hydrate().catch((error) => {
    console.error('初期化に失敗しました', error);
    applyDashboardData(fallbackDashboard);
    renderWatchlist();
    updateMetrics();
    renderBrief();
    renderSparkline();
    renderInsights();
    renderCommunity();
    renderSessions();
    showDataStatus('初期化に失敗したためサンプルデータを表示しています。', 'warning');
    updateMarketTime();
    setInterval(updateMarketTime, 1000);
  });
});
