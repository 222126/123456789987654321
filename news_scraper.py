import requests
import json
from datetime import datetime
import time

def fetch_crypto_data():
    # 使用 CryptoCompare API 獲取前500種加密貨幣的數據
    url = "https://min-api.cryptocompare.com/data/top/mktcapfull"
    params = {
        "limit": 500,  # 增加到500
        "tsym": "USD",
        "api_key": "YOUR_API_KEY"  # 請替換為您的 API 密鑰
    }
    
    try:
        response = requests.get(url, params=params)
        if response.status_code == 200:
            data = response.json()
            
            # 處理市場概況數據
            market_data = {
                "totalMarketCap": 0,
                "totalVolume": 0,
                "btcDominance": 0,
                "cryptos": []
            }
            
            # 獲取所有加密貨幣的詳細信息
            for crypto in data["Data"]:
                coin_info = crypto["CoinInfo"]
                raw_data = crypto["RAW"]["USD"]
                
                # 計算總市值和交易量
                market_data["totalMarketCap"] += raw_data["MKTCAP"]
                market_data["totalVolume"] += raw_data["VOLUME24HOUR"]
                
                # 如果是比特幣，記錄其市值用於計算主導率
                if coin_info["Name"] == "BTC":
                    btc_market_cap = raw_data["MKTCAP"]
                
                # 添加加密貨幣數據
                crypto_data = {
                    "symbol": coin_info["Name"],
                    "name": coin_info["FullName"],
                    "price": raw_data["PRICE"],
                    "change24h": raw_data["CHANGEPCT24HOUR"],
                    "volume24h": raw_data["VOLUME24HOUR"],
                    "high24h": raw_data["HIGH24HOUR"],
                    "low24h": raw_data["LOW24HOUR"],
                    "marketCap": raw_data["MKTCAP"],
                    "icon": f"fab fa-{coin_info['Name'].lower()}" if coin_info["Name"].lower() in ["btc", "eth", "xrp", "ltc", "bch", "xlm", "ada", "xmr", "dash", "neo", "etc", "zec", "doge", "bat", "zrx", "rep", "gnt", "omg", "knc", "link", "comp", "uni", "aave", "snx", "yfi", "crv", "bal", "ren", "uma", "sushi", "1inch", "alpha", "perp", "rad", "api3", "badger", "bond", "cover", "cream", "dodo", "fxs", "grt", "keep", "lrc", "mir", "nftx", "perp", "rad", "ren", "srm", "sushi", "uma", "yfi", "zrx"] else "fas fa-coins"
                }
                market_data["cryptos"].append(crypto_data)
            
            # 計算比特幣主導率
            market_data["btcDominance"] = (btc_market_cap / market_data["totalMarketCap"]) * 100
            
            # 保存數據到文件
            with open("prices.json", "w", encoding="utf-8") as f:
                json.dump(market_data, f, ensure_ascii=False, indent=2)
            
            print(f"成功獲取 {len(market_data['cryptos'])} 種加密貨幣的數據")
            return True
            
    except Exception as e:
        print(f"獲取數據時發生錯誤: {str(e)}")
        return False

def fetch_news():
    # 使用 CryptoCompare API 獲取加密貨幣新聞
    url = "https://min-api.cryptocompare.com/data/v2/news/"
    params = {
        "lang": "EN",
        "api_key": "YOUR_API_KEY"
    }
    
    try:
        response = requests.get(url, params=params)
        if response.status_code == 200:
            data = response.json()
            news_list = []
            
            for news in data["Data"]:
                # 處理新聞數據
                news_data = {
                    "title": news["title"],
                    "snippet": news["body"],
                    "link": news["url"],
                    "source": news["source"],
                    "published_at": news["published_on"],
                    "image_url": news.get("imageurl", "https://via.placeholder.com/300x200?text=Crypto+News")  # 使用默認圖片如果沒有圖片URL
                }
                news_list.append(news_data)
            
            # 保存新聞數據到文件
            with open("news.json", "w", encoding="utf-8") as f:
                json.dump(news_list, f, ensure_ascii=False, indent=2)
            
            print(f"成功獲取 {len(news_list)} 條新聞")
            return True
            
    except Exception as e:
        print(f"獲取新聞時發生錯誤: {str(e)}")
        return False

if __name__ == "__main__":
    fetch_crypto_data()
    fetch_news() 