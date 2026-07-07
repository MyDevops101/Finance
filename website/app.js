const indices = [
  { name: "S&P 500", symbol: "SPY", price: 6128.34, changePct: 0.53, spark: [6040, 6068, 6058, 6091, 6088, 6110, 6128] },
  { name: "Dow Jones", symbol: "DIA", price: 44924.15, changePct: 0.2, spark: [44720, 44798, 44812, 44740, 44866, 44892, 44924] },
  { name: "Nasdaq", symbol: "QQQ", price: 20744.09, changePct: 0.95, spark: [20380, 20448, 20510, 20502, 20611, 20685, 20744] },
  { name: "Russell 2000", symbol: "IWM", price: 2264.88, changePct: -0.5, spark: [2298, 2288, 2274, 2281, 2269, 2273, 2265] },
  { name: "Bitcoin", symbol: "BTC", price: 117842.2, changePct: 1.65, spark: [113400, 114870, 115320, 116140, 115780, 117110, 117842] },
  { name: "Ethereum", symbol: "ETH", price: 6420.34, changePct: -0.6, spark: [6501, 6478, 6422, 6408, 6388, 6440, 6420] }
];

const sectors = [
  { sector: "Technology", oneDay: 1.28 },
  { sector: "Financials", oneDay: 0.42 },
  { sector: "Industrials", oneDay: -0.18 },
  { sector: "Energy", oneDay: -1.1 },
  { sector: "Health Care", oneDay: 0.08 },
  { sector: "Consumer", oneDay: 0.74 },
  { sector: "Utilities", oneDay: -0.36 },
  { sector: "Real Estate", oneDay: -0.52 }
];

const equities = [
  { symbol: "NVDA", name: "NVIDIA Corporation", sector: "Technology", price: 178.42, changePct: 2.14, quantScore: 92, sentiment: 81 },
  { symbol: "MSFT", name: "Microsoft Corporation", sector: "Technology", price: 512.66, changePct: 0.84, quantScore: 88, sentiment: 74 },
  { symbol: "AAPL", name: "Apple Inc.", sector: "Technology", price: 226.19, changePct: -0.22, quantScore: 71, sentiment: 59 },
  { symbol: "AMZN", name: "Amazon.com Inc.", sector: "Consumer", price: 219.35, changePct: 1.18, quantScore: 84, sentiment: 76 },
  { symbol: "JPM", name: "JPMorgan Chase & Co.", sector: "Financials", price: 288.12, changePct: 0.34, quantScore: 77, sentiment: 66 },
  { symbol: "LLY", name: "Eli Lilly and Company", sector: "Health Care", price: 914.52, changePct: -0.61, quantScore: 79, sentiment: 69 },
  { symbol: "XOM", name: "Exxon Mobil Corporation", sector: "Energy", price: 112.9, changePct: -1.44, quantScore: 45, sentiment: 38 },
  { symbol: "SHOP", name: "Shopify Inc.", sector: "Technology", price: 94.22, changePct: 2.72, quantScore: 82, sentiment: 73 },
  { symbol: "ASML", name: "ASML Holding N.V.", sector: "Technology", price: 1040.65, changePct: 1.08, quantScore: 80, sentiment: 68 },
  { symbol: "TSLA", name: "Tesla Inc.", sector: "Consumer", price: 281.7, changePct: -1.92, quantScore: 51, sentiment: 42 }
];

const news = [
  { source: "SEC Daily", title: "Large-cap semiconductors see renewed institutional accumulation", symbol: "NVDA", sentiment: 0.78 },
  { source: "Macro Brief", title: "Yield curve steepens as rate-cut expectations drift lower", symbol: "SPY", sentiment: -0.18 },
  { source: "Crypto Market Desk", title: "Bitcoin liquidity improves after weekend derivatives reset", symbol: "BTC", sentiment: 0.44 },
  { source: "Policy Watch", title: "Congressional disclosures show rotation into cybersecurity", symbol: "HACK", sentiment: 0.36 }
];

const insiders = [
  { name: "Maya Santori", role: "CFO", company: "Apex Semiconductors", symbol: "APX", side: "Buy", value: 1260000 },
  { name: "Daniel Cho", role: "Director", company: "Northstar Payments", symbol: "NSTP", side: "Buy", value: 842000 },
  { name: "Priya Malhotra", role: "CEO", company: "Helix Therapeutics", symbol: "HLXT", side: "Sell", value: 1510000 },
  { name: "Andre Wallace", role: "COO", company: "Atlas Robotics", symbol: "ATRB", side: "Buy", value: 620000 }
];

