// 加密貨幣圖標映射
const cryptoIcons = {
    'BTC': 'fab fa-bitcoin',
    'ETH': 'fab fa-ethereum',
    'BNB': 'fas fa-coins',
    'SOL': 'fas fa-coins',
    'XRP': 'fas fa-coins',
    'USDC': 'fas fa-dollar-sign',
    'USDT': 'fas fa-dollar-sign',
    'ADA': 'fas fa-coins',
    'AVAX': 'fas fa-coins',
    'DOGE': 'fas fa-dog',
    'DOT': 'fas fa-coins',
    'TRX': 'fas fa-coins',
    'MATIC': 'fas fa-coins',
    'LINK': 'fas fa-link',
    'WBTC': 'fab fa-bitcoin',
    'TON': 'fas fa-coins',
    'SHIB': 'fas fa-dog',
    'DAI': 'fas fa-dollar-sign',
    'LTC': 'fas fa-coins',
    'UNI': 'fas fa-coins',
    'ATOM': 'fas fa-atom',
    'XLM': 'fas fa-coins',
    'BCH': 'fab fa-bitcoin',
    'NEAR': 'fas fa-coins',
    'XMR': 'fas fa-coins',
    'OKB': 'fas fa-coins',
    'FIL': 'fas fa-coins',
    'INJ': 'fas fa-coins',
    'APT': 'fas fa-coins',
    'HBAR': 'fas fa-coins',
    'VET': 'fas fa-coins',
    'OP': 'fas fa-coins',
    'MKR': 'fas fa-coins',
    'CRO': 'fas fa-coins',
    'RUNE': 'fas fa-coins',
    'KAS': 'fas fa-coins',
    'GRT': 'fas fa-coins',
    'PEPE': 'fas fa-frog',
    'THETA': 'fas fa-coins',
    'FTM': 'fas fa-coins',
    'RNDR': 'fas fa-coins',
    'AAVE': 'fas fa-coins',
    'QNT': 'fas fa-coins',
    'ALGO': 'fas fa-coins',
    'ARB': 'fas fa-coins',
    'STX': 'fas fa-coins',
    'FLOW': 'fas fa-coins',
    'EGLD': 'fas fa-coins',
    'EOS': 'fas fa-coins',
    'XTZ': 'fas fa-coins'
};

// 加密貨幣名稱映射
const cryptoNames = {
    'BTC': '比特幣',
    'ETH': '以太幣',
    'BNB': '幣安幣',
    'SOL': '索拉納',
    'XRP': '瑞波幣',
    'USDC': 'USD Coin',
    'USDT': 'Tether',
    'ADA': '卡爾達諾',
    'AVAX': '雪崩協議',
    'DOGE': '狗狗幣',
    'DOT': '波卡',
    'TRX': '波場',
    'MATIC': 'Polygon',
    'LINK': 'Chainlink',
    'WBTC': 'Wrapped Bitcoin',
    'TON': 'Toncoin',
    'SHIB': '柴犬幣',
    'DAI': 'Dai',
    'LTC': '萊特幣',
    'UNI': 'Uniswap',
    'ATOM': 'Cosmos',
    'XLM': '恆星幣',
    'BCH': '比特幣現金',
    'NEAR': 'NEAR Protocol',
    'XMR': '門羅幣',
    'OKB': 'OKB',
    'FIL': 'Filecoin',
    'INJ': 'Injective',
    'APT': 'Aptos',
    'HBAR': 'Hedera',
    'VET': '唯鏈',
    'OP': 'Optimism',
    'MKR': 'Maker',
    'CRO': 'Cronos',
    'RUNE': 'THORChain',
    'KAS': 'Kaspa',
    'GRT': 'The Graph',
    'PEPE': 'Pepe',
    'THETA': 'Theta Network',
    'FTM': 'Fantom',
    'RNDR': 'Render',
    'AAVE': 'Aave',
    'QNT': 'Quant',
    'ALGO': 'Algorand',
    'ARB': 'Arbitrum',
    'STX': 'Stacks',
    'FLOW': 'Flow',
    'EGLD': 'Elrond',
    'EOS': 'EOS',
    'XTZ': 'Tezos'
};

// 圖表實例
let priceChart = null;

// 緩存數據
let cachedData = null;
let lastUpdateTime = 0;
const CACHE_DURATION = 60000; // 緩存時間 1 分鐘

