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

// API 配置
const API_CONFIG = {
    primary: {
        baseUrl: 'https://api.binance.com/api/v3',
        endpoints: {
            ticker: '/ticker/24hr',
            price: '/ticker/price',
            klines: '/klines'
        }
    },
    backup: {
        baseUrl: 'https://api.coingecko.com/api/v3',
        endpoints: {
            ticker: '/coins/markets',
            price: '/simple/price',
            klines: '/coins'
        }
    }
};

// 錯誤處理
class APIError extends Error {
    constructor(message, status, data) {
        super(message);
        this.name = 'APIError';
        this.status = status;
        this.data = data;
    }
}

// 檢查 API 可用性
async function checkAPIHealth(api) {
    try {
        const response = await fetch(`${api.baseUrl}${api.endpoints.ticker}`);
        return response.ok;
    } catch {
        return false;
    }
}

// 獲取數據（帶重試和備用）
async function fetchWithRetry(url, options = {}, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, {
                ...options,
                headers: {
                    'Accept': 'application/json',
                    ...options.headers
                }
            });

            if (!response.ok) {
                throw new APIError(`HTTP error! status: ${response.status}`, response.status);
            }

            return await response.json();
        } catch (error) {
            if (i === retries - 1) throw error;
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
        }
    }
}

// 預加載數據
async function preloadData() {
    try {
        // 檢查主要 API 是否可用
        const isPrimaryAvailable = await checkAPIHealth(API_CONFIG.primary);
        const api = isPrimaryAvailable ? API_CONFIG.primary : API_CONFIG.backup;

        if (api === API_CONFIG.primary) {
            // 使用 Binance API
            const [tickerData, priceData] = await Promise.all([
                fetchWithRetry(`${api.baseUrl}${api.endpoints.ticker}`),
                fetchWithRetry(`${api.baseUrl}${api.endpoints.price}`)
            ]);

            const priceMap = new Map(priceData.map(p => [p.symbol, parseFloat(p.price)]));
            const usdtPairs = tickerData.filter(p => p.symbol.endsWith('USDT'));
            
            return processBinanceData(usdtPairs, priceMap);
        } else {
            // 使用 CoinGecko API
            const tickerData = await fetchWithRetry(
                `${api.baseUrl}${api.endpoints.ticker}?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false&price_change_percentage=24h`
            );
            
            return processCoinGeckoData(tickerData);
        }
    } catch (error) {
        console.error('預加載數據失敗:', error);
        
        // 嘗試從本地存儲加載緩存數據
        const cachedData = localStorage.getItem('cryptoData');
        if (cachedData) {
            const { data, timestamp } = JSON.parse(cachedData);
            if (Date.now() - timestamp < 3600000) { // 1小時內的緩存
                return data;
            }
        }
        
        throw error;
    }
}

// 處理 Binance 數據
function processBinanceData(tickerData, priceMap) {
    const mainCoins = ['BTC', 'ETH', 'BNB', 'XRP', 'ADA', 'DOGE', 'SOL', 'DOT', 'MATIC', 'LINK'];
    return tickerData
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
}

