import csv
import requests
import json


tickers = []

with open('tickers.csv') as f:
    reader = csv.reader(f)
    tickers = [row[0] for row in reader]

companies = []


def company_details(ticker):
    url = f'https://data.nasdaq.com/api/v3/datasets/WIKI/{ticker}.json?start_date=2014-01-01&end_date=2014-01-02&api_key=Dsh3qzwuRKxcaFsAw4TJ'
    payload = {}
    headers = {
        'Cookie': 'incap_ses_891_2170999=BjkyYtvp9nf41GSoOXhdDArVh2EAAAAAoztQE8JPDajCIFQgigtAkw==; nlbi_2170999=OyGKe8j4iAUPOr7SKj7S7QAAAAAEbm03nBxw5HJJfeBnnnoz; visid_incap_2170999=wkmSdB0kQpuZfnP1XntTPOHUh2EAAAAAQUIPAAAAAADbz0vKt2rOUi3Oi4aUFToj'
    }
    response = requests.request("GET", url, headers=headers, data=payload)
    companies.append(json.loads(response.text))

print(f'Sorting {len(tickers)} Tickers')

for idx, ticker in enumerate(tickers):
    print(idx+1, ticker)
    company_details(ticker)

with open("companies.json", "w") as f:
    json.dump(companies, f)