// 虛擬滾動配置
const ITEMS_PER_PAGE = 10;
let currentPage = 1;
let isLoading = false;
let hasMore = true;

// 骨架屏 HTML
const skeletonCard = `
    <div class="crypto-card skeleton">
        <div class="crypto-header">
            <div class="skeleton-icon"></div>
            <div class="skeleton-text"></div>
        </div>
        <div class="crypto-price">
            <div class="skeleton-text"></div>
            <div class="skeleton-text"></div>
        </div>
        <div class="crypto-stats">
            <div class="stat-item">
                <div class="skeleton-text"></div>
                <div class="skeleton-text"></div>
            </div>
            <div class="stat-item">
                <div class="skeleton-text"></div>
                <div class="skeleton-text"></div>
            </div>
        </div>
    </div>
`;

// 添加骨架屏樣式
const skeletonStyle = document.createElement('style');
skeletonStyle.textContent = `
    .skeleton {
        animation: skeleton-loading 1s linear infinite alternate;
    }

    .skeleton-icon {
        width: 24px;
        height: 24px;
        border-radius: 50%;
        background: var(--background-color);
    }

    .skeleton-text {
        height: 16px;
        margin: 8px 0;
        border-radius: 4px;
        background: var(--background-color);
    }

    @keyframes skeleton-loading {
        0% {
            background-color: rgba(255, 255, 255, 0.1);
        }
        100% {
            background-color: rgba(255, 255, 255, 0.2);
        }
    }
`;
document.head.appendChild(skeletonStyle);

// 預加載數據
async function preloadData() {
    try {
        const [tickerResponse, priceResponse] = await Promise.all([
            fetch('https://api.binance.com/api/v3/ticker/24hr'),
            fetch('https://api.binance.com/api/v3/ticker/price')
        ]);
        
        const [tickerData, priceData] = await Promise.all([
            tickerResponse.json(),
            priceResponse.json()
        ]);

        const priceMap = new Map(priceData.map(p => [p.symbol, parseFloat(p.price)]));
        const usdtPairs = tickerData.filter(p => p.symbol.endsWith('USDT'));
        
        const mainCoins = ['BTC', 'ETH', 'BNB', 'XRP', 'ADA', 'DOGE', 'SOL', 'DOT', 'MATIC', 'LINK'];
        return usdtPairs
            .filter(p => mainCoins.includes(p.symbol.replace('USDT', '')))
            .map(p => {
                const symbol = p.symbol.replace('USDT', '');
                const price = priceMap.get(p.symbol) || 0;
                const volume = parseFloat(p.volume) * price;
                const marketCap = volume * 10;
                return {
                    symbol,
                    price,
                    volume,
                    marketCap,
                    priceChange: parseFloat(p.priceChangePercent),
                    name: cryptoNames[symbol] || symbol,
                    icon: cryptoIcons[symbol] || 'fas fa-coins'
                };
            });
    } catch (error) {
        console.error('預加載數據失敗:', error);
        return [];
    }
}

// 搜索功能
function searchCrypto() {
    const searchInput = document.getElementById('crypto-search');
    const searchTerm = searchInput.value.trim().toLowerCase();
    
    if (searchTerm) {
        const cryptoGrid = document.getElementById('cryptoGrid');
        const cards = cryptoGrid.getElementsByClassName('crypto-card');
        
        Array.from(cards).forEach(card => {
            const name = card.querySelector('h2').textContent.toLowerCase();
            if (name.includes(searchTerm)) {
                card.style.display = '';
            } else {
                card.style.display = 'none';
            }
        });
    } else {
        const cards = document.getElementsByClassName('crypto-card');
        Array.from(cards).forEach(card => card.style.display = '');
    }
}

