import requests
import json
import logging
from datetime import datetime

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def get_crypto_prices():
    try:
        # CoinDesk API endpoint
        url = 'https://data-api.coindesk.com/spot/v1/latest/tick'
        
        # API parameters
        params = {
            "market": "coinbase",
            "instruments": "BTC-USD,ETH-USD",
            "apply_mapping": "true",
            "api_key": "ef319ef94d30f1392c60a62f6b693720b052dab8f07ff80d0543a35b78b13f08"
        }
        
        headers = {
            "Content-type": "application/json; charset=UTF-8"
        }
        
        logger.info("Fetching cryptocurrency prices...")
        response = requests.get(url, params=params, headers=headers)
        
        if response.status_code != 200:
            logger.error(f"API request failed with status code: {response.status_code}")
            logger.error(f"Response content: {response.text}")
            return {}
        
        data = response.json()
        logger.info(f"Received data: {data}")
        
        # Format the prices
        formatted_prices = {
            'BTC': {
                'price': data.get('BTC-USD', {}).get('last', 0),
                'change': data.get('BTC-USD', {}).get('change', 0),
                'volume': data.get('BTC-USD', {}).get('volume', 0),
                'high': data.get('BTC-USD', {}).get('high', 0),
                'low': data.get('BTC-USD', {}).get('low', 0)
            },
            'ETH': {
                'price': data.get('ETH-USD', {}).get('last', 0),
                'change': data.get('ETH-USD', {}).get('change', 0),
                'volume': data.get('ETH-USD', {}).get('volume', 0),
                'high': data.get('ETH-USD', {}).get('high', 0),
                'low': data.get('ETH-USD', {}).get('low', 0)
            },
            'timestamp': datetime.now().isoformat()
        }
        
        # Save to JSON file
        with open('prices.json', 'w', encoding='utf-8') as f:
            json.dump(formatted_prices, f, ensure_ascii=False, indent=4)
        
        logger.info("Successfully saved prices to prices.json")
        return formatted_prices
        
    except Exception as e:
        logger.error(f"Error fetching prices: {e}")
        return {}

if __name__ == '__main__':
    get_crypto_prices() 