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
        // 使用 Binance API 獲取詳細數據
        const [tickerResponse, klinesResponse] = await Promise.all([
            fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${symbol}USDT`),
            fetch(`https://api.binance.com/api/v3/klines?symbol=${symbol}USDT&interval=1d&limit=30`)
        ]);

        const tickerData = await tickerResponse.json();
        const klinesData = await klinesResponse.json();

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
    } catch (error) {
        console.error('獲取詳細數據時發生錯誤:', error);
    }
}

// 更新加密貨幣價格
async function updatePrices(retryCount = 0) {
    const maxRetries = 3;
    const cryptoGrid = document.getElementById('cryptoGrid');
    
    try {
        // 顯示加載狀態
        cryptoGrid.innerHTML = '<div class="loading">正在加載加密貨幣數據...</div>';
        
        // 使用 Binance API
        const response = await fetch('https://api.binance.com/api/v3/ticker/24hr');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const prices = await response.json();
        
        if (!Array.isArray(prices) || prices.length === 0) {
            throw new Error('Invalid data format received');
        }

        // 過濾出 USDT 交易對
        const usdtPairs = prices.filter(p => p.symbol.endsWith('USDT'));
        
        // 獲取價格數據
        const priceResponse = await fetch('https://api.binance.com/api/v3/ticker/price');
        const priceData = await priceResponse.json();
        const priceMap = new Map(priceData.map(p => [p.symbol, parseFloat(p.price)]));

        cryptoGrid.innerHTML = '';
        
        let totalMarketCap = 0;
        let totalVolume = 0;
        let btcMarketCap = 0;
        
        // 只顯示主要的加密貨幣
        const mainCoins = ['BTC', 'ETH', 'BNB', 'XRP', 'ADA', 'DOGE', 'SOL', 'DOT', 'MATIC', 'LINK'];
        
        usdtPairs.forEach(crypto => {
            const symbol = crypto.symbol.replace('USDT', '');
            if (!mainCoins.includes(symbol)) return;

            const price = priceMap.get(crypto.symbol) || 0;
            const volume = parseFloat(crypto.volume) * price;
            const marketCap = volume * 10; // 估算市值
            
            totalMarketCap += marketCap;
            totalVolume += volume;
            if (symbol === 'BTC') {
                btcMarketCap = marketCap;
            }
            
            const card = document.createElement('div');
            card.className = 'crypto-card';
            card.onclick = () => showCryptoDetail(symbol.toLowerCase());
            
            const iconClass = cryptoIcons[symbol] || 'fas fa-coins';
            const name = cryptoNames[symbol] || symbol;
            const priceChange = parseFloat(crypto.priceChangePercent);
            
            card.innerHTML = `
                <div class="crypto-header">
                    <i class="${iconClass}"></i>
                    <h2>${name} <span class="crypto-symbol">${symbol}</span></h2>
                </div>
                <div class="crypto-price">
                    <span class="price">$${price.toLocaleString()}</span>
                    <span class="change ${priceChange >= 0 ? 'positive' : 'negative'}">
                        <i class="fas fa-arrow-${priceChange >= 0 ? 'up' : 'down'}"></i>
                        ${Math.abs(priceChange).toFixed(2)}%
                    </span>
                </div>
                <div class="crypto-stats">
                    <div class="stat-item">
                        <span class="stat-label">24h 交易量</span>
                        <span class="stat-value">$${formatNumber(volume)}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">市值</span>
                        <span class="stat-value">$${formatNumber(marketCap)}</span>
                    </div>
                </div>
            `;
            
            cryptoGrid.appendChild(card);
        });
        
        // 更新市場概況
        document.getElementById('totalMarketCap').textContent = `$${formatNumber(totalMarketCap)}`;
        document.getElementById('totalVolume').textContent = `$${formatNumber(totalVolume)}`;
        document.getElementById('btcDominance').textContent = `${((btcMarketCap / totalMarketCap) * 100).toFixed(1)}%`;
        
    } catch (error) {
        console.error('更新價格時發生錯誤:', error);
        
        if (retryCount < maxRetries) {
            // 重試
            console.log(`重試中... (${retryCount + 1}/${maxRetries})`);
            setTimeout(() => updatePrices(retryCount + 1), 2000); // 2秒後重試
        } else {
            // 顯示錯誤信息
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