// 處理 CoinGecko 數據
function processCoinGeckoData(data) {
    const mainCoins = ['bitcoin', 'ethereum', 'binancecoin', 'ripple', 'cardano', 'dogecoin', 'solana', 'polkadot', 'matic-network', 'chainlink'];
    return data
        .filter(coin => mainCoins.includes(coin.id))
        .map(coin => ({
            symbol: coin.symbol.toUpperCase(),
            price: coin.current_price,
            volume: coin.total_volume,
            marketCap: coin.market_cap,
            priceChange: coin.price_change_percentage_24h,
            name: cryptoNames[coin.symbol.toUpperCase()] || coin.name,
            icon: cryptoIcons[coin.symbol.toUpperCase()] || 'fas fa-coins'
        }));
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
        document.getElementById('modalCurrentPrice').textContent = '--';
        document.getElementById('modalPriceChange').textContent = '--';
        document.getElementById('modalHigh24h').textContent = '--';
        document.getElementById('modalLow24h').textContent = '--';
        document.getElementById('modalVolume24h').textContent = '--';
        document.getElementById('modalMarketCap').textContent = '--';
        
        // 禁用時間範圍按鈕
        document.querySelectorAll('.time-btn').forEach(btn => btn.disabled = true);
        
        // 檢查 API 可用性
        const isPrimaryAvailable = await checkAPIHealth(API_CONFIG.primary);
        const api = isPrimaryAvailable ? API_CONFIG.primary : API_CONFIG.backup;

        let tickerData, klinesData;

        if (api === API_CONFIG.primary) {
            // 使用 Binance API
            [tickerData, klinesData] = await Promise.all([
                fetchWithRetry(`${api.baseUrl}${api.endpoints.ticker}?symbol=${symbol}USDT`),
                fetchWithRetry(`${api.baseUrl}${api.endpoints.klines}?symbol=${symbol}USDT&interval=1d&limit=30`)
            ]);
        } else {
            // 使用 CoinGecko API
            const coinId = getCoinGeckoId(symbol);
            [tickerData, klinesData] = await Promise.all([
                fetchWithRetry(`${api.baseUrl}/coins/${coinId}`),
                fetchWithRetry(`${api.baseUrl}/coins/${coinId}/market_chart?vs_currency=usd&days=30&interval=daily`)
            ]);
        }

        // 更新模態框內容
        const cryptoName = cryptoNames[symbol.toUpperCase()] || symbol.toUpperCase();
        document.getElementById('modalCryptoName').textContent = `${cryptoName} (${symbol.toUpperCase()})`;

        if (api === API_CONFIG.primary) {
            // 處理 Binance 數據
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
            updateChart(klinesData.map(k => ({
                date: new Date(k[0]),
                price: parseFloat(k[4])
            })));
        } else {
            // 處理 CoinGecko 數據
            document.getElementById('modalCurrentPrice').textContent = `$${tickerData.market_data.current_price.usd.toLocaleString()}`;
            
            const priceChange = tickerData.market_data.price_change_percentage_24h;
            const priceChangeElement = document.getElementById('modalPriceChange');
            priceChangeElement.textContent = `${priceChange >= 0 ? '+' : ''}${priceChange.toFixed(2)}%`;
            priceChangeElement.className = priceChange >= 0 ? 'positive' : 'negative';

            document.getElementById('modalHigh24h').textContent = `$${tickerData.market_data.high_24h.usd.toLocaleString()}`;
            document.getElementById('modalLow24h').textContent = `$${tickerData.market_data.low_24h.usd.toLocaleString()}`;
            document.getElementById('modalVolume24h').textContent = `$${formatNumber(tickerData.market_data.total_volume.usd)}`;
            document.getElementById('modalMarketCap').textContent = `$${formatNumber(tickerData.market_data.market_cap.usd)}`;

            // 更新圖表
            const prices = klinesData.prices.map(([timestamp, price]) => ({
                date: new Date(timestamp),
                price: price
            }));
            updateChart(prices);
        }

        // 啟用時間範圍按鈕
        document.querySelectorAll('.time-btn').forEach(btn => btn.disabled = false);
        
    } catch (error) {
        console.error('獲取詳細數據時發生錯誤:', error);
        document.getElementById('modalCryptoName').textContent = '加載失敗';
        document.getElementById('modalCurrentPrice').textContent = '--';
        document.getElementById('modalPriceChange').textContent = '--';
        document.getElementById('modalHigh24h').textContent = '--';
        document.getElementById('modalLow24h').textContent = '--';
        document.getElementById('modalVolume24h').textContent = '--';
        document.getElementById('modalMarketCap').textContent = '--';
        
        // 顯示錯誤信息
        const chartContainer = document.querySelector('.chart-container');
        chartContainer.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <p>無法加載詳細數據</p>
                <p class="error-details">${error.message}</p>
                <button onclick="showCryptoDetail('${symbol}')" class="retry-button">
                    <i class="fas fa-sync-alt"></i> 重試
                </button>
            </div>
        `;
    }
}

// 獲取 CoinGecko ID
function getCoinGeckoId(symbol) {
    const coinMap = {
        'BTC': 'bitcoin',
        'ETH': 'ethereum',
        'BNB': 'binancecoin',
        'XRP': 'ripple',
        'ADA': 'cardano',
        'DOGE': 'dogecoin',
        'SOL': 'solana',
        'DOT': 'polkadot',
        'MATIC': 'matic-network',
        'LINK': 'chainlink'
    };
    return coinMap[symbol.toUpperCase()] || symbol.toLowerCase();
}

// 更新圖表
function updateChart(data) {
    const ctx = document.getElementById('priceChart').getContext('2d');
    if (priceChart) {
        priceChart.destroy();
    }

    const labels = data.map(d => d.date.toLocaleDateString('zh-TW'));
    const values = data.map(d => d.price);

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

// 添加時間範圍按鈕樣式
const timeButtonStyle = document.createElement('style');
timeButtonStyle.textContent = `
    .time-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    .chart-container .error-message {
        padding: 2rem;
        text-align: center;
    }

    .chart-container .error-message i {
        font-size: 2rem;
        margin-bottom: 1rem;
    }

    .chart-container .error-details {
        color: var(--text-secondary);
        margin: 0.5rem 0 1rem;
    }
`;
document.head.appendChild(timeButtonStyle);

// 格式化數字
function formatNumber(num) {
    if (num >= 1e12) {
        return `${(num / 1e12).toFixed(2)}T`;
    } else if (num >= 1e9) {
        return `${(num / 1e9).toFixed(2)}B`;
    } else if (num >= 1e6) {
        return `${(num / 1e6).toFixed(2)}M`;
    } else if (num >= 1e3) {
        return `${(num / 1e3).toFixed(2)}K`;
    }
    return num.toFixed(2);
}

// 更新圖表
function updateCharts(data) {
    data.forEach(crypto => {
        const canvas = document.getElementById(`chart-${crypto.symbol.toLowerCase()}`);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (ctx) {
            // 創建簡單的價格趨勢圖
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['1h', '2h', '3h', '4h', '5h', '6h'],
                    datasets: [{
                        label: '價格',
                        data: [
                            crypto.price * (1 - crypto.change_24h / 100),
                            crypto.price * (1 - crypto.change_24h / 100 * 0.8),
                            crypto.price * (1 - crypto.change_24h / 100 * 0.6),
                            crypto.price * (1 - crypto.change_24h / 100 * 0.4),
                            crypto.price * (1 - crypto.change_24h / 100 * 0.2),
                            crypto.price
                        ],
                        borderColor: crypto.change_24h >= 0 ? '#2ecc71' : '#e74c3c',
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
                            enabled: false
                        }
                    },
                    scales: {
                        x: {
                            display: false
                        },
                        y: {
                            display: false
                        }
                    }
                }
            });
        }
    });
}

// 頁面加載時初始化
document.addEventListener('DOMContentLoaded', () => {
    updateCryptoData();
    // 每分鐘更新一次價格
    setInterval(updateCryptoData, 60000);

    // 關閉模態框
    const modal = document.getElementById('cryptoDetailModal');
    if (modal) {
        const closeBtn = document.querySelector('.close');
        if (closeBtn) {
            closeBtn.onclick = () => {
                modal.style.display = 'none';
            };
        }
        
        window.onclick = (event) => {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        };
    }

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
        if (lastUpdated) {
            lastUpdated.textContent = `最後更新: ${new Date().toLocaleTimeString('zh-TW')}`;
        }
        
        // 計算總市值和交易量
        let totalMarketCap = 0;
        let totalVolume = 0;
        data.forEach(crypto => {
            totalMarketCap += crypto.market_cap || 0;
            totalVolume += crypto.volume_24h || 0;
        });
        
        // 更新市場概況
        const totalMarketCapElement = document.getElementById('totalMarketCap');
        const totalVolumeElement = document.getElementById('totalVolume');
        const btcDominanceElement = document.getElementById('btcDominance');
        
        if (totalMarketCapElement) {
            totalMarketCapElement.textContent = `$${formatNumber(totalMarketCap)}`;
        }
        if (totalVolumeElement) {
            totalVolumeElement.textContent = `$${formatNumber(totalVolume)}`;
        }
        if (btcDominanceElement) {
            const btc = data.find(c => c.symbol === 'BTC');
            const btcDominance = btc ? (btc.market_cap / totalMarketCap * 100) : 0;
            btcDominanceElement.textContent = `${btcDominance.toFixed(2)}%`;
        }
        
        // 更新加密貨幣卡片
        const cryptoGrid = document.getElementById('cryptoGrid');
        if (cryptoGrid) {
            cryptoGrid.innerHTML = '';
            
            data.forEach(crypto => {
                const changeClass = crypto.change_24h >= 0 ? 'positive' : 'negative';
                const changeIcon = crypto.change_24h >= 0 ? 'fa-arrow-up' : 'fa-arrow-down';
                const cryptoName = cryptoNames[crypto.symbol] || crypto.symbol;
                const cryptoIcon = cryptoIcons[crypto.symbol] || 'fas fa-coins';
                
                cryptoGrid.innerHTML += `
                    <div class="crypto-card" onclick="showCryptoDetail('${crypto.symbol}')">
                        <div class="crypto-header">
                            <i class="crypto-icon ${cryptoIcon}"></i>
                            <h2>${cryptoName} <span class="crypto-symbol">${crypto.symbol}</span></h2>
                        </div>
                        <div class="crypto-price">
                            <span class="price">$${formatNumber(crypto.price)}</span>
                            <span class="change ${changeClass}">
                                <i class="fas ${changeIcon}"></i>
                                ${Math.abs(crypto.change_24h).toFixed(2)}%
                            </span>
                        </div>
                        <div class="crypto-details">
                            <div class="volume">
                                <span>24h 交易量:</span>
                                <span>$${formatNumber(crypto.volume_24h)}</span>
                            </div>
                            <div class="high-low">
                                <span>高: $${formatNumber(crypto.high_24h)}</span>
                                <span>低: $${formatNumber(crypto.low_24h)}</span>
                            </div>
                        </div>
                        <div class="crypto-chart">
                            <canvas id="chart-${crypto.symbol.toLowerCase()}"></canvas>
                        </div>
                    </div>
                `;
            });
            
            // 更新圖表
            updateCharts(data);
        }
        
    } catch (error) {
        console.error('更新數據時發生錯誤:', error);
        const cryptoGrid = document.getElementById('cryptoGrid');
        if (cryptoGrid) {
            cryptoGrid.innerHTML = `
                <div class="error-message">
                    <i class="fas fa-exclamation-circle"></i>
                    <p>無法加載數據</p>
                    <p class="error-details">${error.message}</p>
                    <button onclick="updateCryptoData()" class="retry-button">
                        <i class="fas fa-sync-alt"></i> 重試
                    </button>
                </div>
            `;
        }
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