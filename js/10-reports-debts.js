// ── REPORT PERIOD FILTER ──
function getReportFiltered() {
  var period = state.reportPeriod || 'month';
  var now = new Date();
  var todayStr = today();
  if(period === 'custom') {
    var startEl = document.getElementById('rptCustomStart');
    var endEl = document.getElementById('rptCustomEnd');
    var s = startEl ? startEl.value : '';
    var e = endEl ? endEl.value : '';
    if(!s || !e) return state.transactions.filter(function(t){return t&&t.date;});
    return state.transactions.filter(function(t){return t&&t.date&&t.date>=s&&t.date<=e;});
  }
  return state.transactions.filter(function(t) {
    if(!t||!t.date) return false;
    var d = new Date(t.date+'T12:00:00');
    if(period==='day') return t.date===todayStr;
    if(period==='week'){var w=new Date(now);w.setDate(w.getDate()-7);return d>=w;}
    if(period==='month') return d.getMonth()===now.getMonth()&&d.getFullYear()===now.getFullYear();
    if(period==='quarter'){var q=Math.floor(now.getMonth()/3);var qs=new Date(now.getFullYear(),q*3,1);return d>=qs;}
    if(period==='year') return d.getFullYear()===now.getFullYear();
    return true;
  });
}



function updateRptPeriodPills() {
  var pills = document.querySelectorAll('.rpt-period-pill');
  var L = {
    day:     {en:'Daily',       ar:'يومي',         de:'Täglich'},
    week:    {en:'Weekly',      ar:'أسبوعي',       de:'Wöchentlich'},
    month:   {en:'Monthly',     ar:'شهري',         de:'Monatlich'},
    quarter: {en:'Quarterly',   ar:'ربع سنوي',     de:'Vierteljährlich'},
    year:    {en:'Yearly',      ar:'سنوي',         de:'Jährlich'},
    custom:  {en:'Custom',      ar:'مخصص',         de:'Benutzerdefiniert'},
  };
  pills.forEach(function(pill) {
    var p = pill.getAttribute('data-rpt-period');
    if(p&&L[p]) pill.textContent = L[p][state.lang]||L[p].en;
  });
  var pdfLbl = document.getElementById('rpt-pdf-lbl');
  if(pdfLbl) pdfLbl.textContent = {en:'PDF',ar:'PDF',de:'PDF'}[state.lang]||'PDF';
  var shareLbl = document.getElementById('rpt-share-lbl');
  if(shareLbl) shareLbl.textContent = {en:'Share',ar:'مشاركة',de:'Teilen'}[state.lang]||'Share';
}

// ── REPORTS ──
function renderReports() {
  var periodTxs = getReportFiltered();
  var rp = state.reportPeriod || 'month';
  var ni = calculateNetIncome(periodTxs);

  var curLbl = getCurrencyLabel(state.currency);
  var vatSubLbl = {en:'Net', ar:'صافي', de:'Netto'}[state.lang]||'Net';
  var vatSubLbl2 = {en:'VAT', ar:'ضريبة', de:'MwSt'}[state.lang]||'VAT';
  function vatSub(netto, vat) {
    return '<div style="font-size:11px;color:var(--text3);margin-top:2px">' + vatSubLbl + ': ' + fmt(netto) + ' · ' + vatSubLbl2 + ': ' + fmt(vat) + '</div>';
  }
  var rows2 = [
    [t('totalIncome'),    fmt(ni.totalIncome),   'var(--green)', vatSub(ni.incomeNetto, ni.incomeVat)],
    [t('totalExpenses'),  fmt(ni.totalExpenses), 'var(--red)',   vatSub(ni.expenseNetto, ni.expenseVat)],
  ];
  rows2.push([t('transactions'), periodTxs.length, 'var(--text)', '']);
  rows2.push([{en:'Currency',ar:'العملة',de:'Währung'}[state.lang]||'Currency', curLbl, 'var(--text2)', '']);
  document.getElementById('reportRows').innerHTML = rows2.map(function(r){
    return '<div class="report-row" style="align-items:flex-start"><span class="report-row-label">'+r[0]+r[3]+'</span><span class="report-row-val" style="color:'+r[2]+'">'+r[1]+'</span></div>';
  }).join('');

  var periodTitleMap = {
    day:     {en:'Today',         ar:'اليوم',           de:'Heute'},
    week:    {en:'This Week',     ar:'هذا الأسبوع',     de:'Diese Woche'},
    month:   {en:'This Month',    ar:'هذا الشهر',       de:'Diesen Monat'},
    quarter: {en:'This Quarter',  ar:'هذا الربع',       de:'Dieses Quartal'},
    year:    {en:'This Year',     ar:'هذا العام',       de:'Dieses Jahr'},
    custom:  {en:'Custom Period', ar:'فترة مخصصة',      de:'Benutzerdefiniert'},
  };
  var rptPeriodEl = document.getElementById('rpt-period-title');
  if(rptPeriodEl) rptPeriodEl.textContent = (periodTitleMap[rp]&&periodTitleMap[rp][state.lang]) || periodTitleMap[rp].en;
  updateRptPeriodPills();
  renderInvoiceDownloadSection();
}



