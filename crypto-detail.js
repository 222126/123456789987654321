// 從URL獲取加密貨幣符號
const urlParams = new URLSearchParams(window.location.search);
const symbol = urlParams.get('symbol');

// 格式化數字
function formatNumber(num) {
    if (num >= 1e12) {
        return `$${(num / 1e12).toFixed(2)}T`;
    } else if (num >= 1e9) {
        return `$${(num / 1e9).toFixed(2)}B`;
    } else if (num >= 1e6) {
        return `$${(num / 1e6).toFixed(2)}M`;
    } else if (num >= 1e3) {
        return `$${(num / 1e3).toFixed(2)}K`;
    }
    return `$${num.toFixed(2)}`;
}

// 格式化百分比
function formatPercentage(num) {
    return `${num >= 0 ? '+' : ''}${num.toFixed(2)}%`;
}

// 更新頁面數據
async function updateCryptoDetail() {
    try {
        // 獲取加密貨幣數據
        const response = await fetch('prices.json');
        const data = await response.json();
        
        // 找到當前加密貨幣
        const crypto = data.cryptos.find(c => c.symbol === symbol);
        if (!crypto) {
            throw new Error('找不到該加密貨幣');
        }
        
        // 更新頁面標題
        document.title = `${crypto.name} (${crypto.symbol}) - 加密貨幣資訊網`;
        
        // 更新標題區域
        document.getElementById('cryptoIcon').className = `crypto-icon ${crypto.icon}`;
        document.getElementById('cryptoName').textContent = crypto.name;
        document.getElementById('cryptoSymbol').textContent = crypto.symbol;
        
        // 更新價格信息
        document.getElementById('currentPrice').textContent = formatNumber(crypto.price);
        const changeElement = document.getElementById('priceChange');
        changeElement.textContent = formatPercentage(crypto.change24h);
        changeElement.className = `change ${crypto.change24h >= 0 ? 'positive' : 'negative'}`;
        
        // 更新24小時高低點
        document.getElementById('high24h').textContent = formatNumber(crypto.high24h);
        document.getElementById('low24h').textContent = formatNumber(crypto.low24h);
        
        // 更新統計數據
        document.getElementById('marketCap').textContent = formatNumber(crypto.marketCap);
        document.getElementById('volume24h').textContent = formatNumber(crypto.volume24h);
        
        // 計算並顯示其他指標
        const volMktCap = (crypto.volume24h / crypto.marketCap) * 100;
        document.getElementById('volMktCap').textContent = `${volMktCap.toFixed(2)}%`;
        
        // 獲取更多詳細數據
        const detailResponse = await fetch(`https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${symbol}&tsyms=USD&api_key=YOUR_API_KEY`);
        const detailData = await detailResponse.json();
        const rawData = detailData.RAW[symbol].USD;
        
        // 更新供應量數據
        document.getElementById('totalSupply').textContent = formatNumber(rawData.SUPPLY);
        document.getElementById('maxSupply').textContent = rawData.MAXSUPPLY ? formatNumber(rawData.MAXSUPPLY) : 'N/A';
        document.getElementById('fdv').textContent = formatNumber(rawData.MAXSUPPLY ? rawData.MAXSUPPLY * rawData.PRICE : crypto.marketCap);
        
        // 創建價格圖表
        createPriceChart(crypto);
        
        // 創建交易量圖表
        createVolumeChart(crypto);
        
        // 加載相關新聞
        loadRelatedNews(crypto.name);
        
    } catch (error) {
        console.error('更新數據時發生錯誤:', error);
        alert('獲取數據時發生錯誤，請稍後再試');
    }
}

// 創建價格圖表
function createPriceChart(crypto) {
    const ctx = document.getElementById('priceChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: Array(24).fill().map((_, i) => `${i}:00`),
            datasets: [{
                label: '價格',
                data: Array(24).fill().map(() => crypto.price * (1 + (Math.random() - 0.5) * 0.1)),
                borderColor: crypto.change24h >= 0 ? '#2ecc71' : '#e74c3c',
                tension: 0.4,
                fill: false
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
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}

// 創建交易量圖表
function createVolumeChart(crypto) {
    const ctx = document.getElementById('volumeChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Array(24).fill().map((_, i) => `${i}:00`),
            datasets: [{
                label: '交易量',
                data: Array(24).fill().map(() => crypto.volume24h * (0.5 + Math.random() * 0.5)),
                backgroundColor: '#3498db',
                borderColor: '#2980b9',
                borderWidth: 1
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
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// 加載相關新聞
async function loadRelatedNews(cryptoName) {
    try {
        const response = await fetch('news.json');
        const newsList = await response.json();
        
        // 過濾相關新聞
        const relatedNews = newsList.filter(news => 
            news.title.toLowerCase().includes(cryptoName.toLowerCase()) ||
            news.snippet.toLowerCase().includes(cryptoName.toLowerCase())
        ).slice(0, 6); // 只顯示前6條相關新聞
        
        const newsContainer = document.getElementById('relatedNews');
        newsContainer.innerHTML = '';
        
        relatedNews.forEach(news => {
            const shortSnippet = news.snippet.length > 100 ? 
                news.snippet.substring(0, 100) + '...' : 
                news.snippet;
            
            newsContainer.innerHTML += `
                <article class="news-card">
                    <div class="news-image">
                        <img src="${news.image_url}" alt="${news.title}" onerror="this.src='https://via.placeholder.com/300x200?text=Crypto+News'">
                    </div>
                    <div class="news-content">
                        <a href="${news.link}" target="_blank">
                            <h3>${news.title}</h3>
                        </a>
                        <p class="news-snippet">${shortSnippet}</p>
                        <div class="news-meta">
                            <span class="news-source">${news.source}</span>
                            <span class="news-date">${new Date(news.published_at * 1000).toLocaleDateString('zh-TW', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}</span>
                        </div>
                    </div>
                </article>
            `;
        });
        
    } catch (error) {
        console.error('加載新聞時發生錯誤:', error);
    }
}

// 頁面加載時初始化
document.addEventListener('DOMContentLoaded', () => {
    if (symbol) {
        updateCryptoDetail();
    } else {
        alert('未指定加密貨幣');
        window.location.href = 'index.html';
    }
}); 