// 顯示詳細資料
async function showCryptoDetail(symbol) {
    const modal = document.getElementById('cryptoDetailModal');
    modal.style.display = 'block';

    try {
        // 顯示加載狀態
        document.getElementById('modalCryptoName').textContent = '加載中...';
        
        // 並行請求詳細數據
        const [tickerResponse, klinesResponse] = await Promise.all([
            fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}USDT`),
            fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}USDT&interval=1d&limit=30`)
        ]);

        const [tickerData, klinesData] = await Promise.all([
            tickerResponse.json(),
            klinesResponse.json()
        ]);

        // 更新模態框內容
        document.getElementById('modalCryptoName').textContent = `${cryptoNames[symbol.toUpperCase()] || symbol.toUpperCase()} (${symbol.toUpperCase()})`;
        document.getElementById('modalCurrentPrice').textContent = `$${parseFloat(tickerData.lastPrice).toLocaleString()}`;
        
        const priceChange = parseFloat(tickerData.priceChangePercent);
        const priceChangeElement = document.getElementById('modalPriceChange');
        priceChangeElement.textContent = `${priceChange >= 0 ? '+' : ''}${priceChange.toFixed(2)}%`;
        priceChangeElement.className = priceChange >= 0 ? 'positive' : 'negative';

        document.getElementById('modalHigh24h').textContent = `$${parseFloat(tickerData.highPrice).toLocaleString()}`;
        document.getElementById('modalLow24h').textContent = `$${parseFloat(tickerData.lowPrice).toLocaleString()}`;
        document.getElementById('modalVolume24h').textContent = `$${formatNumber(parseFloat(tickerData.volume) * parseFloat(tickerData.lastPrice))}`;
        document.getElementById('modalMarketCap').textContent = `$${formatNumber(parseFloat(tickerData.volume) * parseFloat(tickerData.lastPrice) * 10)}`;

        // 更新圖表
        updateChart(klinesData);
    } catch (error) {
        console.error('獲取詳細數據時發生錯誤:', error);
        document.getElementById('modalCryptoName').textContent = '加載失敗';
    }
}