const congress = [
  { name: "Sen. Margaret Ellison", asset: "Cybersecurity ETF", symbol: "HACK", side: "Purchase", size: "$50k-$100k", gain: 4.8 },
  { name: "Rep. Thomas Reed", asset: "JPMorgan Chase", symbol: "JPM", side: "Purchase", size: "$15k-$50k", gain: 2.2 },
  { name: "Rep. Alana Brooks", asset: "Exxon Mobil", symbol: "XOM", side: "Sale", size: "$100k-$250k", gain: -1.4 },
  { name: "Sen. Victor Han", asset: "Microsoft", symbol: "MSFT", side: "Purchase", size: "$250k-$500k", gain: 6.1 }
];

const events = [
  { date: "Jul 09", name: "Initial Jobless Claims", importance: "Medium", forecast: "221k" },
  { date: "Jul 10", name: "Core CPI YoY", importance: "High", forecast: "2.7%" },
  { date: "Jul 15", name: "Retail Sales MoM", importance: "High", forecast: "0.2%" },
  { date: "Jul 17", name: "ECB Deposit Rate", importance: "High", forecast: "2.25%" }
];

const holdings = [
  { symbol: "NVDA", name: "NVIDIA Corporation", sector: "Technology", shares: 90, avgCost: 141.22, lastPrice: 178.42, dayChangePct: 2.14, beta: 1.68 },
  { symbol: "MSFT", name: "Microsoft Corporation", sector: "Technology", shares: 42, avgCost: 438.1, lastPrice: 512.66, dayChangePct: 0.84, beta: 0.91 },
  { symbol: "JPM", name: "JPMorgan Chase & Co.", sector: "Financials", shares: 70, avgCost: 243.4, lastPrice: 288.12, dayChangePct: 0.34, beta: 1.06 },
  { symbol: "LLY", name: "Eli Lilly and Company", sector: "Health Care", shares: 16, avgCost: 794.8, lastPrice: 914.52, dayChangePct: -0.61, beta: 0.39 }
];

const backtest = [
  { strategy: 100, benchmark: 100 },
  { strategy: 104, benchmark: 102 },
  { strategy: 107, benchmark: 103 },
  { strategy: 101, benchmark: 99 },
  { strategy: 111, benchmark: 105 },
  { strategy: 118, benchmark: 109 },
  { strategy: 115, benchmark: 108 },
  { strategy: 124, benchmark: 111 },
  { strategy: 132, benchmark: 116 },
  { strategy: 137, benchmark: 119 },
  { strategy: 145, benchmark: 123 },
  { strategy: 151, benchmark: 126 }
];

const formatMoney = (value) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: value > 1000 ? 0 : 2 }).format(value);

const formatNumber = (value) => new Intl.NumberFormat("en-US", { maximumFractionDigits: 2 }).format(value);
const formatPct = (value) => `${value > 0 ? "+" : ""}${value.toFixed(2)}%`;
const changeClass = (value) => (value >= 0 ? "up" : "down");

function renderIndices() {
  const grid = document.querySelector("#indexGrid");
  grid.innerHTML = indices
    .map((item) => {
      const min = Math.min(...item.spark);
      const max = Math.max(...item.spark);
      const bars = item.spark
        .map((value) => {
          const height = 18 + ((value - min) / Math.max(1, max - min)) * 26;
          return `<i style="height:${height}px"></i>`;
        })
        .join("");

      return `
        <article class="index-card">
          <header>
            <span><strong>${item.symbol}</strong><small>${item.name}</small></span>
            <b class="${changeClass(item.changePct)}">${formatPct(item.changePct)}</b>
          </header>
          <div class="spark ${item.changePct < 0 ? "is-down" : ""}">${bars}</div>
          <div class="index-price">${formatNumber(item.price)}</div>
        </article>
      `;
    })
    .join("");
}

function renderSectors() {
  const grid = document.querySelector("#sectorHeatmap");
  grid.innerHTML = sectors
    .map((item) => {
      const alpha = Math.min(0.32, Math.abs(item.oneDay) / 4);
      const color = item.oneDay >= 0 ? `rgba(84, 216, 137, ${alpha})` : `rgba(255, 115, 115, ${alpha})`;
      return `
        <article class="heat-tile" style="background:${color}">
          <strong>${item.sector}</strong>
          <span class="${changeClass(item.oneDay)}">${formatPct(item.oneDay)}</span>
        </article>
      `;
    })
    .join("");
}

