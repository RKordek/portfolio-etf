const holdings = [
  {isin:'IE000U9ODG19',name:'iShares Global Aerospace & Defence UCITS ETF',short:'Obrona i lotnictwo',type:'ETF',exchange:'Xetra',qty:120,price:7.88,currency:'EUR',value:4156.01,group:'Sektory'},
  {isin:'IE00BQT3WG13',name:'iShares MSCI China A UCITS ETF',short:'Akcje chińskie A',type:'ETF',exchange:'LSE',qty:80,price:5.30,currency:'USD',value:1672.08,group:'Rynki wschodzące'},
  {isin:'XS2115336336',name:'Royal Mint Responsibly Sourced Physical Gold ETC',short:'Złoto fizyczne',type:'ETC',exchange:'GPW',qty:10,price:156.66,currency:'PLN',value:1566.60,group:'Surowce'},
  {isin:'IE000IQQEL77',name:'Sprott Pure Play Copper Miners UCITS ETF',short:'Spółki wydobywające miedź',type:'ETF',exchange:'GPW',qty:17,price:84.12,currency:'PLN',value:1430.04,group:'Surowce'},
  {isin:'LU0496786574',name:'Amundi Core S&P 500 Swap UCITS ETF EUR Dist',short:'500 największych spółek USA',type:'ETF',exchange:'GPW',qty:9,price:315.35,currency:'PLN',value:2838.15,group:'Rynki rozwinięte'},
  {isin:'IE00BKM4GZ66',name:'iShares Core MSCI Emerging Markets IMI UCITS ETF',short:'Rynki wschodzące — szeroko',type:'ETF',exchange:'Xetra',qty:13,price:45.86,currency:'EUR',value:2620.38,group:'Rynki wschodzące'},
  {isin:'IE000LCKJ888',name:'WisdomTree Physical AI, Humanoids & Drones UCITS ETF',short:'Fizyczna AI, humanoidy i drony',type:'ETF',exchange:'Xetra',qty:50,price:18.27,currency:'EUR',value:4014.04,group:'Sektory'},
  {isin:'IE00B3WJKG14',name:'iShares S&P 500 Information Technology Sector UCITS ETF',short:'Technologie informacyjne USA',type:'ETF',exchange:'Xetra',qty:24,price:47.11,currency:'EUR',value:4969.28,group:'Sektory'},
  {isin:'IE00BMC38736',name:'VanEck Semiconductor UCITS ETF',short:'Półprzewodniki',type:'ETF',exchange:'LSE',qty:12,price:104,currency:'USD',value:4926.23,group:'Sektory'},
  {isin:'IE00B4L5Y983',name:'iShares Core MSCI World UCITS ETF',short:'Akcje rynków rozwiniętych',type:'ETF',exchange:'LSE',qty:5,price:110.02,currency:'GBP',value:2890.50,group:'Rynki rozwinięte'},
  {isin:'IE00B6YX5D40',name:'SPDR S&P U.S. Dividend Aristocrats UCITS ETF',short:'Amerykańskie spółki dywidendowe',type:'ETF',exchange:'LSE',qty:10,price:87.93,currency:'USD',value:3470.86,group:'Rynki rozwinięte'},
  {isin:'IE00B4ND3602',name:'iShares Physical Gold ETC',short:'Złoto fizyczne',type:'ETC',exchange:'LSE',qty:1,price:58.59,currency:'GBP',value:307.86,group:'Surowce'}
];
const pln = new Intl.NumberFormat('pl-PL',{style:'currency',currency:'PLN',maximumFractionDigits:2});
const total = holdings.reduce((sum,x)=>sum+x.value,0);
const fmt = x => pln.format(x); const pct=x=>`${(x/total*100).toFixed(1)}%`;
document.querySelector('#total').textContent=fmt(total);
const largest=[...holdings].sort((a,b)=>b.value-a.value)[0];
document.querySelector('#largest').textContent=largest.short;
document.querySelector('#largest-detail').textContent=`${fmt(largest.value)} · ${pct(largest.value)} portfela`;
const developed=holdings.filter(x=>x.group==='Rynki rozwinięte').reduce((s,x)=>s+x.value,0);
document.querySelector('#developed').textContent=pct(developed);
document.querySelector('#timestamp').textContent=new Intl.DateTimeFormat('pl-PL',{dateStyle:'long'}).format(new Date());
const colors=['#b9eb68','#9ed6e1','#ffc57a','#d8c7ff'];
const groups=Object.entries(holdings.reduce((a,x)=>((a[x.group]=(a[x.group]||0)+x.value),a),{}));
document.querySelector('#allocation').innerHTML=groups.map(([name,value],i)=>`<div class="allocation-item" style="--accent:${colors[i]}"><strong>${pct(value)}</strong><span>${name}</span><span>${fmt(value)}</span></div>`).join('');
let sortDescending=true;
function render(){const q=document.querySelector('#search').value.toLowerCase();const kind=document.querySelector('#filter').value;let data=holdings.filter(x=>(kind==='all'||x.type===kind)&&`${x.name} ${x.short} ${x.isin}`.toLowerCase().includes(q));data.sort((a,b)=>sortDescending?b.value-a.value:a.value-b.value);document.querySelector('#rows').innerHTML=data.map(x=>`<tr><td><span class="name">${x.name}</span><span class="isin">${x.isin}</span></td><td><span class="tag">${x.short}</span></td><td>${x.exchange}</td><td class="numeric">${x.qty}</td><td class="numeric">${x.price.toLocaleString('pl-PL')} ${x.currency}</td><td class="numeric">${fmt(x.value)}</td><td class="numeric"><span class="share">${pct(x.value)}</span></td></tr>`).join('');}
document.querySelector('#search').addEventListener('input',render);document.querySelector('#filter').addEventListener('change',render);document.querySelector('.sortable').addEventListener('click',()=>{sortDescending=!sortDescending;render()});render();
