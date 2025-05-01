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

// Function to update cryptocurrency prices
function updatePrices() {
    fetch('prices.json')
        .then(response => response.json())
        .then(prices => {
            const cryptoGrid = document.getElementById('cryptoGrid');
            cryptoGrid.innerHTML = '';
            
            let totalMarketCap = 0;
            let totalVolume = 0;
            let btcMarketCap = 0;
            
            prices.forEach(crypto => {
                totalMarketCap += crypto.market_cap;
                totalVolume += crypto.volume_24h;
                if (crypto.symbol === 'BTC') {
                    btcMarketCap = crypto.market_cap;
                }
                
                const card = document.createElement('div');
                card.className = 'crypto-card';
                
                const iconClass = cryptoIcons[crypto.symbol] || 'fas fa-coins';
                const name = cryptoNames[crypto.symbol] || crypto.symbol;
                
                card.innerHTML = `
                    <div class="crypto-icon">
                        <i class="${iconClass}"></i>
                    </div>
                    <h2>${name} (${crypto.symbol})</h2>
                    <p class="price">$${crypto.price.toLocaleString()}</p>
                    <p class="change ${crypto.change_24h >= 0 ? 'positive' : 'negative'}">
                        <i class="fas fa-arrow-${crypto.change_24h >= 0 ? 'up' : 'down'}"></i> 
                        ${Math.abs(crypto.change_24h).toFixed(2)}%
                    </p>
                    <p class="volume">24h Volume: $${crypto.volume_24h.toLocaleString()}</p>
                    <p class="high-low">
                        High: $${crypto.high_24h.toLocaleString()} | 
                        Low: $${crypto.low_24h.toLocaleString()}
                    </p>
                    <div class="crypto-chart">
                        <canvas id="${crypto.symbol.toLowerCase()}Chart"></canvas>
                    </div>
                `;
                
                cryptoGrid.appendChild(card);
                
                // Initialize chart
                const ctx = card.querySelector('canvas').getContext('2d');
                new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
                        datasets: [{
                            data: Array(6).fill().map(() => crypto.price * (1 + (Math.random() - 0.5) * 0.1)),
                            borderColor: crypto.change_24h >= 0 ? '#2ecc71' : '#e74c3c',
                            tension: 0.4
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                display: false
                            }
                        },
                        scales: {
                            x: { display: false },
                            y: { display: false }
                        }
                    }
                });
            });
            
            // Update market stats
            document.getElementById('totalMarketCap').textContent = 
                `$${(totalMarketCap / 1e12).toFixed(2)}T`;
            document.getElementById('totalVolume').textContent = 
                `$${(totalVolume / 1e9).toFixed(2)}B`;
            document.getElementById('btcDominance').textContent = 
                `${((btcMarketCap / totalMarketCap) * 100).toFixed(1)}%`;
            
            // Update timestamp
            document.querySelector('.last-updated').textContent = 
                `Last Updated: ${new Date().toLocaleString()}`;
        })
        .catch(error => console.error('Error updating prices:', error));
}

// Initialize everything when page loads
document.addEventListener('DOMContentLoaded', () => {
    updatePrices();
    setInterval(updatePrices, 60000); // Update prices every minute
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