function renderNews() {
  document.querySelector("#newsList").innerHTML = news
    .map(
      (item) => `
        <article class="news-item">
          <header>
            <strong>${item.symbol}</strong>
            <b class="${changeClass(item.sentiment)}">${formatPct(item.sentiment * 100)}</b>
          </header>
          <p>${item.title}</p>
          <p>${item.source}</p>
        </article>
      `
    )
    .join("");
}

function renderScreener() {
  const search = document.querySelector("#searchInput").value.trim().toLowerCase();
  const sector = document.querySelector("#sectorSelect").value;
  const minScore = Number(document.querySelector("#scoreRange").value);
  document.querySelector("#scoreOutput").textContent = minScore;

  const filtered = equities.filter((item) => {
    const matchesSearch = `${item.symbol} ${item.name}`.toLowerCase().includes(search);
    const matchesSector = sector === "All" || item.sector === sector;
    const matchesScore = item.quantScore >= minScore;
    return matchesSearch && matchesSector && matchesScore;
  });

  document.querySelector("#resultCount").textContent = `${filtered.length} match${filtered.length === 1 ? "" : "es"}`;
  document.querySelector("#screenerRows").innerHTML = filtered
    .map(
      (item) => `
        <tr>
          <td><strong>${item.symbol}</strong></td>
          <td>${item.name}</td>
          <td>${item.sector}</td>
          <td>${formatMoney(item.price)}</td>
          <td class="${changeClass(item.changePct)}">${formatPct(item.changePct)}</td>
          <td><div class="score-bar" aria-label="Quant score ${item.quantScore}"><span style="width:${item.quantScore}%"></span></div></td>
          <td>${item.sentiment}</td>
        </tr>
      `
    )
    .join("");
}

function renderSignals() {
  document.querySelector("#insiderList").innerHTML = insiders
    .map(
      (item) => `
        <article class="compact-item">
          <header><strong>${item.symbol}</strong><b class="${item.side === "Buy" ? "up" : "down"}">${item.side}</b></header>
          <p>${item.name}, ${item.role} at ${item.company}</p>
          <p>${formatMoney(item.value)}</p>
        </article>
      `
    )
    .join("");

  document.querySelector("#congressList").innerHTML = congress
    .map(
      (item) => `
        <article class="compact-item">
          <header><strong>${item.symbol}</strong><b class="${changeClass(item.gain)}">${formatPct(item.gain)}</b></header>
          <p>${item.name}: ${item.side} of ${item.asset}</p>
          <p>${item.size}</p>
        </article>
      `
    )
    .join("");

  document.querySelector("#eventList").innerHTML = events
    .map(
      (item) => `
        <article class="compact-item">
          <header><strong>${item.date}</strong><b>${item.importance}</b></header>
          <p>${item.name}</p>
          <p>Forecast ${item.forecast}</p>
        </article>
      `
    )
    .join("");
}