// 更新加密貨幣價格
async function updatePrices(retryCount = 0) {
    const maxRetries = 3;
    const cryptoGrid = document.getElementById('cryptoGrid');
    
    try {
        // 檢查緩存
        const now = Date.now();
        if (cachedData && (now - lastUpdateTime) < CACHE_DURATION) {
            renderCryptoCards(cachedData.slice(0, ITEMS_PER_PAGE));
            return;
        }

        // 顯示骨架屏
        cryptoGrid.innerHTML = Array(ITEMS_PER_PAGE).fill(skeletonCard).join('');
        
        // 獲取數據
        const data = await preloadData();
        
        if (data.length === 0) {
            throw new Error('No data received');
        }

        // 更新緩存
        cachedData = data;
        lastUpdateTime = now;

        // 渲染第一頁數據
        renderCryptoCards(data.slice(0, ITEMS_PER_PAGE));
        
        // 設置滾動監聽
        setupInfiniteScroll();
        
    } catch (error) {
        console.error('更新價格時發生錯誤:', error);
        
        if (retryCount < maxRetries) {
            console.log(`重試中... (${retryCount + 1}/${maxRetries})`);
            setTimeout(() => updatePrices(retryCount + 1), 2000);
        } else {
            cryptoGrid.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>無法加載加密貨幣數據</p>
                    <p class="error-details">請檢查您的網絡連接或稍後再試</p>
                    <button onclick="updatePrices()" class="retry-button">
                        <i class="fas fa-sync-alt"></i> 重試
                    </button>
                </div>
            `;
        }
    }
}

// 設置無限滾動
function setupInfiniteScroll() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !isLoading && hasMore) {
                loadMoreData();
            }
        });
    }, {
        root: null,
        rootMargin: '20px',
        threshold: 0.1
    });

    const sentinel = document.createElement('div');
    sentinel.id = 'sentinel';
    document.getElementById('cryptoGrid').appendChild(sentinel);
    observer.observe(sentinel);
}

// 加載更多數據
async function loadMoreData() {
    if (!cachedData || isLoading) return;
    
    isLoading = true;
    const cryptoGrid = document.getElementById('cryptoGrid');
    const start = currentPage * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    
    if (start >= cachedData.length) {
        hasMore = false;
        isLoading = false;
        return;
    }
    
    // 顯示加載狀態
    const loadingIndicator = document.createElement('div');
    loadingIndicator.className = 'loading-indicator';
    loadingIndicator.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 加載中...';
    cryptoGrid.appendChild(loadingIndicator);
    
    // 模擬加載延遲
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 移除加載指示器
    loadingIndicator.remove();
    
    // 渲染新數據
    const newData = cachedData.slice(start, end);
    renderCryptoCards(newData, true);
    
    currentPage++;
    isLoading = false;
}

// 渲染加密貨幣卡片
function renderCryptoCards(data, append = false) {
    const cryptoGrid = document.getElementById('cryptoGrid');
    if (!append) {
        cryptoGrid.innerHTML = '';
    }
    
    let totalMarketCap = 0;
    let totalVolume = 0;
    let btcMarketCap = 0;

    // 使用 DocumentFragment 提高性能
    const fragment = document.createDocumentFragment();
    
    data.forEach(crypto => {
        totalMarketCap += crypto.marketCap;
        totalVolume += crypto.volume;
        if (crypto.symbol === 'BTC') {
            btcMarketCap = crypto.marketCap;
        }
        
        const card = document.createElement('div');
        card.className = 'crypto-card';
        card.onclick = () => showCryptoDetail(crypto.symbol.toLowerCase());
        
        card.innerHTML = `
            <div class="crypto-header">
                <i class="${crypto.icon}"></i>
                <h2>${crypto.name} <span class="crypto-symbol">${crypto.symbol}</span></h2>
            </div>
            <div class="crypto-price">
                <span class="price">$${crypto.price.toLocaleString()}</span>
                <span class="change ${crypto.priceChange >= 0 ? 'positive' : 'negative'}">
                    <i class="fas fa-arrow-${crypto.priceChange >= 0 ? 'up' : 'down'}"></i>
                    ${Math.abs(crypto.priceChange).toFixed(2)}%
                </span>
            </div>
            <div class="crypto-stats">
                <div class="stat-item">
                    <span class="stat-label">24h 交易量</span>
                    <span class="stat-value">$${formatNumber(crypto.volume)}</span>
                </div>
                <div class="stat-item">
                    <span class="stat-label">市值</span>
                    <span class="stat-value">$${formatNumber(crypto.marketCap)}</span>
                </div>
            </div>
        `;
        
        fragment.appendChild(card);
    });
    
    cryptoGrid.appendChild(fragment);
    
    // 更新市場概況
    document.getElementById('totalMarketCap').textContent = `$${formatNumber(totalMarketCap)}`;
    document.getElementById('totalVolume').textContent = `$${formatNumber(totalVolume)}`;
    document.getElementById('btcDominance').textContent = `${((btcMarketCap / totalMarketCap) * 100).toFixed(1)}%`;
}

// 更新圖表
function updateChart(klinesData) {
    const ctx = document.getElementById('priceChart').getContext('2d');
    if (priceChart) {
        priceChart.destroy();
    }

    const labels = klinesData.map(k => new Date(k[0]).toLocaleDateString('zh-TW'));
    const values = klinesData.map(k => parseFloat(k[4])); // 收盤價

    priceChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: '價格 (USD)',
                data: values,
                borderColor: values[values.length - 1] >= values[0] ? '#2ecc71' : '#e74c3c',
                backgroundColor: 'rgba(46, 204, 113, 0.1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        label: function(context) {
                            return `$${context.parsed.y.toLocaleString()}`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        display: false
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        callback: function(value) {
                            return '$' + value.toLocaleString();
                        }
                    }
                }
            }
        }
    });
}

// 添加加載和錯誤狀態的樣式
const style = document.createElement('style');
style.textContent = `
    .loading {
        text-align: center;
        padding: 2rem;
        color: var(--text-secondary);
        font-size: 1.1rem;
    }

    .error-message {
        text-align: center;
        padding: 2rem;
        color: var(--danger-color);
    }

    .error-message i {
        font-size: 3rem;
        margin-bottom: 1rem;
    }

    .error-details {
        color: var(--text-secondary);
        margin: 0.5rem 0 1rem;
    }

    .retry-button {
        background-color: var(--primary-color);
        color: white;
        border: none;
        padding: 0.75rem 1.5rem;
        border-radius: var(--border-radius);
        cursor: pointer;
        font-size: 1rem;
        display: inline-flex;
        align-items: center;
        gap: 0.5rem;
        transition: all 0.2s ease;
    }

    .retry-button:hover {
        background-color: var(--secondary-color);
        transform: translateY(-1px);
    }
`;
document.head.appendChild(style);

// 添加加載指示器樣式
const loadingStyle = document.createElement('style');
loadingStyle.textContent = `
    .loading-indicator {
        text-align: center;
        padding: 1rem;
        color: var(--text-secondary);
    }

    .loading-indicator i {
        margin-right: 0.5rem;
    }

    #sentinel {
        height: 1px;
        margin: 1rem 0;
    }
`;
document.head.appendChild(loadingStyle);

// 頁面加載時初始化
document.addEventListener('DOMContentLoaded', () => {
    updatePrices();
    // 每分鐘更新一次價格
    setInterval(updatePrices, 60000);

    // 關閉模態框
    const modal = document.getElementById('cryptoDetailModal');
    const closeBtn = document.querySelector('.close');
    
    closeBtn.onclick = () => {
        modal.style.display = 'none';
    };
    
    window.onclick = (event) => {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };

    // 時間範圍按鈕點擊事件
    document.querySelectorAll('.time-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const cryptoId = document.getElementById('modalCryptoName').textContent.split('(')[1].split(')')[0].toLowerCase();
            updateChart(cryptoId, this.dataset.period);
        });
    });
});

// 導航欄活動狀態
document.querySelectorAll('nav a').forEach(link => {
    link.addEventListener('click', function() {
        document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
        this.classList.add('active');
    });
});

// News handling functions
function loadNews() {
    fetch('news.json')
        .then(response => response.json())
        .then(news => {
            const newsGrid = document.getElementById('newsGrid');
            newsGrid.innerHTML = '';
            
            news.forEach(article => {
                const newsCard = document.createElement('article');
                newsCard.className = 'news-card';
                
                const date = new Date(article.published_at * 1000);
                const formattedDate = date.toLocaleDateString('zh-TW', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                });
                
                newsCard.innerHTML = `
                    <div class="news-content">
                        <a href="${article.link}" target="_blank">
                            <h3>${article.title}</h3>
                        </a>
                        <p class="news-snippet">${article.snippet}</p>
                        <div class="news-meta">
                            <span class="news-source">${article.source}</span>
                            <span class="news-date">${formattedDate}</span>
                        </div>
                    </div>
                `;
                
                newsGrid.appendChild(newsCard);
            });
        })
        .catch(error => console.error('Error loading news:', error));
}

// 更新加密貨幣數據
async function updateCryptoData() {
    try {
        const response = await fetch('prices.json');
        const data = await response.json();
        
        // 更新最後更新時間
        const lastUpdated = document.querySelector('.last-updated');
        lastUpdated.textContent = `最後更新: ${new Date().toLocaleTimeString('zh-TW')}`;
        
        // 更新市場概況
        document.getElementById('totalMarketCap').textContent = `$${formatNumber(data.totalMarketCap)}`;
        document.getElementById('totalVolume').textContent = `$${formatNumber(data.totalVolume)}`;
        document.getElementById('btcDominance').textContent = `${data.btcDominance}%`;
        
        // 更新加密貨幣卡片
        const cryptoGrid = document.getElementById('cryptoGrid');
        cryptoGrid.innerHTML = '';
        
        data.cryptos.forEach(crypto => {
            const changeClass = crypto.change24h >= 0 ? 'positive' : 'negative';
            const changeIcon = crypto.change24h >= 0 ? 'fa-arrow-up' : 'fa-arrow-down';
            
            cryptoGrid.innerHTML += `
                <div class="crypto-card">
                    <div class="crypto-header">
                        <i class="crypto-icon ${crypto.icon}"></i>
                        <h2>${crypto.name} <span class="crypto-symbol">${crypto.symbol}</span></h2>
                    </div>
                    <div class="crypto-price">
                        <span class="price">$${formatNumber(crypto.price)}</span>
                        <span class="change ${changeClass}">
                            <i class="fas ${changeIcon}"></i>
                            ${Math.abs(crypto.change24h)}%
                        </span>
                    </div>
                    <div class="crypto-details">
                        <div class="volume">
                            <span>24h 交易量:</span>
                            <span>$${formatNumber(crypto.volume24h)}</span>
                        </div>
                        <div class="high-low">
                            <span>高: $${formatNumber(crypto.high24h)}</span>
                            <span>低: $${formatNumber(crypto.low24h)}</span>
                        </div>
                    </div>
                    <div class="crypto-chart">
                        <canvas id="chart-${crypto.symbol.toLowerCase()}"></canvas>
                    </div>
                </div>
            `;
        });
        
        // 更新圖表
        updateCharts(data.cryptos);
        
    } catch (error) {
        console.error('更新數據時發生錯誤:', error);
    }
}

// 初始化並設置定時更新
async function initialize() {
    await updateCryptoData();
    // 每分鐘更新一次數據
    setInterval(updateCryptoData, 60000);
}

// 頁面加載時初始化
document.addEventListener('DOMContentLoaded', initialize); 