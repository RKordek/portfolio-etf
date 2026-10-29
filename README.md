# Mój portfel ETF i ETC

Prosty, statyczny dashboard z czytelnymi nazwami instrumentów, wyceną w PLN i podziałem alokacji.

## Uruchomienie

Otwórz `index.html` w przeglądarce. Projekt nie wymaga instalowania zależności ani serwera.

## Dane

Wycena i liczba jednostek pochodzą z ręcznie zaimportowanego eksportu CSV z mBanku. Aby zaktualizować dane, edytuj tablicę `holdings` w `app.js`.

Aktualne kursy zapisuje workflow GitHub Actions w `data.json`: po otwarciu Europy, po otwarciu USA i po zamknięciu USA. Kursy pochodzą z Yahoo Finance, a wartości są orientacyjne — kurs instrumentu może być notowany na innej giełdzie niż w mBanku.

To projekt informacyjny, nie rekomendacja inwestycyjna.