function pointsFor(values, key) {
  const min = Math.min(...values.map((item) => item[key]));
  const max = Math.max(...values.map((item) => item[key]));
  return values
    .map((item, index) => {
      const x = 40 + index * (640 / (values.length - 1));
      const y = 230 - ((item[key] - min) / Math.max(1, max - min)) * 170;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" L");
}

function renderBacktest() {
  const risk = Number(document.querySelector("#riskRange").value);
  const strategy = document.querySelector("#strategySelect").value;
  const modifier = strategy === "filings" ? 0.92 : strategy === "macro" ? 0.82 : 1;
  const riskDrift = (risk - 45) / 100;
  const adjusted = backtest.map((item, index) => ({
    benchmark: item.benchmark,
    strategy: item.strategy * modifier + index * riskDrift * 2.2
  }));

  document.querySelector("#riskOutput").textContent = risk;
  document.querySelector("#strategyLine").setAttribute("d", `M${pointsFor(adjusted, "strategy")}`);
  document.querySelector("#benchmarkLine").setAttribute("d", `M${pointsFor(adjusted, "benchmark")}`);

  const end = adjusted.at(-1).strategy;
  const start = adjusted[0].strategy;
  const cagr = ((end / start - 1) * 100).toFixed(1);
  const sharpe = (1.32 + risk / 90).toFixed(2);
  const drawdown = (-6.8 - risk / 12).toFixed(1);
  const alpha = (Number(cagr) - 19.4).toFixed(1);
  const beta = (0.72 + risk / 200).toFixed(2);

  document.querySelector("#backtestMetrics").innerHTML = [
    ["CAGR", `${cagr}%`],
    ["Sharpe", sharpe],
    ["Max DD", `${drawdown}%`],
    ["Alpha", `${alpha}%`],
    ["Beta", beta]
  ]
    .map(([label, value]) => `<article><span>${label}</span><strong>${value}</strong></article>`)
    .join("");
}

function renderPortfolio() {
  const enriched = holdings.map((item) => {
    const value = item.shares * item.lastPrice;
    const cost = item.shares * item.avgCost;
    return { ...item, value, profit: value - cost };
  });
  const total = enriched.reduce((sum, item) => sum + item.value, 0);
  const profit = enriched.reduce((sum, item) => sum + item.profit, 0);
  const beta = enriched.reduce((sum, item) => sum + item.beta * (item.value / total), 0);

  document.querySelector("#portfolioMetrics").innerHTML = [
    ["Value", formatMoney(total)],
    ["Unrealized P/L", formatMoney(profit)],
    ["Return", formatPct((profit / (total - profit)) * 100)],
    ["Weighted beta", beta.toFixed(2)]
  ]
    .map(([label, value]) => `<article><span>${label}</span><strong>${value}</strong></article>`)
    .join("");

  document.querySelector("#portfolioRows").innerHTML = enriched
    .map(
      (item) => `
        <tr>
          <td><strong>${item.symbol}</strong></td>
          <td>${item.name}</td>
          <td>${item.sector}</td>
          <td>${formatMoney(item.value)}</td>
          <td class="${changeClass(item.profit)}">${formatMoney(item.profit)}</td>
          <td>${item.beta.toFixed(2)}</td>
        </tr>
      `
    )
    .join("");

  const bySector = enriched.reduce((acc, item) => {
    acc[item.sector] = (acc[item.sector] || 0) + item.value;
    return acc;
  }, {});

  document.querySelector("#allocationList").innerHTML = Object.entries(bySector)
    .sort((a, b) => b[1] - a[1])
    .map(([sector, value]) => {
      const weight = (value / total) * 100;
      return `
        <div class="allocation-row">
          <div class="allocation-meta"><strong>${sector}</strong><span>${weight.toFixed(1)}%</span></div>
          <div class="allocation-bar"><span style="width:${weight}%"></span></div>
          <small>${formatMoney(value)}</small>
        </div>
      `;
    })
    .join("");
}

function setSection(sectionId) {
  document.querySelectorAll("[data-section]").forEach((section) => {
    section.classList.toggle("is-visible", section.dataset.section === sectionId);
  });
  document.querySelectorAll("[data-section-link]").forEach((link) => {
    link.classList.toggle("is-active", link.dataset.sectionLink === sectionId);
  });
  document.body.classList.remove("menu-open");
}

function bindNavigation() {
  document.querySelectorAll("[data-section-link]").forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const sectionId = link.dataset.sectionLink;
      history.replaceState(null, "", `#${sectionId}`);
      setSection(sectionId);
    });
  });

  document.querySelector("[data-menu-toggle]").addEventListener("click", () => {
    document.body.classList.toggle("menu-open");
  });

  const initial = location.hash.replace("#", "") || "dashboard";
  if (document.querySelector(`[data-section="${initial}"]`)) {
    setSection(initial);
  }
}

function bindControls() {
  ["searchInput", "sectorSelect", "scoreRange"].forEach((id) => {
    document.querySelector(`#${id}`).addEventListener("input", renderScreener);
  });

  document.querySelector("#resetFilters").addEventListener("click", () => {
    document.querySelector("#searchInput").value = "";
    document.querySelector("#sectorSelect").value = "All";
    document.querySelector("#scoreRange").value = "70";
    renderScreener();
  });

  ["strategySelect", "riskRange"].forEach((id) => {
    document.querySelector(`#${id}`).addEventListener("input", renderBacktest);
  });
  document.querySelector("#runBacktest").addEventListener("click", renderBacktest);
}

renderIndices();
renderSectors();
renderNews();
renderScreener();
renderSignals();
renderBacktest();
renderPortfolio();
bindNavigation();
bindControls();
