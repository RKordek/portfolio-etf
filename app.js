const holdings = [
  {isin:'IE000U9ODG19',name:'iShares Global Aerospace & Defence UCITS ETF',short:'Obrona i lotnictwo',type:'ETF',exchange:'Xetra',qty:120,price:7.88,cost:8.00,costCurrency:'EUR',currency:'EUR',value:4156.01,group:'Sektory'},
  {isin:'IE00BQT3WG13',name:'iShares MSCI China A UCITS ETF',short:'Akcje chińskie A',type:'ETF',exchange:'LSE',qty:80,price:5.30,cost:4.38,costCurrency:'USD',currency:'USD',value:1672.08,group:'Rynki wschodzące'},
  {isin:'XS2115336336',name:'Royal Mint Responsibly Sourced Physical Gold ETC',short:'Złoto fizyczne',type:'ETC',exchange:'GPW',qty:10,price:156.66,cost:156.71,costCurrency:'PLN',currency:'PLN',value:1566.60,group:'Surowce'},
  {isin:'IE000IQQEL77',name:'Sprott Pure Play Copper Miners UCITS ETF',short:'Spółki wydobywające miedź',type:'ETF',exchange:'GPW',qty:17,price:84.12,cost:81.12,costCurrency:'PLN',currency:'PLN',value:1430.04,group:'Surowce'},
  {isin:'LU0496786574',name:'Amundi Core S&P 500 Swap UCITS ETF EUR Dist',short:'500 największych spółek USA',type:'ETF',exchange:'GPW',qty:9,price:315.35,cost:312.65,costCurrency:'PLN',currency:'PLN',value:2838.15,group:'Rynki rozwinięte'},
  {isin:'IE00BKM4GZ66',name:'iShares Core MSCI Emerging Markets IMI UCITS ETF',short:'Rynki wschodzące — szeroko',type:'ETF',exchange:'Xetra',qty:13,price:45.86,cost:28.64,costCurrency:'EUR',currency:'EUR',value:2620.38,group:'Rynki wschodzące'},
  {isin:'IE000LCKJ888',name:'WisdomTree Physical AI, Humanoids & Drones UCITS ETF',short:'Fizyczna AI, humanoidy i drony',type:'ETF',exchange:'Xetra',qty:50,price:18.27,cost:19.16,costCurrency:'EUR',currency:'EUR',value:4014.04,group:'Sektory'},
  {isin:'IE00B3WJKG14',name:'iShares S&P 500 Information Technology Sector UCITS ETF',short:'Technologie informacyjne USA',type:'ETF',exchange:'Xetra',qty:24,price:47.11,cost:47.41,costCurrency:'EUR',currency:'EUR',value:4969.28,group:'Sektory'},
  {isin:'IE00BMC38736',name:'VanEck Semiconductor UCITS ETF',short:'Półprzewodniki',type:'ETF',exchange:'LSE',qty:12,price:104,cost:108.41,costCurrency:'USD',currency:'USD',value:4926.23,group:'Sektory'},
  {isin:'IE00B4L5Y983',name:'iShares Core MSCI World UCITS ETF',short:'Akcje rynków rozwiniętych',type:'ETF',exchange:'LSE',qty:5,price:110.02,cost:85.01,costCurrency:'GBP',currency:'GBP',value:2890.50,group:'Rynki rozwinięte'},
  {isin:'IE00B6YX5D40',name:'SPDR S&P U.S. Dividend Aristocrats UCITS ETF',short:'Amerykańskie spółki dywidendowe',type:'ETF',exchange:'LSE',qty:10,price:87.93,cost:68.91,costCurrency:'USD',currency:'USD',value:3470.86,group:'Rynki rozwinięte'},
  {isin:'IE00B4ND3602',name:'iShares Physical Gold ETC',short:'Złoto fizyczne',type:'ETC',exchange:'LSE',qty:1,price:58.59,cost:72.59,costCurrency:'GBP',currency:'GBP',value:307.86,group:'Surowce'}
];

const pln = new Intl.NumberFormat('pl-PL',{style:'currency',currency:'PLN',maximumFractionDigits:2});
const fmt = x => pln.format(x);
let sortDescending = true;

function returnPercent(position) {
  if (position.currency !== position.costCurrency) return null;
  return (position.price / position.cost - 1) * 100;
}