// ── DEBTS PAGE ──
 // legacy no-op kept for safety

function updateDebtTabs() {
  var tabs = document.querySelectorAll('.debt-tab');
  if(tabs[0]) tabs[0].textContent = t('owesMe');
  if(tabs[1]) tabs[1].textContent = t('iOwe');
}

function renderDebtsPage() {
  var list = document.getElementById('debtsList');
  if(!list) return;
  var lang = state.lang;

  var pgTitle = document.getElementById('debts-page-title');
  if(pgTitle) pgTitle.textContent = t('debts');

  var owesMe = state.debts.filter(function(d){ return d.status !== 'paid' && d.type !== 'i-owe'; });
  var iOwe   = state.debts.filter(function(d){ return d.status !== 'paid' && d.type === 'i-owe'; });
  var totalOwesMe = owesMe.reduce(function(s,d){return s+d.amount;},0);
  var totalIOwe   = iOwe.reduce(function(s,d){return s+d.amount;},0);
  var netBal = totalOwesMe - totalIOwe;

  var owesLbl = {en:'Owes Me', ar:'دائن لي', de:'Gläubiger'}[lang]||'Owes Me';
  var iOweLbl = {en:'I Owe',   ar:'أنا مدين', de:'Schuldner'}[lang]||'I Owe';
  var netLbl  = {en:'Net Balance', ar:'الرصيد الصافي', de:'Nettosaldo'}[lang]||'Net Balance';
  var noDebtLbl = t('noDebts').split('\n')[0];
  var activeTab = state.debtTab || 'owes';

  var paidDebts = state.debts.filter(function(d){ return d.status === 'paid'; });
  var paidLbl     = {en:'Paid Debts',ar:'الديون المسددة',de:'Bezahlte Schulden'}[lang]||'Paid Debts';
  var markPaidLbl = svgIcon('check',13) + ' ' + ({en:'Mark as Paid',ar:'كمدفوع',de:'Bezahlt'}[lang]||'Mark as Paid');
  var editLblD    = svgIcon('pencil',14);
  var delLblD     = svgIcon('trash',14);

  function debtCard(d, isPaid) {
    var days = daysAgo(d.date);
    var badgeCls = isPaid ? 'paid' : (days > 3 ? 'late' : 'active');
    var badgeLbl = isPaid ? ({en:'Paid',ar:'مدفوع',de:'Bezahlt'}[lang]||'Paid') : (days > 3 ? t('overdue') : t('active'));
    var card = '<div class="debt-item" id="debt-card-'+d.id+'" style="margin-bottom:10px;flex-wrap:wrap;gap:8px">'
      +'<div class="debt-avatar">'+d.person.charAt(0).toUpperCase()+'</div>'
      +'<div class="debt-info" style="flex:1;min-width:0"><div class="debt-name">'+escHtml(d.person)+'</div>'
      +'<div class="debt-meta">'+tc(d.category)+' · '+daysAgoStr(days)+'</div>'
      +(d.notes?'<div style="font-size:11px;color:var(--text3);margin-top:2px">'+escHtml(d.notes)+'</div>':'')
      +'</div>'
      +'<div class="debt-right">'
      +'<div class="debt-amount">'+fmt(d.amount)+'</div>'
      +'<div class="debt-badge '+badgeCls+'">'+badgeLbl+'</div>'
      +'</div>';
    if(!isPaid) {
      card += '<div style="width:100%;display:flex;gap:6px;margin-top:4px">'
        +'<button id="db-paid-'+d.id+'" style="flex:1;padding:7px 6px;background:rgba(46,125,50,0.1);color:var(--green);border:none;border-radius:8px;font-size:11px;font-weight:600;cursor:pointer">'+markPaidLbl+'</button>'
        +'<button id="db-edit-'+d.id+'" style="padding:7px 10px;background:var(--primary-light);color:var(--primary);border:none;border-radius:8px;font-size:13px;cursor:pointer">'+editLblD+'</button>'
        +'<button id="db-del-'+d.id+'" style="padding:7px 10px;background:rgba(239,68,68,0.1);color:#ef4444;border:none;border-radius:8px;font-size:13px;cursor:pointer">'+delLblD+'</button>'
        +'</div>';
    } else {
      card += '<div style="width:100%;display:flex;gap:6px;margin-top:4px">'
        +'<button id="db-del-'+d.id+'" style="padding:7px 10px;background:rgba(239,68,68,0.1);color:#ef4444;border:none;border-radius:8px;font-size:12px;cursor:pointer">'+delLblD+'</button>'
        +'</div>';
    }
    card += '</div>';
    return card;
  }

  function wireDebtButtons(debtsArr, isPaid) {
    debtsArr.forEach(function(d){
      if(!isPaid) {
        var paidBtn = document.getElementById('db-paid-'+d.id);
        if(paidBtn)(function(id){ paidBtn.onclick=function(){ markDebtPaid(id); }; })(d.id);
        var editBtn = document.getElementById('db-edit-'+d.id);
        if(editBtn)(function(id){ editBtn.onclick=function(){ openEditDebt(id); }; })(d.id);
      }
      var delBtn = document.getElementById('db-del-'+d.id);
      if(delBtn)(function(id){ delBtn.onclick=function(){ deleteDebt(id); }; })(d.id);
    });
  }

  var h = '';

  // ── Icon tab cards ──
  h += '<div class="debt-icon-tabs">';
  h += '<div class="debt-icon-tab'+(activeTab==='owes'?' active':'')+'" onclick="switchDebtTab(\'owes\')">'
    +'<div class="dit-icon">'+svgIcon('money',26)+'</div>'
    +'<div class="dit-label">'+owesLbl+'</div>'
    +'<div class="dit-amount" style="color:var(--green)">+'+fmt(totalOwesMe)+'</div>'
    +'</div>';
  h += '<div class="debt-icon-tab'+(activeTab==='iowe'?' active':'')+'" onclick="switchDebtTab(\'iowe\')">'
    +'<div class="dit-icon">'+svgIcon('scissors',26)+'</div>'
    +'<div class="dit-label">'+iOweLbl+'</div>'
    +'<div class="dit-amount" style="color:var(--red)">-'+fmt(totalIOwe)+'</div>'
    +'</div>';
  h += '</div>';

  // ── Active tab content ──
  var list2 = activeTab === 'owes' ? owesMe : iOwe;
  if(!list2.length) {
    h += '<div style="text-align:center;padding:32px;color:var(--text3);font-size:14px">'+noDebtLbl+'</div>';
  } else {
    list2.forEach(function(d){ h += debtCard(d, false); });
  }

  // ── Net balance ──
  h += '<div class="debt-tab-total">';
  h += '<div style="font-size:10px;color:var(--text3);font-weight:700;text-transform:uppercase;letter-spacing:0.6px;margin-bottom:6px">'+netLbl+'</div>';
  h += '<div style="font-size:24px;font-weight:900;color:'+(netBal>=0?'var(--green)':'var(--red)') +'">'+( netBal>=0?'+':'')+fmt(netBal)+'</div>';
  h += '</div>';

  // ── Paid debts collapsed section ──
  if(paidDebts.length) {
    h += '<details style="margin-top:16px">'
      +'<summary style="font-size:13px;font-weight:700;color:var(--text3);cursor:pointer;padding:10px 14px;background:var(--card);border-radius:12px;list-style:none;display:flex;align-items:center;justify-content:space-between">'
      +'<span>'+svgIcon('check',13)+' '+paidLbl+' ('+paidDebts.length+')</span><span style="font-size:10px">▼</span></summary>'
      +'<div style="margin-top:8px">';
    paidDebts.forEach(function(d){ h += debtCard(d, true); });
    h += '</div></details>';
  }

  list.innerHTML = h;
  wireDebtButtons(list2, false);
  wireDebtButtons(paidDebts, true);
}
function switchDebtTab(tab) {
  state.debtTab = tab;
  renderDebtsPage();
}

// markPaid() replaced by markDebtPaid() above
