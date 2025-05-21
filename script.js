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
async function showCryptoDetail(cryptoId) {
    const modal = document.getElementById('cryptoDetailModal');
    modal.style.display = 'block';

    try {
        // 獲取詳細數據
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/${cryptoId}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`);
        const data = await response.json();

        // 更新模態框內容
        document.getElementById('modalCryptoName').textContent = `${data.name} (${data.symbol.toUpperCase()})`;
        document.getElementById('modalCurrentPrice').textContent = `$${data.market_data.current_price.usd.toLocaleString()}`;
        
        const priceChange = data.market_data.price_change_percentage_24h;
        const priceChangeElement = document.getElementById('modalPriceChange');
        priceChangeElement.textContent = `${priceChange >= 0 ? '+' : ''}${priceChange.toFixed(2)}%`;
        priceChangeElement.className = priceChange >= 0 ? 'positive' : 'negative';

        document.getElementById('modalHigh24h').textContent = `$${data.market_data.high_24h.usd.toLocaleString()}`;
        document.getElementById('modalLow24h').textContent = `$${data.market_data.low_24h.usd.toLocaleString()}`;
        document.getElementById('modalVolume24h').textContent = `$${data.market_data.total_volume.usd.toLocaleString()}`;
        document.getElementById('modalMarketCap').textContent = `$${data.market_data.market_cap.usd.toLocaleString()}`;

        // 獲取價格歷史數據並繪製圖表
        await updateChart(cryptoId, '24h');
    } catch (error) {
        console.error('獲取詳細數據時發生錯誤:', error);
    }
}

// 更新圖表
async function updateChart(cryptoId, period) {
    try {
        const response = await fetch(`https://api.coingecko.com/api/v3/coins/${cryptoId}/market_chart?vs_currency=usd&days=${period === '24h' ? '1' : period === '7d' ? '7' : period === '30d' ? '30' : '365'}`);
        const data = await response.json();

        const prices = data.prices;
        const labels = prices.map(price => {
            const date = new Date(price[0]);
            return period === '24h' 
                ? date.toLocaleTimeString('zh-TW', { hour: '2-digit', minute: '2-digit' })
                : date.toLocaleDateString('zh-TW', { month: 'short', day: 'numeric' });
        });
        const values = prices.map(price => price[1]);

        const ctx = document.getElementById('priceChart').getContext('2d');

        if (priceChart) {
            priceChart.destroy();
        }

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
        console.error('更新圖表時發生錯誤:', error);
    }
}

// 更新加密貨幣價格
async function updatePrices() {
    try {
        const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=false&price_change_percentage=24h');
        const prices = await response.json();
        
        const cryptoGrid = document.getElementById('cryptoGrid');
        cryptoGrid.innerHTML = '';
        
        let totalMarketCap = 0;
        let totalVolume = 0;
        let btcMarketCap = 0;
        
        prices.forEach(crypto => {
            totalMarketCap += crypto.market_cap;
            totalVolume += crypto.total_volume;
            if (crypto.symbol.toUpperCase() === 'BTC') {
                btcMarketCap = crypto.market_cap;
            }
            
            const card = document.createElement('div');
            card.className = 'crypto-card';
            card.onclick = () => showCryptoDetail(crypto.id);
            
            const iconClass = cryptoIcons[crypto.symbol.toUpperCase()] || 'fas fa-coins';
            const name = cryptoNames[crypto.symbol.toUpperCase()] || crypto.name;
            
            card.innerHTML = `
                <div class="crypto-header">
                    <i class="${iconClass}"></i>
                    <h2>${name} <span class="crypto-symbol">${crypto.symbol.toUpperCase()}</span></h2>
                </div>
                <div class="crypto-price">
                    <span class="price">$${crypto.current_price.toLocaleString()}</span>
                    <span class="change ${crypto.price_change_percentage_24h >= 0 ? 'positive' : 'negative'}">
                        <i class="fas fa-arrow-${crypto.price_change_percentage_24h >= 0 ? 'up' : 'down'}"></i>
                        ${Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
                    </span>
                </div>
                <div class="crypto-stats">
                    <div class="stat-item">
                        <span class="stat-label">24h 交易量</span>
                        <span class="stat-value">$${formatNumber(crypto.total_volume)}</span>
                    </div>
                    <div class="stat-item">
                        <span class="stat-label">市值</span>
                        <span class="stat-value">$${formatNumber(crypto.market_cap)}</span>
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
        document.getElementById('cryptoGrid').innerHTML = '<p>無法加載加密貨幣數據，請稍後再試。</p>';
    }
}

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