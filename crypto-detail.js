// 從URL獲取加密貨幣符號
const urlParams = new URLSearchParams(window.location.search);
const symbol = urlParams.get('symbol');

// 格式化數字
function formatNumber(num) {
    if (num >= 1e12) {
        return (num / 1e12).toFixed(2) + 'T';
    } else if (num >= 1e9) {
        return (num / 1e9).toFixed(2) + 'B';
    } else if (num >= 1e6) {
        return (num / 1e6).toFixed(2) + 'M';
    } else if (num >= 1e3) {
        return (num / 1e3).toFixed(2) + 'K';
    }
    return num.toFixed(2);
}

// 格式化百分比
function formatPercentage(num) {
    return (num * 100).toFixed(2) + '%';
}

// 更新頁面數據
async function updateCryptoData() {
    try {
        const response = await fetch('prices.json');
        const data = await response.json();
        
        const crypto = data.find(c => c.symbol === symbol);
        if (!crypto) {
            throw new Error('找不到該加密貨幣');
        }

        // 更新基本信息
        document.getElementById('cryptoName').textContent = crypto.name;
        document.getElementById('cryptoSymbol').textContent = crypto.symbol;
        document.getElementById('currentPrice').textContent = `$${formatNumber(crypto.price)}`;
        document.getElementById('priceChange').textContent = formatPercentage(crypto.change24h);
        document.getElementById('priceChange').className = `change ${crypto.change24h >= 0 ? 'positive' : 'negative'}`;
        document.getElementById('high24h').textContent = `$${formatNumber(crypto.high24h)}`;
        document.getElementById('low24h').textContent = `$${formatNumber(crypto.low24h)}`;

        // 更新詳細指標
        document.getElementById('marketCap').textContent = `$${formatNumber(crypto.marketCap)}`;
        document.getElementById('volume24h').textContent = `$${formatNumber(crypto.volume24h)}`;
        document.getElementById('fdv').textContent = `$${formatNumber(crypto.fdv)}`;
        document.getElementById('volMktCap').textContent = formatPercentage(crypto.volume24h / crypto.marketCap);
        document.getElementById('totalSupply').textContent = formatNumber(crypto.totalSupply);
        document.getElementById('maxSupply').textContent = crypto.maxSupply ? formatNumber(crypto.maxSupply) : 'N/A';
        document.getElementById('circulatingSupply').textContent = formatNumber(crypto.circulatingSupply);
        document.getElementById('circulatingRate').textContent = formatPercentage(crypto.circulatingSupply / crypto.totalSupply);

        // 更新圖表
        updateCharts(crypto);

        // 加載相關新聞
        loadRelatedNews(crypto.name);

    } catch (error) {
        console.error('Error:', error);
        alert('獲取數據時發生錯誤');
    }
}

// 更新圖表
function updateCharts(crypto) {
    const priceCtx = document.getElementById('priceChart').getContext('2d');
    const volumeCtx = document.getElementById('volumeChart').getContext('2d');

    // 價格圖表
    new Chart(priceCtx, {
        type: 'line',
        data: {
            labels: crypto.priceHistory.map((_, i) => `${i}h`),
            datasets: [{
                label: '價格',
                data: crypto.priceHistory,
                borderColor: crypto.change24h >= 0 ? 'rgb(75, 192, 192)' : 'rgb(255, 99, 132)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: '24小時價格趨勢'
                }
            },
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });

    // 交易量圖表
    new Chart(volumeCtx, {
        type: 'bar',
        data: {
            labels: crypto.volumeHistory.map((_, i) => `${i}h`),
            datasets: [{
                label: '交易量',
                data: crypto.volumeHistory,
                backgroundColor: 'rgba(54, 162, 235, 0.5)'
            }]
        },
        options: {
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: '24小時交易量趨勢'
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
        const news = await response.json();
        
        const relatedNews = news.filter(article => 
            article.title.toLowerCase().includes(cryptoName.toLowerCase()) ||
            article.description.toLowerCase().includes(cryptoName.toLowerCase())
        );

        const newsList = document.getElementById('relatedNews');
        newsList.innerHTML = '';

        relatedNews.forEach(article => {
            const newsItem = document.createElement('div');
            newsItem.className = 'news-item';
            newsItem.innerHTML = `
                <div class="news-image">
                    <img src="${article.image || 'default-news.jpg'}" alt="${article.title}">
                </div>
                <div class="news-content">
                    <h4>${article.title}</h4>
                    <p>${article.description}</p>
                    <div class="news-meta">
                        <span class="news-date">${article.date}</span>
                        <a href="${article.url}" target="_blank" class="read-more">閱讀更多</a>
                    </div>
                </div>
            `;
            newsList.appendChild(newsItem);
        });

    } catch (error) {
        console.error('Error loading news:', error);
    }
}

// 搜索功能
function searchCrypto() {
    const searchInput = document.getElementById('crypto-search');
    const searchTerm = searchInput.value.trim().toUpperCase();
    
    if (searchTerm) {
        window.location.href = `crypto-detail.html?symbol=${searchTerm}`;
    }
}

// 頁面加載時更新數據
document.addEventListener('DOMContentLoaded', () => {
    if (symbol) {
        updateCryptoData();
    } else {
        alert('未指定加密貨幣');
        window.location.href = 'index.html';
    }
}); 