function render(updatedAt, source) {
  const total = holdings.reduce((sum,x)=>sum+x.value,0);
  const pct = x => `${(x / total * 100).toFixed(1)}%`;
  document.querySelector('#total').textContent = fmt(total);
  const largest = [...holdings].sort((a,b)=>b.value-a.value)[0];
  document.querySelector('#largest').textContent = largest.short;
  document.querySelector('#largest-detail').textContent = `${fmt(largest.value)} · ${pct(largest.value)} portfela`;
  const developed = holdings.filter(x=>x.group==='Rynki rozwinięte').reduce((s,x)=>s+x.value,0);
  document.querySelector('#developed').textContent = pct(developed);
  document.querySelector('#timestamp').textContent = updatedAt || 'snapshot CSV';
  document.querySelector('#quote-source').textContent = source || 'Źródło wyceny: eksport CSV z mBanku.';
  const colors=['#b9eb68','#9ed6e1','#ffc57a','#d8c7ff'];
  const groups=Object.entries(holdings.reduce((a,x)=>((a[x.group]=(a[x.group]||0)+x.value),a),{}));
  document.querySelector('#allocation').innerHTML=groups.map(([name,value],i)=>`<div class="allocation-item" style="--accent:${colors[i]}"><strong>${pct(value)}</strong><span>${name}</span><span>${fmt(value)}</span></div>`).join('');
  const drawRows = () => {
    const q=document.querySelector('#search').value.toLowerCase();
    const kind=document.querySelector('#filter').value;
    const data=holdings.filter(x=>(kind==='all'||x.type===kind)&&`${x.name} ${x.short} ${x.isin}`.toLowerCase().includes(q)).sort((a,b)=>{
      const left=returnPercent(a), right=returnPercent(b);
      if (left === null) return 1;
      if (right === null) return -1;
      return sortDescending ? right-left : left-right;
    });
    document.querySelector('#rows').innerHTML=data.map(x=>{
      const result=returnPercent(x);
      const resultText=result === null ? '—' : `${result >= 0 ? '+' : ''}${result.toFixed(1)}%`;
      const resultClass=result === null ? '' : result >= 0 ? 'positive' : 'negative';
      return `<tr><td><span class="name">${x.name}</span><span class="isin">${x.isin}</span></td><td><span class="tag">${x.short}</span></td><td>${x.exchange}</td><td class="numeric">${x.qty}</td><td class="numeric">${x.price.toLocaleString('pl-PL',{maximumFractionDigits:4})} ${x.currency}</td><td class="numeric">${x.cost.toLocaleString('pl-PL',{maximumFractionDigits:4})} ${x.costCurrency}</td><td class="numeric result ${resultClass}">${resultText}</td><td class="numeric">${fmt(x.value)}</td><td class="numeric"><span class="share">${pct(x.value)}</span></td></tr>`;
    }).join('');
  };
  document.querySelector('#search').oninput=drawRows;
  document.querySelector('#filter').onchange=drawRows;
  document.querySelector('.sortable').onclick=()=>{sortDescending=!sortDescending;drawRows()};
  drawRows();
}

async function loadQuotes() {
  try {
    const response = await fetch(`./data.json?v=${Date.now()}`, {cache:'no-store'});
    const data = await response.json();
    if (!data.quotes || !data.fxRates || Object.keys(data.quotes).length === 0) throw new Error('Brak aktualnych danych');
    holdings.forEach(position => {
      const quote = data.quotes[position.isin];
      if (!quote) return;
      position.price = quote.price;
      position.currency = quote.currency;
      position.value = quote.price * position.qty * (data.fxRates[quote.currency] || 1);
    });
    const date = new Intl.DateTimeFormat('pl-PL',{dateStyle:'medium',timeStyle:'short',timeZone:'Europe/Warsaw'}).format(new Date(data.updatedAt));
    render(date, `Kursy: Yahoo Finance · automatyczna aktualizacja · ${data.successfulQuotes}/${holdings.length} instrumentów.`);
  } catch {
    render(null, 'Źródło wyceny: eksport CSV z mBanku. Automatyczne kursy będą widoczne po pierwszym udanym odświeżeniu.');
  }
}

loadQuotes();
