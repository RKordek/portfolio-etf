import json
import os
import sys
from datetime import datetime
from pathlib import Path
from zoneinfo import ZoneInfo

import yfinance as yf

ROOT = Path(__file__).parents[1]
OUTPUT = ROOT / "data.json"

# Pierwszy ticker to docelowe notowanie z portfela. Przy braku danych Yahoo
# używamy równoważnego notowania zagranicznego, aby nie blokować całego snapshotu.
INSTRUMENTS = {
    "IE000U9ODG19": ("5J50.DE",), "IE00BQT3WG13": ("CNYA.L",),
    "XS2115336336": ("ETCGLDRMAU.WA", "RMAU.L"),
    "IE000IQQEL77": ("ETFHANCPPR.WA", "COPP.L"),
    "LU0496786574": ("ETFSP500.WA", "LYPS.DE"),
    "IE00BKM4GZ66": ("IS3N.DE",), "IE000LCKJ888": ("PAIW.DE",),
    "IE00B3WJKG14": ("QDVE.DE",), "IE00BMC38736": ("SMH.L",),
    "IE00B4L5Y983": ("SWDA.L",), "IE00B6YX5D40": ("UDVD.L",),
    "IE00B4ND3602": ("SGLN.L",),
}

def scheduled_window():
    warsaw = datetime.now(ZoneInfo("Europe/Warsaw"))
    new_york = datetime.now(ZoneInfo("America/New_York"))
    europe = warsaw.hour == 9 and 35 <= warsaw.minute <= 55
    us_open = new_york.hour == 9 and 35 <= new_york.minute <= 55
    us_close = new_york.hour == 16 and 5 <= new_york.minute <= 30
    return europe or us_open or us_close

def latest_quote(symbol):
    history = yf.Ticker(symbol).history(period="5d", auto_adjust=False)
    if history.empty:
        raise ValueError("brak notowań")
    price = float(history["Close"].dropna().iloc[-1])
    currency = yf.Ticker(symbol).fast_info.get("currency") or "USD"
    # Yahoo opisuje część londyńskich notowań w pensach, a aplikacja pokazuje GBP.
    if currency in {"GBp", "GBX"}:
        return price / 100, "GBP"
    return price, currency

def fx_rate(currency):
    if currency == "PLN":
        return 1.0
    history = yf.Ticker(f"{currency}PLN=X").history(period="5d")
    if history.empty:
        raise ValueError(f"brak kursu {currency}/PLN")
    return float(history["Close"].dropna().iloc[-1])

def main():
    # Ręczne uruchomienie zawsze odświeża. Zdarzenia harmonogramu poza oknem
    # czasu letniego/zimowego kończą się bez zmian.
    if os.getenv("GITHUB_EVENT_NAME") == "schedule" and not scheduled_window():
        return
    quotes, currencies = {}, set()
    for isin, symbols in INSTRUMENTS.items():
        for symbol in symbols:
            try:
                price, currency = latest_quote(symbol)
                quotes[isin] = {"price": round(price, 4), "currency": currency, "symbol": symbol}
                currencies.add(currency)
                break
            except Exception as error:
                print(f"{isin} ({symbol}): {error}", file=sys.stderr)
    if not quotes:
        raise RuntimeError("Nie udało się pobrać żadnej wyceny")
    rates = {currency: round(fx_rate(currency), 6) for currency in currencies}
    payload = {
        "updatedAt": datetime.now(ZoneInfo("Europe/Warsaw")).isoformat(),
        "quotes": quotes,
        "fxRates": rates,
        "successfulQuotes": len(quotes),
    }
    OUTPUT.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")

if __name__ == "__main__":
    main()
