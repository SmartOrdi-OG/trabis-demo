// ── PERIOD COMPARISON HELPERS ──
function getPrevPeriodData() {
  var now = new Date();
  return state.transactions.filter(function(tx) {
    if(!tx || !tx.date) return false;
    var txDate = tx.date.substring(0,10);
    var d = new Date(txDate + 'T12:00:00');
    if(state.period === 'today') {
      var y = new Date(now); y.setDate(y.getDate()-1);
      return txDate === y.toISOString().split('T')[0];
    }
    if(state.period === 'week') {
      var w2end = new Date(now); w2end.setDate(now.getDate()-7);
      var w2start = new Date(now); w2start.setDate(now.getDate()-14);
      return d > w2start && d <= w2end;
    }
    if(state.period === 'month') {
      var pm = state.month === 0 ? 11 : state.month-1;
      var py = state.month === 0 ? state.year-1 : state.year;
      return d.getMonth()===pm && d.getFullYear()===py;
    }
    if(state.period === 'quarter') {
      var curQ = Math.floor(now.getMonth()/3);
      var pq = curQ === 0 ? 3 : curQ-1;
      var pqy = curQ === 0 ? now.getFullYear()-1 : now.getFullYear();
      return Math.floor(d.getMonth()/3)===pq && d.getFullYear()===pqy;
    }
    if(state.period === 'year') {
      return d.getFullYear() === now.getFullYear()-1;
    }
    return false;
  });
}

function getPrevPeriodLabel() {
  var lang = state.lang;
  var L = {
    today: {en:'yesterday',  ar:'أمس',              de:'gestern'},
    week:  {en:'prev week',  ar:'الأسبوع الماضي',   de:'letzte Woche'},
    month: {en:'prev month', ar:'الشهر الماضي',     de:'letzter Monat'},
    quarter: {en:'prev quarter', ar:'الربع الماضي', de:'letztes Quartal'},
    year:  {en:'prev year',  ar:'السنة الماضية',    de:'letztes Jahr'},
  };
  return (L[state.period]&&L[state.period][lang]) || (L[state.period]&&L[state.period].en) || 'prev';
}

// ── RENDER HOME ──

function goSettings(){ showNav("settings"); }

function renderBudgetDashboard(income, expense) {
  var el = document.getElementById('budgetDashboard');
  if(!el) return;
  var lang = state.lang;
  var budInc = parseFloat(state.budgets.income)||0;
  var budExp = parseFloat(state.budgets.expense)||0;
  if(!budInc && !budExp) { el.innerHTML=''; return; }

  var L = {
    budget: {en:'Budget Tracker', ar:'متابعة الميزانية', de:'Budget-Tracker'},
    income: {en:'Income', ar:'الدخل', de:'Einnahmen'},
    expense: {en:'Expenses', ar:'المصاريف', de:'Ausgaben'},
    of:     {en:'of', ar:'من', de:'von'},
    over:   {en:'Over!', ar:'تجاوز!', de:'Überschritten!'},
    edit:   {en:'Edit', ar:'تعديل', de:'Bearbeiten'},
  };
  function tx(k){ return (L[k]&&L[k][lang])||(L[k]&&L[k].en)||k; }

  function bar(label, actual, target, colorVar) {
    if(!target) return '';
    var pct = Math.min(100, Math.round(actual/target*100));
    var over = actual > target;
    var barColor = over ? 'var(--expense)' : colorVar;
    return '<div style="margin-bottom:10px">'
      +'<div style="display:flex;justify-content:space-between;margin-bottom:4px">'
      +'<span style="font-size:12px;font-weight:600;color:var(--text2)">'+label+'</span>'
      +'<span style="font-size:11px;color:'+(over?'var(--expense)':'var(--text3)')+'">'+fmt(actual)+' '+tx('of')+' '+fmt(target)+(over?' '+svgIcon('warning',11)+' '+tx('over'):'')+'</span>'
      +'</div>'
      +'<div style="background:var(--border);border-radius:6px;height:10px;overflow:hidden">'
      +'<div style="height:100%;border-radius:6px;background:'+barColor+';width:'+pct+'%;transition:width 0.6s ease"></div>'
      +'</div>'
      +'</div>';
  }

  var h = '<div style="background:var(--card);border-radius:16px;padding:14px 16px;box-shadow:var(--shadow)">';
  h += '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">';
  h += '<div style="font-size:14px;font-weight:700">'+svgIcon('barChart',14)+' '+tx('budget')+'</div>';
  h += '<button onclick="goSettings()" style="background:none;border:none;color:var(--primary);font-size:12px;font-weight:600;cursor:pointer">'+tx('edit')+' '+svgIcon('chevronRight',12)+'</button>';
  h += '</div>';
  h += bar(tx('income'), income, budInc, 'var(--income)');
  h += bar(tx('expense'), expense, budExp, 'var(--primary)');
  h += '</div>';
  el.innerHTML = h;
}

// Umsatzsteuer/Vorsteuer-aware net income for the dashboard cards. Falls back
// to plain income-minus-expenses when transactions have no vatRate (VAT not
// yet implemented), so it's a safe drop-in ahead of that feature landing.
function calculateNetIncome(filteredTransactions) {
  var totalIncome = 0;
  var totalExpenses = 0;
  var umsatzsteuer = 0;
  var vorsteuer = 0;
  var incomeNetto = 0;
  var expenseNetto = 0;
  var i, tx, vatRate, netOfVat;
  for(i = 0; i < filteredTransactions.length; i++) {
    tx = filteredTransactions[i];
    vatRate = tx.vatRate || 0;
    netOfVat = tx.amount / (1 + vatRate / 100);
    if(tx.type === 'income') {
      totalIncome += tx.amount;
      umsatzsteuer += tx.amount - netOfVat;
      incomeNetto += netOfVat;
    } else if(tx.type === 'expense') {
      totalExpenses += tx.amount;
      vorsteuer += tx.amount - netOfVat;
      expenseNetto += netOfVat;
    }
  }
  var zahllast = umsatzsteuer - vorsteuer;
  var netIncome = totalIncome - totalExpenses - Math.max(0, zahllast);
  return {totalIncome: totalIncome, totalExpenses: totalExpenses, zahllast: zahllast, netIncome: netIncome,
    incomeNetto: incomeNetto, expenseNetto: expenseNetto, incomeVat: umsatzsteuer, expenseVat: vorsteuer};
}

function renderHome() {
  if(state.homeView === 'picker') { renderHomePicker(); return; }
  renderMonthTabs();
  var backLbl = document.getElementById('hpBackLbl');
  if(backLbl) backLbl.innerHTML = artMonthTitleHtml();
  renderCarryCard();
  renderTxPanes();
  try {
  // Always reload from storage to ensure data is fresh: compare the
  // currently active session (read fresh, never cached) against whichever
  // user loadUserData() last loaded data for.
  var activeSessionUser = localStorage.getItem('smartac_session') || 'default';
  if(activeSessionUser !== _loadedDataUser) {
    loadUserData();
  }
  var txs = getFiltered();

  // Dashboard summary cards: one consistent calculation for income, expenses & net
  var netCalc = calculateNetIncome(txs);
  var dashExpenseNettoEl = document.getElementById('dashExpenseNettoAmt');
  if(dashExpenseNettoEl) dashExpenseNettoEl.textContent = fmt(netCalc.expenseNetto);
  var dashExpenseVatEl = document.getElementById('dashExpenseVatAmt');
  if(dashExpenseVatEl) dashExpenseVatEl.textContent = fmt(netCalc.expenseVat);
  var dashIncomeNettoEl = document.getElementById('dashIncomeNettoAmt');
  if(dashIncomeNettoEl) dashIncomeNettoEl.textContent = fmt(netCalc.incomeNetto);
  var dashIncomeVatEl = document.getElementById('dashIncomeVatAmt');
  if(dashIncomeVatEl) dashIncomeVatEl.textContent = fmt(netCalc.incomeVat);
  var dashSaldoAmtEl = document.getElementById('dashSaldoAmt');
  var dashSaldoLblEl = document.getElementById('dashSaldoLbl');
  if(dashSaldoAmtEl) {
    var saldo = netCalc.zahllast; // > 0 = payable to Finanzamt, < 0 = credit
    dashSaldoAmtEl.textContent = fmt(Math.abs(saldo));
    dashSaldoAmtEl.style.color = saldo >= 0 ? '#bb1614' : 'var(--green)';
    if(dashSaldoLblEl) {
      var saldoLbl = saldo >= 0
        ? {en:'VAT Payable (Zahllast)', ar:'ضريبة مستحقة للدفع', de:'Zahllast'}
        : {en:'VAT Credit (Guthaben)', ar:'رصيد ضريبي دائن', de:'Guthaben'};
      dashSaldoLblEl.textContent = saldoLbl[state.lang] || saldoLbl.en;
    }
  }

  var income = txs.filter(function(t){return t.type==='income';}).reduce(function(s,t){return s+t.amount;},0);
  var txExpense = txs.filter(function(t){return t.type==='expense';}).reduce(function(s,t){return s+t.amount;},0);

  // Add recurring payments & employee salaries (monthly fixed costs)
  // Only include when period is 'month' or 'year'
  var fixedMonthly = 0;
  var fixedIncomeMonthly = 0;
  if(state.period === 'month') {
    fixedMonthly += state.recurring.reduce(function(s,r){ return s+(parseFloat(r.amount)||0); }, 0);
    fixedMonthly += state.employees.reduce(function(s,e){ return s+(parseFloat(e.salary)||0); }, 0);
    fixedIncomeMonthly = (state.fixedIncome||[]).reduce(function(s,fi){ return s+(parseFloat(fi.amount)||0); }, 0);
  } else if(state.period === 'quarter') {
    fixedMonthly += state.recurring.reduce(function(s,r){ return s+(parseFloat(r.amount)||0); }, 0) * 3;
    fixedMonthly += state.employees.reduce(function(s,e){ return s+(parseFloat(e.salary)||0); }, 0) * 3;
    fixedIncomeMonthly = (state.fixedIncome||[]).reduce(function(s,fi){ return s+(parseFloat(fi.amount)||0); }, 0) * 3;
  } else if(state.period === 'year') {
    fixedMonthly += state.recurring.reduce(function(s,r){ return s+(parseFloat(r.amount)||0); }, 0) * 12;
    fixedMonthly += state.employees.reduce(function(s,e){ return s+(parseFloat(e.salary)||0); }, 0) * 12;
    fixedIncomeMonthly = (state.fixedIncome||[]).reduce(function(s,fi){ return s+(parseFloat(fi.amount)||0); }, 0) * 12;
  }

  var expense = txExpense + fixedMonthly;
  income += fixedIncomeMonthly;
  var net = income - expense;

  var incomeAmtEl = document.getElementById('incomeAmt');
  var expenseAmtEl = document.getElementById('expenseAmt');
  var netAmtEl = document.getElementById('netAmt');
  var netSubEl = document.getElementById('netSub');
  if(incomeAmtEl) incomeAmtEl.textContent = fmt(income);
  if(expenseAmtEl) expenseAmtEl.textContent = fmt(expense);

  // Mobile Zoho-style summary cards: Receivables/Payables are a running
  // balance (unpaid invoices), not filtered to the selected period like
  // income/expense are.
  var totalReceivables = state.issuedInvoices
    .filter(function(inv){ return inv.status === 'Pending' || inv.status === 'Overdue'; })
    .reduce(function(s, inv){ return s + (parseFloat(inv.total) || 0); }, 0);
  var totalPayables = state.receivedInvoices
    .filter(function(inv){ return inv.status === 'Pending' || inv.status === 'Overdue'; })
    .reduce(function(s, inv){ return s + (parseFloat(inv.total) || 0); }, 0);
  var mobReceivablesEl = document.getElementById('mobReceivablesAmt');
  var mobPayablesEl = document.getElementById('mobPayablesAmt');
  if(mobReceivablesEl) mobReceivablesEl.textContent = fmt(totalReceivables);
  if(mobPayablesEl) mobPayablesEl.textContent = fmt(totalPayables);
  var mobOverdueEl = document.getElementById('mobOverdueCount');
  if(mobOverdueEl) mobOverdueEl.textContent = state.issuedInvoices.filter(function(inv){ return inv.status === 'Overdue'; }).length;
  var mobPendingDebtsEl = document.getElementById('mobPendingDebtsCount');
  if(mobPendingDebtsEl) mobPendingDebtsEl.textContent = state.debts.filter(function(d){ return d.status !== 'paid'; }).length;
  if(netAmtEl) {
    netAmtEl.textContent = (net < 0 ? '-' : '') + fmt(Math.abs(net));
    netAmtEl.style.color = net > 0 ? 'var(--green)' : (net < 0 ? 'var(--red)' : 'var(--text3)');
    netAmtEl.style.fontSize = '22px';
    var netCardEl = document.getElementById('netCard');
    if(netCardEl) {
      netCardEl.style.borderLeft = net > 0 ? '4px solid var(--green)' : (net < 0 ? '4px solid var(--red)' : '4px solid var(--border)');
      netCardEl.style.boxShadow = net > 0 ? '0 0 12px rgba(22,163,74,0.25)' : (net < 0 ? '0 0 12px rgba(220,38,38,0.25)' : '');
    }
  }
  var total = state.transactions.length;
  if(netSubEl) netSubEl.textContent = total === 0
    ? t('noTx').split('\n')[0]
    : txs.length + ' ' + t('transactions') + ' • ' + (state.customDateFilter ? buildCustomDateFilterSubLabel() : periodLabelText());

  var incomeChangeEl = document.getElementById('incomeChange');
  var expenseChangeEl = document.getElementById('expenseChange');
  if(incomeChangeEl) incomeChangeEl.style.display = state.customDateFilter ? 'none' : 'flex';
  if(expenseChangeEl) expenseChangeEl.style.display = state.customDateFilter ? 'none' : 'flex';

  // Update labels (null-safe)
  var sumLabels = document.querySelectorAll('.sum-label');
  if(sumLabels[0]) sumLabels[0].textContent = t('income');
  if(sumLabels[1]) sumLabels[1].textContent = t('expense');
  var netLabelEl = document.querySelector('.net-label');
  if(netLabelEl) netLabelEl.textContent = t('net');
  var qaTitleEl = document.querySelector('.qa-title');
  if(qaTitleEl) qaTitleEl.textContent = t('quickAdd');


  var secTitles = document.querySelectorAll('.section-title');
  if(secTitles[0]) secTitles[0].textContent = t('recent');
  if(secTitles[1]) secTitles[1].textContent = t('outstanding');
  var seeAlls = document.querySelectorAll('.see-all');
  if(seeAlls[0]) seeAlls[0].innerHTML = escHtml(t('seeAll')) + ' ' + svgIcon('chevronRight',12);
  if(seeAlls[1]) seeAlls[1].innerHTML = escHtml(t('seeAll')) + ' ' + svgIcon('chevronRight',12);
  var txSearchEl = document.getElementById('txSearchInput');
  if(txSearchEl) txSearchEl.placeholder = t('searchTx');

  // Quick add buttons
  var qaBtns = document.querySelectorAll('.qa-btn .label');
  if(qaBtns[0]) qaBtns[0].textContent = t('income');
  if(qaBtns[1]) qaBtns[1].textContent = t('expense').replace('ع','ع');
  if(qaBtns[2]) qaBtns[2].textContent = t('debts');

  renderTxList(txs);
  renderBudgetDashboard(income, expense);

  // Daily summary — always uses today's transactions regardless of period selector
  var todayStr = today();
  var todayTxs = state.transactions.filter(function(t){return t.date===todayStr;});
  var todayInc = todayTxs.filter(function(t){return t.type==='income';}).reduce(function(s,t){return s+t.amount;},0);
  var todayExp = todayTxs.filter(function(t){return t.type==='expense';}).reduce(function(s,t){return s+t.amount;},0);
  renderDailySummary(todayInc, todayExp, todayInc - todayExp);

  // ── Profit trend vs previous period ──
  var prevTxs = getPrevPeriodData();
  var prevInc = prevTxs.filter(function(t){return t.type==='income';}).reduce(function(s,t){return s+t.amount;},0);
  var prevExp = prevTxs.filter(function(t){return t.type==='expense';}).reduce(function(s,t){return s+t.amount;},0);
  var prevNet = prevInc - prevExp;
  var trendEl = document.getElementById('netTrend');
  if(trendEl) {
    if(!state.customDateFilter && state.period === 'today' && prevTxs.length > 0) {
      var trendPct = prevNet !== 0 ? Math.abs(((net - prevNet) / Math.abs(prevNet)) * 100).toFixed(0) : '0';
      var isUp = net >= prevNet;
      trendEl.textContent = (isUp ? '▲' : '▼') + ' ' + trendPct + '% vs ' + getPrevPeriodLabel();
      trendEl.style.color = isUp ? '#86efac' : '#fca5a5';
    } else {
      trendEl.textContent = '';
    }
  }
  } catch(e) { console.error('renderHome error:', e); }
}


// ── TRANSACTION DETAIL ──
var _currentTx = null;

function showTxDetail(tx) {
  _currentTx = tx;
  var lang = state.lang;
  var overlay = document.getElementById('txDetailOverlay');
  if(!overlay) return;

  toggleTxEdit(false);

  // Title
  document.getElementById('txDetailTitle').textContent = tx.name;

  // Amount
  var amtEl = document.getElementById('txDetailAmount');
  amtEl.textContent = (tx.type==='income'?'+':'-') + fmt(tx.amount);
  amtEl.style.color = tx.type==='income' ? 'var(--income)' : 'var(--expense)';

  // Type label
  var typeLabels = {income:{en:'Income',ar:'دخل',de:'Einnahmen'}, expense:{en:'Expense',ar:'مصروف',de:'Ausgabe'}};
  var tl = (typeLabels[tx.type]&&typeLabels[tx.type][lang]) || tx.type;
  var typeEl = document.getElementById('txDetailType');
  if(typeEl) { typeEl.innerHTML = txIconSvg(tx) + '  ' + escHtml(tl); typeEl.style.color = tx.type==='income'?'var(--income)':'var(--expense)'; }

  // Date
  var dateLbl = {en:'DATE', ar:'التاريخ', de:'DATUM'};
  document.getElementById('txDetail-date-lbl').textContent = dateLbl[lang]||'DATE';
  document.getElementById('txDetailDate').textContent = tx.date;

  // Category
  var catLbl = {en:'CATEGORY', ar:'الفئة', de:'KATEGORIE'};
  document.getElementById('txDetail-cat-lbl').textContent = catLbl[lang]||'CATEGORY';
  document.getElementById('txDetailCat').innerHTML = txIconSvg(tx) + ' ' + escHtml(tc(tx.category||''));

  // VAT breakdown (Brutto/Netto/Steuer)
  var vatRow = document.getElementById('txDetailVatRow');
  if(vatRow) {
    var vRate = tx.vatRate || 0;
    var vb = vatBreakdown(tx.amount, vRate);
    var vatRowLbl = {en:'VAT', ar:'الضريبة (MwSt.)', de:'MwSt.'};
    var bLbl = {en:'Gross', ar:'الإجمالي', de:'Brutto'};
    var nLbl = {en:'Net', ar:'الصافي', de:'Netto'};
    var sLbl = {en:'Tax', ar:'الضريبة', de:'Steuer'};
    document.getElementById('txDetail-vat-lbl').textContent = vatRowLbl[lang]||'VAT';
    document.getElementById('txDetailVat').textContent = vRate + '%';
    document.getElementById('txDetailVatBreakdown').textContent =
      (bLbl[lang]||'Gross') + ': ' + fmt(vb.brutto) + ' · ' +
      (nLbl[lang]||'Net') + ': ' + fmt(vb.netto) + ' · ' +
      (sLbl[lang]||'Tax') + ': ' + fmt(vb.steuer);
    vatRow.style.display = 'flex';
  }

  // Invoice
  var invRow = document.getElementById('txDetailInvoiceRow');
  var invEl = document.getElementById('txDetailInvoice');
  var invChev = document.getElementById('txDetailInvChevron');
  var invLbl = {en:'INVOICE', ar:'الفاتورة', de:'RECHNUNG'};
  document.getElementById('txDetail-inv-lbl').textContent = invLbl[lang]||'INVOICE';
  if(tx.invoice) {
    invEl.textContent = tx.invoiceName || 'View Invoice';
    invEl.style.color = 'var(--primary)';
    if(invChev) invChev.style.display = 'block';
    invRow.style.cursor = 'pointer';
    invRow.onclick = function(){ openInvoice(tx.invoice, tx.invoiceName||'Invoice'); };
  } else {
    var noInv = {en:'No invoice', ar:'لا توجد فاتورة', de:'Keine Rechnung'};
    invEl.textContent = noInv[lang]||'No invoice';
    invEl.style.color = 'var(--text3)';
    if(invChev) invChev.style.display = 'none';
    invRow.style.cursor = 'default';
    invRow.onclick = null;
  }

  // Receipt attachment
  var rcptRow = document.getElementById('txDetailReceiptRow');
  if(rcptRow) {
    document.getElementById('txDetail-receipt-lbl').textContent = rtx('rowLbl');
    if(tx.receiptId) {
      document.getElementById('txDetailReceipt').textContent = tx.receiptName || rtx('view');
      rcptRow.style.display = 'flex';
      rcptRow.onclick = function() {
        receiptGet(tx.receiptId).then(function(rec) { if(rec) openReceiptViewer(rec); });
      };
    } else {
      rcptRow.style.display = 'none';
      rcptRow.onclick = null;
    }
  }

  // Delete button
  var delBtn = document.getElementById('txDetailDelete');
  var delLbl = {en:'Delete', ar:'حذف', de:'Löschen'};
  if(delBtn) {
    delBtn.innerHTML = svgIcon('trash',14) + ' ' + escHtml(delLbl[lang]||delLbl.en);
    delBtn.onclick = async function(){
      if(!(await uvaConfirmUnlock(tx.date))) return;
      state.transactions = state.transactions.filter(function(t){ return t.id !== tx.id; });
      if(tx.receiptId) receiptDeleteRec(tx.receiptId);
      save(); renderHome(); closeTxDetail();
    };
  }

  // Edit button
  var editBtn = document.getElementById('txDetailEditBtn');
  if(editBtn) editBtn.onclick = function(){ toggleTxEdit(true); };

  // Edit labels
  var editLbl = {en:'Edit Transaction', ar:'تعديل المعاملة', de:'Transaktion bearbeiten'};
  var saveLbl = {en:'Save Changes', ar:'حفظ التعديلات', de:'Änderungen speichern'};
  var cancelLbl = {en:'Cancel', ar:'إلغاء', de:'Abbrechen'};
  var editLblEl = document.getElementById('txEdit-lbl');
  var saveBtnEl = document.getElementById('txEdit-save');
  var cancelBtnEl = document.getElementById('txEdit-cancel');
  if(editLblEl) editLblEl.textContent = editLbl[lang]||editLbl.en;
  if(saveBtnEl) { saveBtnEl.innerHTML = svgIcon('check',15) + ' ' + escHtml(saveLbl[lang]||saveLbl.en); saveBtnEl.onclick = saveTxEdit; }
  if(cancelBtnEl) cancelBtnEl.textContent = cancelLbl[lang]||cancelLbl.en;

  // Pre-fill edit inputs
  var nameEl = document.getElementById('txEdit-name');
  var amtEditEl = document.getElementById('txEdit-amount');
  var dateEl = document.getElementById('txEdit-date');
  if(nameEl) nameEl.value = tx.name;
  if(amtEditEl) amtEditEl.value = tx.amount;
  if(dateEl) dateEl.value = tx.date;
  var vatEditEl = document.getElementById('txEdit-vat');
  if(vatEditEl) vatEditEl.value = String(tx.vatRate != null ? tx.vatRate : 0);

  overlay.style.display = 'flex';
}

function toggleTxEdit(show) {
  var view = document.getElementById('txDetailView');
  var edit = document.getElementById('txDetailEdit');
  var editBtn = document.getElementById('txDetailEditBtn');
  if(view) view.style.display = show ? 'none' : 'block';
  if(edit) edit.style.display = show ? 'block' : 'none';
  if(editBtn) editBtn.style.background = show ? 'rgba(59,91,219,0.2)' : 'rgba(59,91,219,0.1)';
}

async function saveTxEdit() {
  if(!_currentTx) return;
  var nameEl = document.getElementById('txEdit-name');
  var amtEl = document.getElementById('txEdit-amount');
  var dateEl = document.getElementById('txEdit-date');
  var newName = nameEl ? nameEl.value.trim() : _currentTx.name;
  var newAmt = amtEl ? parseAmount(amtEl.value)||_currentTx.amount : _currentTx.amount;
  var newDate = dateEl ? dateEl.value||_currentTx.date : _currentTx.date;
  if(!newName || newAmt <= 0) return;
  if(!(await uvaConfirmUnlock(_currentTx.date))) return;
  if(newDate !== _currentTx.date && !(await uvaConfirmUnlock(newDate))) return;

  var tx = state.transactions.find(function(t){ return t.id === _currentTx.id; });
  if(tx) {
    tx.name = newName;
    tx.amount = newAmt;
    tx.date = newDate;
    var vatSel = document.getElementById('txEdit-vat');
    if(vatSel) tx.vatRate = parseFloat(vatSel.value) || 0;
    _currentTx = tx;
  }
  save();
  renderHome();
  showTxDetail(_currentTx); // refresh detail view
}

function closeTxDetail() {
  var overlay = document.getElementById('txDetailOverlay');
  if(overlay) overlay.style.display = 'none';
  _currentTx = null;
}


// ── HOME INCOME / EXPENSE PANES ──
var HOMEP_L = {
  income:   {en:'Income',        ar:'الدخل',            de:'Einnahmen'},
  expense:  {en:'Expenses',      ar:'المصاريف',         de:'Ausgaben'},
  netto:    {en:'Total net',     ar:'إجمالي الصافي',    de:'Netto gesamt'},
  vat:      {en:'Total VAT',     ar:'إجمالي الضريبة',   de:'MwSt. gesamt'},
  gross:    {en:'Total (net + VAT)', ar:'الإجمالي (صافي + ضريبة)', de:'Gesamt (Netto + MwSt.)'},
  fixOut:   {en:'Fixed \u00b7 due',  ar:'دفعات ثابتة \u00b7 مستحقة', de:'Fixzahlungen \u00b7 offen'},
  fixIn:    {en:'Fixed \u00b7 due',  ar:'دخل ثابت \u00b7 مستحق',    de:'Fixe Einnahmen \u00b7 offen'},
  restOut:  {en:'Other expenses',ar:'مصاريف أخرى',      de:'Übrige Ausgaben'},
  restIn:   {en:'Other income',  ar:'دخل آخر',          de:'Übrige Einnahmen'},
  salary:   {en:'Salary',        ar:'راتب',             de:'Gehalt'},
  none:     {en:'Nothing fixed yet', ar:'ما في دفعات ثابتة', de:'Noch keine Fixzahlungen'},
  docs:     {en:'Invoice photos',    ar:'صور الفواتير',     de:'Belege'},
  fixedHd:  {en:'Fixed costs',       ar:'الدفعات الثابتة',  de:'Fixkosten'},
  otherHd:  {en:'Other',             ar:'أخرى',             de:'Sonstiges'},
  bizHd:    {en:'Business',          ar:'الشركة',           de:'Betrieb'},
  navFleet: {en:'Fleet',             ar:'الأسطول',          de:'Fuhrpark'},
  navCont:  {en:'Contacts',          ar:'جهات الاتصال',     de:'Kontakte'},
  navEmp:   {en:'Employees',         ar:'الموظفين',         de:'Mitarbeiter'},
  navPkg:   {en:'Tax advisor package', ar:'حزمة المحاسب', de:'Steuerberater-Paket'},
  navLog:   {en:'Daily Log',         ar:'سجل الأعمال',      de:'Tagesprotokoll'},
  navGov:   {en:'Government Entities', ar:'الجهات الحكومية', de:'Behörden'},
  navPrj:   {en:'Projects',          ar:'المشاريع',         de:'Projekte'},
  addInv:   {en:'Add invoice',       ar:'إضافة فاتورة',     de:'Beleg hinzufügen'},
  upFile:   {en:'Upload file (PDF or photo)', ar:'رفع ملف (PDF أو صورة)', de:'Datei hochladen (PDF oder Foto)'},
  takePhoto:{en:'Take photo',        ar:'تصوير فاتورة',     de:'Foto aufnehmen'},
  manual:   {en:'Enter manually',    ar:'إدخال يدوي',       de:'Manuell eingeben'},
  createInv:{en:'Create invoice',    ar:'إنشاء فاتورة',     de:'Rechnung erstellen'},
  allPdf:   {en:'All as one PDF',    ar:'كل الفواتير PDF واحد', de:'Alle als ein PDF'},
  noDocs:   {en:'No invoices yet',   ar:'لا توجد فواتير بعد', de:'Noch keine Belege'},
  rowNet:   {en:'Net', ar:'صافي', de:'Netto'},
  rowVat:   {en:'VAT', ar:'ضريبة', de:'MwSt'},
  rowTot:   {en:'Total', ar:'إجمالي', de:'Total'},
  monthHd:  {en:'Saldo', ar:'رصيد', de:'Saldo'},
  carryChip:{en:'Past months', ar:'الشهور السابقة', de:'Saldo Vormonate'},
  vatDue:   {en:'payable', ar:'مستحقة', de:'zu zahlen'},
  vatCredit:{en:'credit', ar:'رصيد لك', de:'Guthaben'},
  carryHd:  {en:'Saldo of past months', ar:'رصيد الشهور السابقة', de:'Saldo der Vormonate'},
  carryNet: {en:'Netto',             ar:'الصافي',           de:'Netto'},
  carryVat: {en:'Steuer (MwSt)',     ar:'الضريبة',          de:'Steuer (MwSt)'},
  carryTot: {en:'Total',             ar:'الإجمالي',         de:'Total'},
  today:    {en:'Today',             ar:'ملخص اليوم',       de:'Heute'},
  debtsHd:  {en:'Debts',             ar:'الديون',           de:'Schulden'},
  owesMe:   {en:'Owed to you',       ar:'لك',               de:'Forderungen'},
  iOwe:     {en:'You owe',           ar:'عليك',             de:'Verbindlichkeiten'},
  noneToday:{en:'Nothing booked today', ar:'ما في حركات اليوم', de:'Heute noch nichts gebucht'},
  noDebts:  {en:'No open debts',     ar:'ما في ديون مفتوحة', de:'Keine offenen Schulden'},
  seeAll:   {en:'Open debts page',   ar:'افتح صفحة الديون', de:'Zur Schuldenseite'},
  yearNet:  {en:'Year net',      ar:'الصافي السنوي',    de:'Jahressaldo'},
};
function hptx(k) { return (HOMEP_L[k] && HOMEP_L[k][state.lang]) || (HOMEP_L[k] && HOMEP_L[k].en) || k; }

// Recurring rules rendered as the rows they produce in the selected month.
// Shape comes straight from state.recurring / state.fixedIncome / state.employees.
function fixedRowsFor(type, forYear, forMonth) {
  // checkRecurringDue() turns each rule into a real transaction once its day
  // arrives and stamps lastRecorded = 'YYYY-MM'. So a rule belongs in this group
  // only while it is still unbooked for the month on screen — otherwise it is
  // already sitting in the transactions group and would be counted twice.
  var y = (forYear == null) ? state.year : forYear;
  var m = (forMonth == null) ? state.month : forMonth;
  var monthKey = y + '-' + pad2(m + 1);
  var now = new Date();
  var nowKey = now.getFullYear() + '-' + pad2(now.getMonth() + 1);
  if(monthKey < nowKey) return [];   // past months: everything was booked at the time

  var rows = [];
  function add(src, name, amount, vatRate, day) {
    if(src.lastRecorded === monthKey) return;
    var amt = parseFloat(amount) || 0;
    if(amt <= 0) return;
    rows.push({name: name, amount: amt, vatRate: parseFloat(vatRate) || 0,
               day: parseInt(day, 10) || 1, fixed: true});
  }
  if(type === 'expense') {
    (state.recurring || []).forEach(function(r) { add(r, r.name, r.amount, r.vatRate, r.day); });
    (state.employees || []).forEach(function(e) {
      add(e, hptx('salary') + ' \u00b7 ' + (e.name || e.fullName || ''), e.salary, 0, 1);
    });
  } else {
    (state.fixedIncome || []).forEach(function(fi) { add(fi, fi.name, fi.amount, fi.vatRate, fi.day); });
  }
  return rows.sort(function(a, b) { return a.day - b.day; });
}

function sumRows(rows) {
  var brutto = 0, netto = 0;
  rows.forEach(function(r) {
    var v = vatBreakdown(r.amount, r.vatRate || 0);
    brutto += v.brutto; netto += v.netto;
  });
  return {brutto: brutto, netto: netto, steuer: brutto - netto};
}

// Net for a whole year, using the same model the month cards use:
// the year's transactions plus the fixed rows once per elapsed month.
function yearNetTotal(y) {
  // Booked months are already in state.transactions; only the rest of the
  // current year is still carried by the unbooked rules.
  var net = 0;
  (state.transactions || []).forEach(function(tx) {
    if(!tx || !tx.date || parseInt(tx.date.substring(0, 4), 10) !== y) return;
    var n = vatBreakdown(tx.amount, tx.vatRate || 0).netto;
    net += tx.type === 'income' ? n : -n;
  });
  var now = new Date();
  if(y === now.getFullYear()) {
    var openNet = sumRows(fixedRowsFor('income')).netto - sumRows(fixedRowsFor('expense')).netto;
    net += openNet;
  }
  return net;
}

// ── RECEIPT STRIP ──
// The month's attachments, shown as the documents they are. Two storage paths
// feed it: tx.invoice is an inline data URL, tx.receiptId points at a blob in
// IndexedDB — so thumbnails for the latter resolve asynchronously.
var _stripUrls = [];
function releaseStripUrls() {
  _stripUrls.forEach(function(u) { try { URL.revokeObjectURL(u); } catch(e) {} });
  _stripUrls = [];
}

function renderReceiptStrip(type) {
  var wrap = document.getElementById('rcptStripWrap');
  var strip = document.getElementById('rcptStrip');
  if(!wrap || !strip) return;
  releaseStripUrls();

  var docs = getFiltered().filter(function(tx) {
    return tx.type === type && (tx.invoice || tx.receiptId);
  });
  var ttl = document.getElementById('rcptStripTtl');
  if(ttl) ttl.textContent = hptx('docs') + ' (' + docs.length + ')';
  renderRcptActions(type);

  var fileIcon = svgIcon('fileText', 26);
  strip.innerHTML = '';
  if(!docs.length) { strip.innerHTML = '<div class="rcpt-empty">' + escHtml(hptx('noDocs')) + '</div>'; return; }
  docs.forEach(function(tx, idx) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'rcpt';
    btn.innerHTML = '<span class="rcpt-num">' + (idx + 1) + '</span>'
      + '<span class="rcpt-thumb">' + fileIcon + '</span>'
      + '<span class="rcpt-capbar"><span class="rcpt-cap">' + escHtml(tx.name || '') + '</span>'
      + '<span class="rcpt-amt" style="color:' + (type === 'income' ? 'var(--income)' : 'var(--expense)') + '">'
      + (type === 'income' ? '+' : '-') + fmt(tx.amount) + '</span></span>';
    var thumb = btn.querySelector('.rcpt-thumb');

    if(tx.invoice) {
      if(String(tx.invoice).indexOf('data:image/') === 0) thumb.innerHTML = '<img alt="" src="' + tx.invoice + '"/>';
      btn.onclick = function() { openInvoice(tx.invoice, tx.invoiceName || 'Invoice'); };
    } else {
      btn.onclick = function() {
        receiptGet(tx.receiptId).then(function(rec) { if(rec) openReceiptViewer(rec); });
      };
      receiptGet(tx.receiptId).then(function(rec) {
        if(!rec || !rec.blob || !thumb.isConnected) return;
        if((rec.type || '').indexOf('image/') !== 0) return;   // PDFs keep the document icon
        var u = URL.createObjectURL(rec.blob);
        _stripUrls.push(u);
        thumb.innerHTML = '<img alt="" src="' + u + '"/>';
      }).catch(function() {});
    }
    strip.appendChild(btn);
  });
}

// Pinned under the invoice list: add a file / photo, and (income) create an invoice.
function renderRcptActions(type) {
  var host = document.getElementById('rcptActions');
  if(!host) return;
  var h = '<div class="rcpt-add-wrap">'
    + '<button type="button" class="rcpt-add-btn" onclick="rcptToggleMenu(event)"><span class="rcpt-add-circle">+</span>' + escHtml(hptx('addInv')) + '</button>'
    + '<div class="rcpt-add-menu" id="rcptAddMenu">'
    +   '<button type="button" onclick="rcptAddFile(\'' + type + '\',\'upload\')">' + svgIcon('upload', 16) + '<span>' + escHtml(hptx('upFile')) + '</span></button>'
    +   '<button type="button" onclick="rcptAddFile(\'' + type + '\',\'camera\')">' + svgIcon('camera', 16) + '<span>' + escHtml(hptx('takePhoto')) + '</span></button>'
    +   '<button type="button" onclick="rcptManualEntry(\'' + type + '\')">' + svgIcon('pencil', 16) + '<span>' + escHtml(hptx('manual')) + '</span></button>'
    + '</div></div>';
  if(type === 'income') {
    h += '<button type="button" class="rcpt-add-btn green" onclick="openIssuedInvoiceForm()"><span class="rcpt-add-circle">' + svgIcon('file', 16) + '</span>' + escHtml(hptx('createInv')) + '</button>';
  }
  // One PDF with every invoice/receipt of this month and this side (income or expenses)
  var n = getFiltered().filter(function(tx) { return tx.type === type && (tx.invoice || tx.receiptId); }).length;
  h += '<button type="button" class="rcpt-pdf-btn" onclick="monthReceiptsPdf(\'' + type + '\')"' + (n ? '' : ' disabled') + '>'
     + svgIcon('fileText', 15) + '<span>' + escHtml(hptx('allPdf')) + (n ? ' (' + n + ')' : '') + '</span></button>'
     + '<div class="rcpt-pdf-st" id="invDlStatus"></div>';
  host.innerHTML = h;
}
// Uses the combined-PDF builder of the accountant downloads (images + every PDF page),
// limited to the month on screen.
function monthReceiptsPdf(type) {
  _invDlInterval = 'month';
  _invDlPeriod = state.year + '-' + pad2(state.month + 1);
  downloadInvoicesPdf(type);
}
function rcptToggleMenu(e) {
  if(e) e.stopPropagation();
  var m = document.getElementById('rcptAddMenu');
  if(m) m.classList.toggle('open');
}
function rcptCloseMenu() {
  var m = document.getElementById('rcptAddMenu');
  if(m) m.classList.remove('open');
}
document.addEventListener('click', rcptCloseMenu);
// Manual entry: the review screen with one empty entry and no file; a file or photo
// can be attached inside the card (optional).
function rcptManualEntry(type) {
  rcptCloseMenu();
  _scanInv = { type: type, manual: true, files: [scanBlankEntry()] };
  scanInvoicesOpenCapture();
  scanInvoicesRenderReview();
}
function rcptAddFile(type, mode) {
  rcptCloseMenu();
  _scanInv = { type: type, files: [] };
  scanInvoicesOpenCapture();
  var b = document.getElementById(mode === 'camera' ? 'scanCapCameraBtn' : 'scanCapUploadBtn');
  if(b) b.click();
}


// ── ARTIFACT SHELL ──
function artMonthTitleHtml() {
  return '<span>' + escHtml(monthNamesLocal()[state.month]) + '</span><span class="art-ychip">' + state.year + '</span>';
}
function artSyncTopbar() {
  var logo = document.querySelector('.hdr .trabis-logo-img'), img = document.getElementById('artLogo');
  if(logo && img && img.getAttribute('src') !== logo.getAttribute('src')) img.setAttribute('src', logo.getAttribute('src'));
  var sub = document.getElementById('artBizSub');
  if(sub) sub.textContent = state.businessName || '';
  var de = document.getElementById('artLangDe'), en = document.getElementById('artLangEn');
  if(de) de.classList.toggle('active', state.lang === 'de');
  if(en) en.classList.toggle('active', state.lang === 'en');
  var cur = window._artPage || 'home';
  var hb = document.getElementById('artHelpBtn'), sb = document.getElementById('artSetBtn');
  if(hb) hb.classList.toggle('active', cur === 'help');
  if(sb) sb.classList.toggle('active', cur === 'settings');
}
document.body.classList.add('art');

// ── GOVERNMENT ENTITIES ──
// Government contacts (SVS, ÖGK, Finanzamt, ...) with a running counter of what was paid to
// each, taken from the expenses. An expense counts for an entity when it was linked to it in
// the expense form (govId) or, failing that, when its name/supplier names the entity.
var GOV_L = {
  title:   {en:'Government Entities', ar:'الجهات الحكومية', de:'Behörden'},
  intro:   {en:'Each entity keeps a running total of what you paid it — taken from your expenses — and its own file archive.', ar:'كل جهة ليها عدّاد بالمدفوع لها — من المصاريف — وأرشيف ملفات خاص بيها.', de:'Jede Stelle hat einen laufenden Zähler der Zahlungen — aus den Ausgaben — und ein eigenes Dokumentenarchiv.'},
  yearLbl: {en:'paid this year', ar:'مدفوع هذه السنة', de:'bezahlt dieses Jahr'},
  monthLbl:{en:'this month', ar:'هذا الشهر', de:'diesen Monat'},
  files:   {en:'files', ar:'ملفات', de:'Dateien'},
  archive: {en:'Archive & details', ar:'الأرشيف والتفاصيل', de:'Archiv & Details'},
  add:     {en:'Add government entity', ar:'إضافة جهة حكومية', de:'Behörde hinzufügen'},
  addPh:   {en:'Entity name (e.g. Magistrat Wien)', ar:'اسم الجهة (مثال: Magistrat Wien)', de:'Name der Stelle (z. B. Magistrat Wien)'},
  save:    {en:'Add', ar:'إضافة', de:'Hinzufügen'},
  quick:   {en:'Quick add', ar:'إضافة سريعة', de:'Schnell hinzufügen'},
  none:    {en:'No government entities yet — add one below.', ar:'لا توجد جهات بعد — أضف واحدة من الأسفل.', de:'Noch keine Behörden — unten hinzufügen.'},
  recent:  {en:'Latest payments', ar:'آخر المدفوعات', de:'Letzte Zahlungen'},
  noPay:   {en:'No payments recorded yet', ar:'لا مدفوعات مسجّلة بعد', de:'Noch keine Zahlungen'},
  linkLbl: {en:'Government entity (optional)', ar:'الجهة الحكومية (اختياري)', de:'Behörde (optional)'}
};
function govtx(k) { return (GOV_L[k] && GOV_L[k][state.lang]) || (GOV_L[k] && GOV_L[k].en) || k; }
var GOV_QUICK = ['Finanzamt', 'SVS', 'ÖGK', 'AMS', 'Arbeiterkammer', 'Wirtschaftskammer'];

function govEntities() {
  return (state.contacts || []).filter(function(c) { return c && c.type === 'government'; });
}
function govTxMatches(tx, c) {
  if(!tx || tx.type !== 'expense') return false;
  if(tx.govId != null) return tx.govId === c.id;
  var n = (c.name || '').toLowerCase().trim();
  if(!n) return false;
  var hay = ((tx.name || '') + ' ' + (tx.supplierName || '')).toLowerCase();
  if(hay.indexOf(n) >= 0) return true;
  var first = n.split(/\s+/)[0];
  if(first.length < 3) return false;
  var esc = first.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp('(^|[^a-zäöüß])' + esc + '($|[^a-zäöüß])').test(hay);
}
function govPayments(c) {
  return (state.transactions || []).filter(function(tx) { return govTxMatches(tx, c); })
    .sort(function(a, b) { return (b.date || '').localeCompare(a.date || ''); });
}
function govTotals(c, y, m) {
  var t = {year: 0, month: 0, count: 0};
  govPayments(c).forEach(function(tx) {
    var ty = parseInt((tx.date || '').substring(0, 4), 10), tm = parseInt((tx.date || '').substring(5, 7), 10) - 1;
    var amt = parseFloat(tx.amount) || 0;
    if(ty === y) { t.year += amt; t.count++; if(tm === m) t.month += amt; }
  });
  return t;
}


function renderGovPage() {
  var page = document.getElementById('govPage');
  if(!page) return;
  var dir = state.lang === 'ar' ? 'rtl' : 'ltr';
  var ents = govEntities();
  var h = '<div style="direction:' + dir + '">';
  h += '<div style="display:flex;align-items:center;gap:10px;margin-bottom:6px">'
     + '<button type="button" class="more-back-btn" onclick="showNav(\'home\')">' + svgIcon('chevronLeft', 20) + '</button>'
     + '<div style="font-size:20px;font-weight:700">' + escHtml(govtx('title')) + '</div></div>';
  h += '<div style="font-size:12.5px;color:var(--text3);margin:0 0 14px;line-height:1.5">' + escHtml(govtx('intro')) + '</div>';
  if(!ents.length) h += '<div style="text-align:center;padding:22px 10px;color:var(--text3);font-size:13px">' + escHtml(govtx('none')) + '</div>';
  ents.forEach(function(c) {
    var tot = govTotals(c, state.year, state.month);
    var docs = (state.contactDocs || []).filter(function(d) { return d.contactId === c.id; }).length;
    var pays = govPayments(c).slice(0, 3);
    h += '<div class="gov-card">'
      + '<div class="gov-top"><div class="gov-ico">' + svgIcon('landmark', 18) + '</div>'
      + '<div style="flex:1;min-width:0"><div class="gov-name">' + escHtml(c.name) + '</div>'
      + (c.notes ? '<div class="gov-sub">' + escHtml(String(c.notes).split('\n')[0]) + '</div>' : '') + '</div>'
      + '<div style="text-align:end"><div class="gov-amt">' + fmt(tot.year) + '</div><div class="gov-sub">' + escHtml(govtx('yearLbl')) + '</div></div></div>'
      + '<div class="gov-meta"><span>' + escHtml(govtx('monthLbl')) + ': <b>' + fmt(tot.month) + '</b></span><span>&#128193; <b>' + docs + '</b> ' + escHtml(govtx('files')) + '</span></div>'
      + '<div class="gov-pays"><div class="gov-sub" style="font-weight:700;margin-bottom:3px">' + escHtml(govtx('recent')) + '</div>'
      + (pays.length ? pays.map(function(tx) {
          return '<div class="gov-pay"><span>' + escHtml(tx.name || '') + '</span><span class="gov-sub">' + escHtml(formatDateDisplay(tx.date)) + '</span><b>-' + fmt(tx.amount) + '</b></div>';
        }).join('') : '<div class="gov-sub">' + escHtml(govtx('noPay')) + '</div>')
      + '</div>'
      + '<div class="gov-btns"><button type="button" class="gov-pay-btn" onclick="openGovPayment(' + c.id + ')">+ ' + escHtml(gptx('cardBtn')) + '</button>'
      + '<button type="button" class="gov-open" onclick="openContactProfile(' + c.id + ')">' + escHtml(govtx('archive')) + ' &rsaquo;</button></div>'
      + '</div>';
  });
  var have = ents.map(function(c) { return (c.name || '').toLowerCase(); });
  var quick = GOV_QUICK.filter(function(q) { return have.indexOf(q.toLowerCase()) < 0; });
  h += '<div class="gov-add"><div style="font-size:13px;font-weight:700;margin-bottom:8px">' + escHtml(govtx('add')) + '</div>'
     + '<div style="display:flex;gap:8px"><input id="govNewName" type="text" placeholder="' + escHtml(govtx('addPh')) + '" onkeydown="if(event.key===\'Enter\')govAdd()" '
     + 'style="flex:1;min-width:0;padding:10px 12px;border-radius:10px;border:1.5px solid var(--border);background:var(--bg);color:var(--text);font-size:14px">'
     + '<button type="button" onclick="govAdd()" style="padding:0 16px;border-radius:10px;border:none;background:var(--primary);color:#fff;font-weight:700;cursor:pointer">' + escHtml(govtx('save')) + '</button></div>'
     + (quick.length ? '<div style="margin-top:10px;display:flex;gap:6px;flex-wrap:wrap;align-items:center"><span class="gov-sub">' + escHtml(govtx('quick')) + ':</span>'
        + quick.map(function(q) { return '<button type="button" class="gov-chip" onclick="govAdd(\'' + q + '\')">+ ' + escHtml(q) + '</button>'; }).join('') + '</div>' : '')
     + '</div></div>';
  page.innerHTML = h;
}
function govAdd(preset) {
  var name = preset || ((document.getElementById('govNewName') || {}).value || '').trim();
  if(!name) return;
  state.contacts = state.contacts || [];
  state.contacts.push({id: Date.now(), name: name, phone: '', email: '', type: 'government', notes: '', createdAt: Date.now()});
  save();
  renderGovPage();
}

// ── PROJECTS ─────────────────────────────────────────────────────────────────
// A planning space for company projects: steps, planned costs vs. a budget, notes,
// files (IndexedDB) and links to the people / vehicles / entities involved.
var PRJ_L = {
  title:    {en:'Projects', ar:'المشاريع', de:'Projekte'},
  all:      {en:'All', ar:'الكل', de:'Alle'},
  planning: {en:'Planning', ar:'تخطيط', de:'Planung'},
  active:   {en:'In progress', ar:'جاري', de:'In Arbeit'},
  done:     {en:'Done', ar:'منتهي', de:'Erledigt'},
  newPrj:   {en:'+ New project', ar:'+ مشروع جديد', de:'+ Neues Projekt'},
  empty:    {en:'No projects here yet.', ar:'لا توجد مشاريع هنا بعد.', de:'Hier noch keine Projekte.'},
  untitled: {en:'New project', ar:'مشروع جديد', de:'Neues Projekt'},
  tasks:    {en:'Tasks', ar:'المهام', de:'Aufgaben'},
  deadline: {en:'Deadline', ar:'الموعد النهائي', de:'Frist'},
  budget:   {en:'Budget', ar:'الميزانية', de:'Budget'},
  noDl:     {en:'No deadline', ar:'بدون موعد', de:'Keine Frist'},
  inDays:   {en:'in {n} d', ar:'بعد {n} يوم', de:'in {n} T'},
  overdue:  {en:'{n} d overdue', ar:'متأخر {n} يوم', de:'{n} T überfällig'},
  today:    {en:'today', ar:'اليوم', de:'heute'},
  name:     {en:'Project name', ar:'اسم المشروع', de:'Projektname'},
  goal:     {en:'Goal / description', ar:'الهدف / الوصف', de:'Ziel / Beschreibung'},
  goalPh:   {en:'What is this project about?', ar:'المشروع ده عن إيه؟', de:'Worum geht es in diesem Projekt?'},
  status:   {en:'Status', ar:'الحالة', de:'Status'},
  budgetEur:{en:'Budget', ar:'الميزانية', de:'Budget'},
  progress: {en:'Progress', ar:'التقدم', de:'Fortschritt'},
  steps:    {en:'Steps', ar:'الخطوات', de:'Schritte'},
  nDone:    {en:'{a} / {b} done', ar:'{a} / {b} تمت', de:'{a} / {b} erledigt'},
  noSteps:  {en:'No steps yet — add the first one below.', ar:'لا خطوات بعد — أضف أول خطوة من الأسفل.', de:'Noch keine Schritte — unten die erste hinzufügen.'},
  addStep:  {en:'Add a step…', ar:'أضف خطوة…', de:'Schritt hinzufügen…'},
  add:      {en:'Add', ar:'إضافة', de:'Hinzufügen'},
  costs:    {en:'Planned costs', ar:'التكاليف المخططة', de:'Geplante Kosten'},
  noCosts:  {en:'No planned costs yet.', ar:'لا تكاليف مخططة بعد.', de:'Noch keine geplanten Kosten.'},
  costItem: {en:'Cost item…', ar:'بند تكلفة…', de:'Kostenposition…'},
  notes:    {en:'Notes', ar:'ملاحظات', de:'Notizen'},
  noNotes:  {en:'No notes yet.', ar:'لا ملاحظات بعد.', de:'Noch keine Notizen.'},
  notePh:   {en:'Write a note…', ar:'اكتب ملاحظة…', de:'Notiz schreiben…'},
  saveNote: {en:'Save note', ar:'حفظ الملاحظة', de:'Notiz speichern'},
  files:    {en:'Files', ar:'الملفات', de:'Dateien'},
  noFiles:  {en:'No files yet.', ar:'لا ملفات بعد.', de:'Noch keine Dateien.'},
  upload:   {en:'+ Upload PDF or photo', ar:'+ رفع PDF أو صورة', de:'+ PDF oder Foto hochladen'},
  links:    {en:'Linked to', ar:'مرتبط بـ', de:'Verknüpft mit'},
  linksSub: {en:'who is involved', ar:'مين مشارك', de:'wer beteiligt ist'},
  noLinks:  {en:'Nothing to link yet — add contacts, employees or vehicles first.', ar:'مفيش حاجة تتربط بعد — أضف جهات اتصال أو موظفين أو عربيات الأول.', de:'Noch nichts zum Verknüpfen — zuerst Kontakte, Mitarbeiter oder Fahrzeuge anlegen.'},
  del:      {en:'Delete project', ar:'حذف المشروع', de:'Projekt löschen'},
  delConfirm:{en:'Delete this project with its files?', ar:'تحذف المشروع ده مع ملفاته؟', de:'Dieses Projekt samt Dateien löschen?'}
};
function prjtx(k) { return (PRJ_L[k] && PRJ_L[k][state.lang]) || (PRJ_L[k] && PRJ_L[k].en) || k; }
var PRJ = {filter: 'all', open: null};
var projectDocDb = makeFileStore('smartac_projectdocs');
function projectDocPut(rec) {
  return projectDocDb().then(function(db) { return new Promise(function(res, rej) {
    var t = db.transaction('files', 'readwrite'); t.objectStore('files').put(rec);
    t.oncomplete = res; t.onerror = function() { rej(t.error); };
  }); });
}
function projectDocGet(id) {
  return projectDocDb().then(function(db) { return new Promise(function(res, rej) {
    var r = db.transaction('files').objectStore('files').get(id);
    r.onsuccess = function() { res(r.result); }; r.onerror = function() { rej(r.error); };
  }); });
}
function projectDocDeleteRec(id) {
  return projectDocDb().then(function(db) { return new Promise(function(res) {
    var t = db.transaction('files', 'readwrite'); t.objectStore('files').delete(id);
    t.oncomplete = res; t.onerror = res;
  }); }).catch(function() {});
}

function prjGet(id) { return (state.projects || []).find(function(p) { return p.id === id; }); }
function prjDaysLeft(iso) {
  if(!iso) return null;
  var t = new Date(); t.setHours(0, 0, 0, 0);
  var p = iso.split('-');
  return Math.round((new Date(+p[0], +p[1] - 1, +p[2]) - t) / 86400000);
}
function prjDeadlineLabel(p) {
  var n = prjDaysLeft(p.deadline);
  if(n === null) return prjtx('noDl');
  var d = formatDateDisplay(p.deadline);
  if(p.status === 'done') return d;
  if(n < 0) return d + ' · ' + prjtx('overdue').replace('{n}', -n);
  if(n === 0) return d + ' · ' + prjtx('today');
  return d + ' · ' + prjtx('inDays').replace('{n}', n);
}
function prjStats(p) {
  var done = (p.tasks || []).filter(function(t) { return t.done; }).length, total = (p.tasks || []).length;
  var spent = (p.costs || []).reduce(function(s, c) { return s + (parseFloat(c.amt) || 0); }, 0);
  return {done: done, total: total, pct: total ? Math.round(done / total * 100) : 0, spent: spent};
}
function prjBadge(st) {
  var col = st === 'done' ? 'var(--green)' : (st === 'active' ? 'var(--primary)' : 'var(--orange)');
  var bg = st === 'done' ? 'var(--green-light)' : (st === 'active' ? 'var(--primary-light)' : 'var(--orange-light)');
  return '<span class="prj-badge" style="background:' + bg + ';color:' + col + '">' + escHtml(prjtx(st)) + '</span>';
}
function prjLinkOptions() {
  var out = [];
  (state.contacts || []).forEach(function(c) { out.push({key: 'c:' + c.id, label: c.name}); });
  (state.employees || []).forEach(function(e) { out.push({key: 'e:' + e.id, label: e.fullName || e.name || ''}); });
  (state.fleet || []).forEach(function(v) { out.push({key: 'v:' + v.id, label: v.name || v.plate || ''}); });
  return out.filter(function(o) { return o.label; });
}
function prjLinkLabels(p) {
  var opts = prjLinkOptions(), map = {};
  opts.forEach(function(o) { map[o.key] = o.label; });
  return (p.links || []).map(function(k) { return map[k]; }).filter(Boolean);
}

function renderProjectsPage() {
  var page = document.getElementById('projectsPage');
  if(!page) return;
  var dir = state.lang === 'ar' ? 'rtl' : 'ltr';
  var all = state.projects || [], counts = {all: all.length, planning: 0, active: 0, done: 0};
  all.forEach(function(p) { if(counts[p.status] != null) counts[p.status]++; });
  var chips = ['all', 'planning', 'active', 'done'].map(function(k) {
    return '<button type="button" class="prj-chip' + (PRJ.filter === k ? ' active' : '') + '" onclick="prjSetFilter(\'' + k + '\')">' + escHtml(prjtx(k)) + ' ' + counts[k] + '</button>';
  }).join('');
  var list = all.filter(function(p) { return PRJ.filter === 'all' || p.status === PRJ.filter; });
  var cards = list.map(function(p) {
    var s = prjStats(p), over = p.budget > 0 && s.spent > p.budget, labels = prjLinkLabels(p);
    return '<div class="prj-card" onclick="openProject(' + p.id + ')">'
      + '<div class="prj-card-top"><div style="min-width:0"><div class="prj-title">' + escHtml(p.title || prjtx('untitled')) + '</div>' + (p.desc ? '<div class="prj-desc">' + escHtml(p.desc) + '</div>' : '') + '</div>' + prjBadge(p.status) + '</div>'
      + '<div class="prj-bar' + (p.status === 'done' ? ' green' : '') + '"><i style="width:' + (p.status === 'done' ? 100 : s.pct) + '%"></i></div>'
      + '<div class="prj-meta"><span>' + escHtml(prjtx('tasks')) + ' <b>' + s.done + '/' + s.total + '</b></span><span>' + escHtml(prjtx('deadline')) + ' <b>' + escHtml(prjDeadlineLabel(p)) + '</b></span>'
      + (p.budget > 0 ? '<span>' + escHtml(prjtx('budget')) + ' <b' + (over ? ' style="color:var(--red)"' : '') + '>' + fmt(s.spent) + ' / ' + fmt(p.budget) + '</b></span>' : '')
      + '<span>&#128206; <b>' + (p.files || []).length + '</b></span></div>'
      + (labels.length ? '<div class="prj-chips" style="margin-top:10px">' + labels.map(function(l) { return '<span class="prj-tag">' + escHtml(l) + '</span>'; }).join('') + '</div>' : '')
      + '</div>';
  }).join('') || '<div class="prj-empty">' + escHtml(prjtx('empty')) + '</div>';
  page.innerHTML = '<div style="direction:' + dir + '">'
    + '<div style="display:flex;align-items:center;gap:10px;margin-bottom:14px"><button type="button" class="more-back-btn" onclick="showNav(\'home\')">' + svgIcon('chevronLeft', 20) + '</button><div style="font-size:20px;font-weight:700">' + escHtml(prjtx('title')) + '</div></div>'
    + '<div class="prj-toolbar"><div class="prj-chips">' + chips + '</div><button type="button" class="wt-btn" onclick="prjNew()">' + escHtml(prjtx('newPrj')) + '</button></div>'
    + cards + '</div>';
}
function prjSetFilter(f) { PRJ.filter = f; renderProjectsPage(); }
function prjNew() {
  state.projects = state.projects || [];
  var p = {id: Date.now(), title: prjtx('untitled'), desc: '', status: 'planning', deadline: '', budget: 0, tasks: [], costs: [], notes: [], files: [], links: [], createdAt: Date.now()};
  state.projects.unshift(p);
  PRJ.filter = 'all';
  save();
  openProject(p.id);
}
function openProject(id) {
  PRJ.open = id;
  var ov = document.getElementById('prjOverlay');
  if(!ov) {
    ov = document.createElement('div');
    ov.id = 'prjOverlay';
    ov.style.cssText = 'position:fixed;inset:0;z-index:100000;background:var(--bg);overflow-y:auto;-webkit-overflow-scrolling:touch';
    document.body.appendChild(ov);
  }
  renderProject();
}
function closeProject() {
  var ov = document.getElementById('prjOverlay');
  if(ov) ov.parentNode.removeChild(ov);
  PRJ.open = null;
  save();
  if(document.getElementById('projectsPage') && document.getElementById('projectsPage').style.display !== 'none') renderProjectsPage();
}
var PRJ_ICO = {
  task: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>',
  money: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="6" width="20" height="12" rx="2"/><circle cx="12" cy="12" r="2.5"/></svg>',
  note: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>',
  clip: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.4 11 12.2 20.2a5.5 5.5 0 0 1-7.8-7.8l9.2-9.2a3.7 3.7 0 0 1 5.2 5.2l-9.2 9.2a1.8 1.8 0 0 1-2.6-2.6l8.5-8.5"/></svg>',
  link: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/></svg>'
};
function prjHd(icon, color, title, sub) {
  return '<div class="wt-card-hd"><div class="wt-ico ' + color + '">' + PRJ_ICO[icon] + '</div><div><span class="wt-card-title">' + title + '</span>' + (sub ? '<span class="wt-card-sub">' + sub + '</span>' : '') + '</div></div>';
}
function renderProject() {
  var p = prjGet(PRJ.open), ov = document.getElementById('prjOverlay');
  if(!p || !ov) return;
  var keep = ov.scrollTop, s = prjStats(p), over = p.budget > 0 && s.spent > p.budget;
  var statusChips = ['planning', 'active', 'done'].map(function(k) {
    return '<button type="button" class="prj-chip' + (p.status === k ? ' active' : '') + '" onclick="prjSetStatus(\'' + k + '\')">' + escHtml(prjtx(k)) + '</button>';
  }).join('');
  var tasks = (p.tasks || []).map(function(t, i) {
    return '<div class="prj-task' + (t.done ? ' done' : '') + '"><button type="button" class="prj-check' + (t.done ? ' on' : '') + '" onclick="prjToggleTask(' + i + ')">' + (t.done ? '&#10003;' : '') + '</button>'
      + '<div class="prj-task-t">' + escHtml(t.t) + '</div>' + (t.due ? '<div class="prj-task-due">' + escHtml(formatDateDisplay(t.due)) + '</div>' : '')
      + '<button type="button" class="prj-x" onclick="prjDel(\'tasks\',' + i + ')">&times;</button></div>';
  }).join('') || '<div class="prj-empty">' + escHtml(prjtx('noSteps')) + '</div>';
  var costs = (p.costs || []).map(function(c, i) {
    return '<div class="prj-task"><div class="prj-task-t">' + escHtml(c.name) + '</div><b style="font-variant-numeric:tabular-nums">' + fmt(c.amt) + '</b><button type="button" class="prj-x" onclick="prjDel(\'costs\',' + i + ')">&times;</button></div>';
  }).join('') || '<div class="prj-empty">' + escHtml(prjtx('noCosts')) + '</div>';
  var notes = (p.notes || []).map(function(n, i) {
    return '<div class="prj-note"><div class="prj-note-d">' + escHtml(formatDateDisplay(n.d)) + '<button type="button" class="prj-x" style="float:right" onclick="prjDel(\'notes\',' + i + ')">&times;</button></div><div class="prj-note-t">' + escHtml(n.t) + '</div></div>';
  }).join('') || '<div class="prj-empty">' + escHtml(prjtx('noNotes')) + '</div>';
  var files = (p.files || []).map(function(f, i) {
    return '<div class="prj-file"><span>' + (f.type === 'application/pdf' ? '&#128196;' : '&#128444;') + '</span><span class="prj-file-n" onclick="prjViewFile(' + f.id + ')">' + escHtml(f.name) + '</span><button type="button" class="prj-x" onclick="prjDelFile(' + i + ')">&times;</button></div>';
  }).join('') || '<div class="prj-empty">' + escHtml(prjtx('noFiles')) + '</div>';
  var opts = prjLinkOptions();
  var links = opts.length ? opts.map(function(o) {
    return '<button type="button" class="prj-link' + ((p.links || []).indexOf(o.key) >= 0 ? ' on' : '') + '" onclick="prjToggleLink(\'' + o.key + '\')">' + escHtml(o.label) + '</button>';
  }).join(' ') : '<div class="prj-empty">' + escHtml(prjtx('noLinks')) + '</div>';
  var inp = 'class="wt-input"';
  var html = '<div class="wt-hdr"><button type="button" class="wt-back" onclick="closeProject()">' + svgIcon('chevronLeft', 18) + '</button><div class="wt-hdr-t">' + escHtml(prjtx('title')) + '</div></div>'
    + '<div class="wt-body">'
    + '<div class="wt-card"><div class="wt-card-body">'
    +   '<div class="wt-field"><div class="wt-lbl">' + escHtml(prjtx('name')) + '</div><input ' + inp + ' style="font-weight:800;font-size:16px" value="' + escHtml(p.title || '') + '" oninput="prjSetField(\'title\',this.value)"></div>'
    +   '<div class="wt-field"><div class="wt-lbl">' + escHtml(prjtx('goal')) + '</div><textarea ' + inp + ' rows="2" oninput="prjSetField(\'desc\',this.value)" placeholder="' + escHtml(prjtx('goalPh')) + '">' + escHtml(p.desc || '') + '</textarea></div>'
    +   '<div class="wt-field"><div class="wt-lbl">' + escHtml(prjtx('status')) + '</div><div class="prj-chips">' + statusChips + '</div></div>'
    +   '<div class="prj-two"><div><div class="wt-lbl">' + escHtml(prjtx('deadline')) + '</div><input ' + inp + ' type="date" value="' + escHtml(p.deadline || '') + '" onchange="prjSetField(\'deadline\',this.value,true)"></div>'
    +   '<div><div class="wt-lbl">' + escHtml(prjtx('budgetEur')) + '</div><input ' + inp + ' type="number" min="0" step="100" value="' + (p.budget || '') + '" placeholder="0" onchange="prjSetField(\'budget\',parseFloat(this.value)||0,true)"></div></div>'
    +   '<div class="prj-bar' + (p.status === 'done' ? ' green' : '') + '" style="margin-top:16px"><i style="width:' + (p.status === 'done' ? 100 : s.pct) + '%"></i></div>'
    +   '<div class="prj-meta"><span>' + escHtml(prjtx('progress')) + ' <b>' + (p.status === 'done' ? 100 : s.pct) + '%</b></span><span>' + escHtml(prjtx('deadline')) + ' <b>' + escHtml(prjDeadlineLabel(p)) + '</b></span></div>'
    + '</div></div>'
    + '<div class="wt-card">' + prjHd('task', 'green', escHtml(prjtx('steps')), escHtml(prjtx('nDone').replace('{a}', s.done).replace('{b}', s.total))) + '<div class="wt-card-body">' + tasks
    +   '<div class="prj-add"><input ' + inp + ' id="prjNewTask" placeholder="' + escHtml(prjtx('addStep')) + '" onkeydown="if(event.key===\'Enter\')prjAddTask()"><input ' + inp + ' id="prjNewTaskDue" type="date" style="max-width:130px"><button type="button" class="wt-btn" onclick="prjAddTask()">' + escHtml(prjtx('add')) + '</button></div></div></div>'
    + '<div class="wt-card">' + prjHd('money', 'amber', escHtml(prjtx('costs')), p.budget > 0 ? escHtml(fmt(s.spent) + ' / ' + fmt(p.budget)) : '') + '<div class="wt-card-body">' + costs
    +   (p.budget > 0 ? '<div class="prj-bar' + (over ? ' red' : '') + '"><i style="width:' + Math.min(100, Math.round(s.spent / p.budget * 100)) + '%"></i></div>' : '')
    +   '<div class="prj-add"><input ' + inp + ' id="prjNewCost" placeholder="' + escHtml(prjtx('costItem')) + '"><input ' + inp + ' id="prjNewCostAmt" type="number" min="0" placeholder="' + escHtml(state.currency) + '" style="max-width:96px"><button type="button" class="wt-btn" onclick="prjAddCost()">' + escHtml(prjtx('add')) + '</button></div></div></div>'
    + '<div class="wt-card">' + prjHd('note', 'blue', escHtml(prjtx('notes'))) + '<div class="wt-card-body">' + notes
    +   '<textarea ' + inp + ' id="prjNewNote" rows="2" placeholder="' + escHtml(prjtx('notePh')) + '" style="margin-top:8px"></textarea><div style="margin-top:8px"><button type="button" class="wt-btn" onclick="prjAddNote()">' + escHtml(prjtx('saveNote')) + '</button></div></div></div>'
    + '<div class="wt-card">' + prjHd('clip', 'violet', escHtml(prjtx('files'))) + '<div class="wt-card-body">' + files
    +   '<input type="file" id="prjFileIn" accept="image/*,application/pdf" style="display:none" onchange="prjAddFile(this)">'
    +   '<div style="margin-top:10px"><button type="button" class="wt-btn ghost" onclick="document.getElementById(\'prjFileIn\').click()">' + escHtml(prjtx('upload')) + '</button></div></div></div>'
    + '<div class="wt-card">' + prjHd('link', 'blue', escHtml(prjtx('links')), escHtml(prjtx('linksSub'))) + '<div class="wt-card-body"><div class="prj-chips">' + links + '</div></div></div>'
    + '<button type="button" class="wt-btn ghost block" style="color:var(--red);border-color:var(--red);margin-bottom:30px" onclick="prjDelete()">' + escHtml(prjtx('del')) + '</button>'
    + '</div>';
  ov.innerHTML = html;
  ov.scrollTop = keep;
}
function prjSetField(f, v, rerender) { var p = prjGet(PRJ.open); if(!p) return; p[f] = v; save(); if(rerender) renderProject(); }
function prjSetStatus(st) { var p = prjGet(PRJ.open); p.status = st; save(); renderProject(); }
function prjToggleTask(i) { var t = prjGet(PRJ.open).tasks[i]; t.done = !t.done; save(); renderProject(); }
function prjDel(kind, i) { prjGet(PRJ.open)[kind].splice(i, 1); save(); renderProject(); }
function prjAddTask() {
  var el = document.getElementById('prjNewTask'), due = document.getElementById('prjNewTaskDue').value;
  if(!el || !el.value.trim()) return;
  prjGet(PRJ.open).tasks.push({t: el.value.trim(), done: false, due: due});
  save(); renderProject();
}
function prjAddCost() {
  var n = document.getElementById('prjNewCost').value.trim(), a = parseAmount(document.getElementById('prjNewCostAmt').value);
  if(!n || isNaN(a)) return;
  prjGet(PRJ.open).costs.push({name: n, amt: a});
  save(); renderProject();
}
function prjAddNote() {
  var el = document.getElementById('prjNewNote');
  if(!el || !el.value.trim()) return;
  prjGet(PRJ.open).notes.unshift({d: today(), t: el.value.trim()});
  save(); renderProject();
}
function prjToggleLink(key) {
  var p = prjGet(PRJ.open), i = (p.links || []).indexOf(key);
  if(!p.links) p.links = [];
  if(i >= 0) p.links.splice(i, 1); else p.links.push(key);
  save(); renderProject();
}
function prjAddFile(input) {
  var f = input.files && input.files[0];
  input.value = '';
  if(!f) return;
  var p = prjGet(PRJ.open), isPdf = f.type === 'application/pdf';
  receiptCompress(f).then(function(blob) {
    var id = Date.now();
    return projectDocPut({id: id, projectId: p.id, user: localStorage.getItem('smartac_user') || '', name: f.name, type: isPdf ? 'application/pdf' : 'image/jpeg', blob: blob, createdAt: new Date().toISOString()})
      .then(function() { p.files.push({id: id, name: f.name, type: isPdf ? 'application/pdf' : 'image/jpeg'}); save(); renderProject(); });
  });
}
function prjViewFile(id) { projectDocGet(id).then(function(rec) { if(rec) openReceiptViewer(rec); }); }
function prjDelFile(i) {
  var p = prjGet(PRJ.open), f = p.files[i];
  if(f) projectDocDeleteRec(f.id);
  p.files.splice(i, 1); save(); renderProject();
}
async function prjDelete() {
  var p = prjGet(PRJ.open); if(!p) return;
  if(!(await confirmAsync(prjtx('del'), prjtx('delConfirm')))) return;
  (p.files || []).forEach(function(f) { projectDocDeleteRec(f.id); });
  state.projects = state.projects.filter(function(x) { return x.id !== p.id; });
  save(); closeProject();
}

// ── HOME PICKER ──

// Years offered on the picker: every year with data, the current one, and two
// ahead — fixed commitments are known before the year starts.
function pickerYears() {
  var ys = {}, cur = new Date().getFullYear();
  (state.transactions || []).forEach(function(tx) {
    if(tx && tx.date) { var y = parseInt(tx.date.substring(0,4),10); if(y) ys[y] = 1; }
  });
  for(var i = 0; i <= 2; i++) ys[cur + i] = 1;
  ys[state.year] = 1;
  return Object.keys(ys).map(Number).sort(function(a,b){ return a-b; });
}

// Net for one month under the same model the month view uses: that month's
// transactions, plus the fixed rules that have not been booked into them yet.
function monthNetFor(y, m) {
  var monthPrefix = y + '-' + pad2(m + 1);
  var net = 0, seen = false;
  (state.transactions || []).forEach(function(tx) {
    if(!tx || !tx.date || tx.date.substring(0,7) !== monthPrefix) return;
    seen = true;
    var n = vatBreakdown(tx.amount, tx.vatRate || 0).netto;
    net += tx.type === 'income' ? n : -n;
  });
  var fIn = fixedRowsFor('income', y, m), fOut = fixedRowsFor('expense', y, m);
  if(fIn.length || fOut.length) seen = true;
  net += sumRows(fIn).netto - sumRows(fOut).netto;
  return seen ? net : null;
}

function showHomePicker() {
  window.scrollTo(0, 0);
  state.homeView = 'picker';
  var hp = document.getElementById('homePicker'), md = document.getElementById('monthDetail');
  if(hp) hp.style.display = '';
  if(md) md.style.display = 'none';
  updatePeriodBarVisibility('home');
  renderHomePicker();
}

function openMonthDetail(m) {
  window.scrollTo(0, 0);
  state.month = m;
  state.homeView = 'month';
  var hp = document.getElementById('homePicker'), md = document.getElementById('monthDetail');
  if(hp) hp.style.display = 'none';
  if(md) md.style.display = '';
  updatePeriodBarVisibility('home');
  renderHome();
}

function renderHomePicker() {
  var names = monthNamesLocal();
  var now = new Date(), curY = now.getFullYear(), curM = now.getMonth();
  var ys = pickerYears(), yi = ys.indexOf(state.year);

  var yn = document.getElementById('hpYearNum');
  if(yn) { yn.textContent = state.year; yn.classList.toggle('future', state.year > curY); }
  var up = document.getElementById('hpYearUp'), dn = document.getElementById('hpYearDn');
  if(up) up.disabled = yi <= 0;
  if(dn) dn.disabled = yi >= ys.length - 1;

  var mb = document.getElementById('hpMonths');
  if(mb) {
    var h2 = '';
    for(var m = 0; m < 12; m++) {
      // The card carries the month name only. Figures live inside the month.
      var net = monthNetFor(state.year, m);
      var isCur = (state.year === curY && m === curM && net !== null);
      h2 += '<button type="button" class="hp-mo' + (net === null ? ' void' : '') + (isCur ? ' cur' : '') + '"' +
            (net === null ? '' : ' onclick="openMonthDetail(' + m + ')"') + '>' +
            '<span class="hp-mo-nm">' + escHtml(names[m]) + '</span></button>';
    }
    mb.innerHTML = h2;
  }

  var lbl = document.getElementById('hpBackLbl');
  if(lbl) lbl.innerHTML = artMonthTitleHtml();
  renderHomeBiz();
}

function hpShiftYear(d) {
  var ys = pickerYears(), i = ys.indexOf(state.year) + d;
  if(i < 0 || i >= ys.length) return;
  state.year = ys[i];
  renderHomePicker();
}









// Everything booked in this year before the month on screen — the balance the
// month opens with, rather than a figure for the month itself.
function carryInTotals(y, m) {
  var netto = 0, vat = 0;
  (state.transactions || []).forEach(function(tx) {
    if(!tx || !tx.date) return;
    var ty = parseInt(tx.date.substring(0,4), 10);
    var tm = parseInt(tx.date.substring(5,7), 10) - 1;
    if(ty !== y || tm >= m) return;
    var v = vatBreakdown(tx.amount, tx.vatRate || 0);
    if(tx.type === 'income')      { netto += v.netto; vat += v.steuer; }
    else if(tx.type === 'expense'){ netto -= v.netto; vat -= v.steuer; }
  });
  // MwSt paid to the Finanzamt settles VAT only — no Netto
  vatPaymentsWhere(function(py, pm) { return py === y && pm < m; }).forEach(function(p) { vat -= p.amount; });
  return {netto: netto, vat: vat, total: netto + vat};
}

function monthTotals(y, m) {
  var pre = y + '-' + pad2(m + 1), netto = 0, vat = 0;
  (state.transactions || []).forEach(function(tx) {
    if(!tx || !tx.date || tx.date.substring(0, 7) !== pre) return;
    var v = vatBreakdown(tx.amount, tx.vatRate || 0), k = tx.type === 'income' ? 1 : -1;
    netto += k * v.netto; vat += k * v.steuer;
  });
  [['income', 1], ['expense', -1]].forEach(function(p) {
    var sm = sumRows(fixedRowsFor(p[0], y, m));
    netto += p[1] * sm.netto; vat += p[1] * sm.steuer;
  });
  vatPaymentsWhere(function(py, pm) { return py === y && pm === m; }).forEach(function(p) { vat -= p.amount; });
  return {netto: netto, vat: vat, total: netto + vat};
}

function renderMonthCard() {
  var c = monthTotals(state.year, state.month);
  function put(id, v) {
    var el = document.getElementById(id);
    if(!el) return;
    el.textContent = (Math.abs(v) < 0.005 ? '' : (v > 0 ? '+' : '-')) + fmt(Math.abs(v));
    el.style.color = Math.abs(v) < 0.005 ? 'var(--text3)' : (v > 0 ? 'var(--income)' : 'var(--expense)');
  }
  var t = document.getElementById('monthCardTitle');
  if(t) t.textContent = hptx('monthHd') + ' ' + monthNamesLocal()[state.month] + ' ' + state.year;
  [['mcNetL','carryNet'],['mcVatL','carryVat'],['mcTotL','carryTot']].forEach(function(p) {
    var el = document.getElementById(p[0]); if(el) el.textContent = hptx(p[1]);
  });
  // a month settled by a payment can keep a fraction of a cent from rounding — show it as settled
  if(Math.abs(c.vat) < 0.01) { c.vat = 0; c.total = c.netto; }
  put('mcNetV', c.netto); putVat('mcVatV', c.vat); put('mcTotV', c.total);
  renderVatPayBtn();
}

function renderCarryCard() {
  renderMonthCard();
  var c = carryInTotals(state.year, state.month);
  function put(id, v, neutral) {
    var el = document.getElementById(id);
    if(!el) return;
    el.textContent = (Math.abs(v) < 0.005 ? '' : (v > 0 ? '+' : '-')) + fmt(Math.abs(v));
    el.style.color = neutral ? 'var(--text)' :
      (Math.abs(v) < 0.005 ? 'var(--text3)' : (v > 0 ? 'var(--income)' : 'var(--expense)'));
  }
  var ttl = document.getElementById('carryTitle');
  if(ttl) ttl.textContent = hptx('carryHd');
  ['carryNetL:carryNet','carryVatL:carryVat','carryTotL:carryTot'].forEach(function(pair) {
    var p = pair.split(':'), el = document.getElementById(p[0]);
    if(el) el.textContent = hptx(p[1]);
  });
  put('carryNetV', c.netto);
  putVat('carryVatV', c.vat);
  put('carryTotV', c.total);
  var card = document.getElementById('carryCard');
  // January has nothing before it, and an all-zero card is just noise on a phone
  var empty = Math.abs(c.netto) < 0.005 && Math.abs(c.vat) < 0.005 && Math.abs(c.total) < 0.005;
  if(card) card.style.display = '';
  var wrap = document.getElementById('carryWrap');
  if(wrap) { wrap.style.display = empty ? 'none' : ''; if(empty) closeCarryCard(); }
  var cl = document.getElementById('carryChipL');
  if(cl) cl.textContent = hptx('carryChip');
  put('carryChipV', c.total);
}

// VAT saldo: what is owed to the Finanzamt is shown as a plain amount (never a
// minus) in its own colour with a "payable" tag; a credit is green with "credit".
function putVat(id, v) {
  var el = document.getElementById(id);
  if(!el) return;
  el.classList.remove('vat-owed', 'vat-credit');
  el.style.color = '';
  if(Math.abs(v) < 0.005) {
    el.textContent = fmt(0); el.style.color = 'var(--text3)';
    // month whose VAT was settled by a payment made for it
    if(id === 'mcVatV' && typeof vatPaidFor === 'function' && vatPaidFor(state.year, state.month)) {
      el.style.color = 'var(--income)'; el.classList.add('vat-credit');
      var pt = document.createElement('span'); pt.className = 'vat-tag'; pt.textContent = vptx('paid'); el.appendChild(pt);
    }
    return;
  }
  el.textContent = fmt(Math.abs(v));
  el.classList.add(v > 0 ? 'vat-owed' : 'vat-credit');
  var tag = document.createElement('span');
  tag.className = 'vat-tag';
  tag.textContent = hptx(v > 0 ? 'vatDue' : 'vatCredit');
  el.appendChild(tag);
}

function toggleCarryCard(ev) {
  if(ev) ev.stopPropagation();
  var wrap = document.getElementById('carryWrap');
  if(!wrap) return;
  var open = !wrap.classList.contains('open');
  wrap.classList.toggle('open', open);
  var chip = document.getElementById('carryChip');
  if(chip) chip.setAttribute('aria-expanded', open ? 'true' : 'false');
}
function closeCarryCard() {
  var wrap = document.getElementById('carryWrap');
  if(!wrap || !wrap.classList.contains('open')) return;
  wrap.classList.remove('open');
  var chip = document.getElementById('carryChip');
  if(chip) chip.setAttribute('aria-expanded', 'false');
}
document.addEventListener('click', function(e) {
  var wrap = document.getElementById('carryWrap');
  if(wrap && !wrap.contains(e.target)) closeCarryCard();
});
document.addEventListener('keydown', function(e) { if(e.key === 'Escape') closeCarryCard(); });

// Straight shortcuts to the pages these things already live on.
function renderHomeBiz() {
  var host = document.getElementById('hpBizBody');
  if(!host) return;
  var items = [
    {view:'fleet',     label:'navFleet', icon:'truck',     show: state.businessType === 'transport'},
    {view:'contacts',  label:'navCont',  icon:'building',  show: true},
    {view:'gov',       label:'navGov',   icon:'landmark',  show: true},
    {view:'employees', label:'navEmp',   icon:'users',     show: true},
    {view:'projects',  label:'navPrj',   icon:'briefcase', show: true},
    {view:'agenda',    label:'navLog',   icon:'checklist', show: true},
    {view:'acc',       label:'navPkg',   icon:'fileText',  show: true}
  ];
  var h = '';
  items.forEach(function(it) {
    if(!it.show) return;
    h += '<button type="button" class="hp-nav" onclick="' + (it.view === 'acc' ? 'openAccPackage()' : 'showNav(\'' + it.view + '\')') + '">' +
         '<span class="hp-nav-ico">' + svgIcon(it.icon, 15) + '</span>' +
         '<span class="hp-nav-lbl">' + escHtml(hptx(it.label)) + '</span>' +
         '<span class="hp-nav-car">&rsaquo;</span></button>';
  });
  host.innerHTML = h;
  var bh = document.getElementById('hpBizHd');
  if(bh) bh.textContent = hptx('bizHd');
}


function setTxTab(t) {
  state.txTab = t;
  renderTxPanes();
}

function renderTxPanes() {
  var host = document.getElementById('txPanes');
  if(!host) return;
  var type = state.txTab === 'income' ? 'income' : 'expense';

  document.querySelectorAll('.tx-tab').forEach(function(b) {
    var bt = b.getAttribute('data-t');
    b.textContent = hptx(bt);
    b.classList.toggle('active', bt === type);
  });
  var tabsEl = document.getElementById('txTabs');
  if(tabsEl && tabsEl.parentNode) tabsEl.parentNode.setAttribute('data-tx', type);

  var txs = getFiltered().filter(function(tx) { return tx.type === type; })
              .map(function(tx) {
                return {name: tx.name, amount: tx.amount, vatRate: tx.vatRate || 0,
                        day: parseInt((tx.date || '').substring(8, 10), 10) || 1, tx: tx};
              }).sort(function(a, b) { return a.day - b.day; });
  var fixed = fixedRowsFor(type);
  var sTx = sumRows(txs), sFix = sumRows(fixed);
  var color = type === 'income' ? 'var(--income)' : 'var(--expense)';
  var sign = type === 'income' ? '+' : '-';

  renderReceiptStrip(type);

  function group(title, rows, total, isFixed) {
    if(!rows.length) return '';
    var h = '<div class="tx-grp"><div class="tx-grp-hdr"><span class="tx-grp-ttl">' + escHtml(title) + '</span>'
          + '<span class="tx-grp-sum" style="color:' + color + '">' + sign + fmt(total) + '</span></div>';
    rows.forEach(function(r, i) {
      var dd = pad2(r.day) + '.' + pad2(state.month + 1) + '.' + state.year;
      var rv = vatBreakdown(r.amount, r.vatRate || 0);
      h += '<button type="button" class="tx-row' + (isFixed ? ' tx-row-fix' : '') + '"'
         + (isFixed ? '' : ' data-tx="' + i + '"') + '>'
         + '<span class="tx-row-nm">' + escHtml(r.name || '') + '</span>'
         + '<span class="tx-row-dt">' + dd + '</span>'
         + '<span class="tx-row-am" style="color:' + color + '">' + sign + fmt(r.amount) + '</span>'
         + '<span class="tx-row-sub">' + '<i>' + escHtml(hptx('rowNet')) + ' ' + fmt(rv.netto) + '</i><i>' + escHtml(hptx('rowVat')) + ' ' + fmt(rv.steuer) + '</i><i>' + escHtml(hptx('rowTot')) + ' ' + fmt(rv.brutto) + '</i>' + '</span></button>';
    });
    return h + '</div>';
  }

  var html = group(hptx(type === 'income' ? 'fixIn' : 'fixOut'), fixed, sFix.brutto, true)
           + (type === 'expense' ? vatPayGroupHtml(state.year, state.month) + ppGroupHtml() : '')
           + group(hptx(type === 'income' ? 'restIn' : 'restOut'), txs, sTx.brutto, false);
  if(!html) html = '<div class="tx-empty">' + escHtml(hptx('none')) + '</div>';
  if(type === 'expense') html = '<div class="exp-actions"><button type="button" class="gov-pay-top" onclick="openGovPayment()">' + svgIcon('landmark', 15) + ' ' + escHtml(gptx('btn')) + '</button>'
    + '<button type="button" class="gov-pay-top" onclick="openPurchasePlan()">' + svgIcon('calendar', 15) + ' ' + escHtml(pptx('btn')) + '</button></div>' + html;

  var yn = yearNetTotal(state.year);
  html += '<div class="year-net"><span class="year-net-l">' + escHtml(hptx('yearNet')) + ' · ' + state.year + '</span>'
        + '<span class="year-net-v" style="color:' + (yn >= 0 ? 'var(--income)' : 'var(--expense)') + '">'
        + (yn >= 0 ? '+' : '-') + fmt(Math.abs(yn)) + '</span></div>';

  host.innerHTML = html;
  host.querySelectorAll('[data-tx]').forEach(function(el) {
    el.onclick = function() { showTxDetail(txs[+el.getAttribute('data-tx')].tx); };
  });
  ppWire(host);
  host.querySelectorAll('[data-vatpay]').forEach(function(el) {
    el.onclick = function() { openVatPayment(el.getAttribute('data-vatpay')); };
  });
}

function renderTxList(txs, showAll) {
  var list = document.getElementById('txList');
  if(!list) return;
  var recent = showAll ? txs.slice().reverse() : txs.slice().reverse().slice(0,5);
  if(!recent.length) {
    list.innerHTML = '<div style="text-align:center;padding:30px;color:var(--text3);font-size:14px">No transactions yet.<br/>Tap + to add your first one!</div>';
    return;
  }
  list.innerHTML = '';
  recent.forEach(function(tx) {
    var item = document.createElement('div');
    item.className = 'tx-item';
    var tagHtml = '';
    if(tx.clientName) {
      tagHtml = '<div style="font-size:11px;font-weight:600;color:var(--green);margin-top:2px">'+tx.clientName+'</div>';
    } else if(tx.supplierName) {
      tagHtml = '<div style="font-size:11px;font-weight:600;color:var(--expense);margin-top:2px">'+tx.supplierName+'</div>';
    }
    item.innerHTML = '<div class="tx-icon '+tx.type+'">'+txIconSvg(tx)+'</div>'
      +'<div class="tx-info"><div class="tx-name">'+tx.name+'</div>'
      +'<div class="tx-meta">'+tc(tx.category)+' · '+formatDateDisplay(tx.date)+'</div>'
      +tagHtml+'</div>'
      +'<div style="text-align:right">'
      +'<div class="tx-amount '+tx.type+'">'+(tx.type==='income'?'+':'-')+fmt(tx.amount)+'</div>'
      +'<div style="font-size:10px;color:var(--text3);margin-top:2px">'+(tx.invoice?svgIcon('paperclip',10):'')+'</div>'
      +'</div>';
    // Open detail on click
    item.onclick = function() { showTxDetail(tx); };
    list.appendChild(item);
  });
}

// Matches a transaction's name/category, plus every date form a user might type
// (raw ISO, the app's configured display format, and the month name/year in the
// current UI language) so searching "12.07" or "July"/"يوليو"/"Juli" finds it too.




// ── ALL TRANSACTIONS (period-filtered, reached from Home's "See all") ──








function renderChart() {
  var chart = document.getElementById('barChart');
  if(!chart) return;
  chart.innerHTML = '';
  var rp = document.getElementById('reportsPage');
  var period = (rp && rp.style.display !== 'none') ? (state.reportPeriod || 'month') : state.period;
  var now = new Date();
  var days = [];

  if(period === 'today') {
    // Today: 24 hours split into 6 blocks of 4 hours
    for(var h=0; h<24; h+=4) {
      var label = h===0?'12a': h<12?(h+'a'): h===12?'12p':((h-12)+'p');
      var inc=0, exp=0;
      state.transactions.forEach(function(tx){
        if(tx.date !== now.toISOString().split('T')[0]) return;
        var txH = tx.hour !== undefined ? tx.hour : 0;
        if(txH >= h && txH < h+4) {
          if(tx.type==='income') inc+=tx.amount;
          else if(tx.type==='expense') exp+=tx.amount;
        }
      });
      // Since we don't store hours, just show today's totals in first bar
      if(h===0) {
        var todayStr = now.toISOString().split('T')[0];
        var todayTxs = state.transactions.filter(function(t){return t.date===todayStr;});
        inc = todayTxs.filter(function(t){return t.type==='income';}).reduce(function(s,t){return s+t.amount;},0);
        exp = todayTxs.filter(function(t){return t.type==='expense';}).reduce(function(s,t){return s+t.amount;},0);
      }
      days.push({label: label, inc: h===0?inc:0, exp: h===0?exp:0});
    }
  } else if(period === 'week') {
    // Last 7 days
    for(var i=6;i>=0;i--) {
      var d = new Date(now); d.setDate(d.getDate()-i);
      var ds = d.toISOString().split('T')[0];
      var txs = state.transactions.filter(function(t){return t.date===ds;});
      var inc = txs.filter(function(t){return t.type==='income';}).reduce(function(s,t){return s+t.amount;},0);
      var exp = txs.filter(function(t){return t.type==='expense';}).reduce(function(s,t){return s+t.amount;},0);
      days.push({label: d.toLocaleDateString('en',{weekday:'short'}).charAt(0), inc:inc, exp:exp});
    }
  } else if(period === 'month') {
    // Current month: each week (4 bars)
    var year = now.getFullYear(), month = now.getMonth();
    var weeks = [{label:'W1',inc:0,exp:0},{label:'W2',inc:0,exp:0},{label:'W3',inc:0,exp:0},{label:'W4',inc:0,exp:0}];
    state.transactions.forEach(function(tx){
      var d2 = new Date(tx.date);
      if(d2.getMonth()!==month || d2.getFullYear()!==year) return;
      var weekIdx = Math.min(3, Math.floor((d2.getDate()-1)/7));
      if(tx.type==='income') weeks[weekIdx].inc += tx.amount;
      else if(tx.type==='expense') weeks[weekIdx].exp += tx.amount;
    });
    days = weeks;
  } else if(period === 'day') {
    var todayStr2 = now.toISOString().split('T')[0];
    var todayTxs2 = state.transactions.filter(function(t){return t.date===todayStr2;});
    var inc2 = todayTxs2.filter(function(t){return t.type==='income';}).reduce(function(s,t){return s+t.amount;},0);
    var exp2 = todayTxs2.filter(function(t){return t.type==='expense';}).reduce(function(s,t){return s+t.amount;},0);
    days.push({label:'AM',inc:inc2,exp:0});
    days.push({label:'PM',inc:0,exp:exp2});
  } else if(period === 'quarter') {
    var q2 = Math.floor(now.getMonth()/3);
    for(var mq=q2*3; mq<q2*3+3; mq++) {
      var mInc=0,mExp=0;
      state.transactions.forEach(function(tx){
        var dq=new Date(tx.date);
        if(dq.getFullYear()!==now.getFullYear()||dq.getMonth()!==mq) return;
        if(tx.type==='income') mInc+=tx.amount;
        else if(tx.type==='expense') mExp+=tx.amount;
      });
      var mLabel = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][mq];
      days.push({label:mLabel,inc:mInc,exp:mExp});
    }
  } else if(period === 'year') {
    // Current year: each month
    var MONTHS = ['J','F','M','A','M','J','J','A','S','O','N','D'];
    var yr = now.getFullYear();
    for(var m=0;m<12;m++) {
      var inc=0, exp=0;
      state.transactions.forEach(function(tx){
        var d3 = new Date(tx.date);
        if(d3.getFullYear()!==yr || d3.getMonth()!==m) return;
        if(tx.type==='income') inc+=tx.amount;
        else if(tx.type==='expense') exp+=tx.amount;
      });
      days.push({label: MONTHS[m], inc:inc, exp:exp});
    }
  } else if(period === 'custom') {
    // Custom: bucket the selected date range into days/weeks/months, like the other periods
    var csStartEl = document.getElementById('rptCustomStart');
    var csEndEl = document.getElementById('rptCustomEnd');
    var csStart = csStartEl ? csStartEl.value : '';
    var csEnd = csEndEl ? csEndEl.value : '';
    if(!csStart || !csEnd) {
      var txsC = getReportFiltered();
      var incC = txsC.filter(function(t){return t.type==='income';}).reduce(function(s,t){return s+t.amount;},0);
      var expC = txsC.filter(function(t){return t.type==='expense';}).reduce(function(s,t){return s+t.amount;},0);
      days.push({label:'In',inc:incC,exp:0});
      days.push({label:'Out',inc:0,exp:expC});
    } else {
      var dStart = new Date(csStart+'T00:00:00');
      var dEnd = new Date(csEnd+'T00:00:00');
      var diffDays = Math.max(0, Math.round((dEnd-dStart)/86400000));
      if(diffDays <= 14) {
        for(var ci=0; ci<=diffDays; ci++) {
          var cd = new Date(dStart); cd.setDate(cd.getDate()+ci);
          var cds = cd.toISOString().split('T')[0];
          var ctxs = state.transactions.filter(function(t){return t.date===cds;});
          var cinc = ctxs.filter(function(t){return t.type==='income';}).reduce(function(s,t){return s+t.amount;},0);
          var cexp = ctxs.filter(function(t){return t.type==='expense';}).reduce(function(s,t){return s+t.amount;},0);
          days.push({label: cd.getDate()+'/'+(cd.getMonth()+1), inc:cinc, exp:cexp});
        }
      } else if(diffDays <= 120) {
        var wkCount = Math.ceil((diffDays+1)/7);
        for(var wi=0; wi<wkCount; wi++) {
          var wkStart = new Date(dStart); wkStart.setDate(wkStart.getDate()+wi*7);
          var wkEnd = new Date(wkStart); wkEnd.setDate(wkEnd.getDate()+6);
          if(wkEnd > dEnd) wkEnd = new Date(dEnd);
          var wkStartS = wkStart.toISOString().split('T')[0];
          var wkEndS = wkEnd.toISOString().split('T')[0];
          var wtxs = state.transactions.filter(function(t){return t.date>=wkStartS && t.date<=wkEndS;});
          var winc = wtxs.filter(function(t){return t.type==='income';}).reduce(function(s,t){return s+t.amount;},0);
          var wexp = wtxs.filter(function(t){return t.type==='expense';}).reduce(function(s,t){return s+t.amount;},0);
          days.push({label:'W'+(wi+1), inc:winc, exp:wexp});
        }
      } else {
        var curM = new Date(dStart.getFullYear(), dStart.getMonth(), 1);
        var endM = new Date(dEnd.getFullYear(), dEnd.getMonth(), 1);
        var MONTHS_C = ['J','F','M','A','M','J','J','A','S','O','N','D'];
        while(curM <= endM) {
          var mY = curM.getFullYear(), mM = curM.getMonth();
          var mtxs = state.transactions.filter(function(t){
            var td = new Date(t.date+'T12:00:00');
            return td.getFullYear()===mY && td.getMonth()===mM;
          });
          var minc = mtxs.filter(function(t){return t.type==='income';}).reduce(function(s,t){return s+t.amount;},0);
          var mexp = mtxs.filter(function(t){return t.type==='expense';}).reduce(function(s,t){return s+t.amount;},0);
          days.push({label: MONTHS_C[mM], inc:minc, exp:mexp});
          curM.setMonth(curM.getMonth()+1);
        }
      }
    }
  }

  // Update chart title
  var titleMap = {
    today:   {en:'Today',               ar:'اليوم',                   de:'Heute'},
    day:     {en:'Today',               ar:'اليوم',                   de:'Heute'},
    week:    {en:'Last 7 Days',         ar:'آخر 7 أيام',              de:'Letzte 7 Tage'},
    month:   {en:'This Month',          ar:'هذا الشهر',               de:'Dieser Monat'},
    quarter: {en:'This Quarter',        ar:'هذا الربع',               de:'Dieses Quartal'},
    year:    {en:'This Year',           ar:'هذا العام',               de:'Dieses Jahr'},
    custom:  {en:'Custom Period',       ar:'فترة مخصصة',              de:'Benutzerdefiniert'},
  };
  var lang = state.lang;
  var titleEl = document.getElementById('rpt-chart-title');
  if(titleEl) titleEl.textContent = (titleMap[period]&&titleMap[period][lang]) || titleMap[period].en;

  // Add fixed costs / salaries to expense bars based on period
  var fixedMonthlyChart = state.recurring.reduce(function(s,r){return s+(parseFloat(r.amount)||0);},0)
    + state.employees.reduce(function(s,e){return s+(parseFloat(e.salary)||0);},0);
  var fixedIncMonthlyChart = (state.fixedIncome||[]).reduce(function(s,fi){return s+(parseFloat(fi.amount)||0);},0);
  var chartPeriodBars = days.length || 1;
  days.forEach(function(d, idx) {
    // Add fixed income proportion
    if(period==='month') { d.inc += fixedIncMonthlyChart / chartPeriodBars; d.exp += fixedMonthlyChart / chartPeriodBars; }
    else if(period==='year') { d.inc += fixedIncMonthlyChart; d.exp += fixedMonthlyChart; }
    else if(period==='quarter') { d.inc += fixedIncMonthlyChart; d.exp += fixedMonthlyChart; }
  });
  var maxVal = Math.max.apply(null, days.map(function(d){return Math.max(d.inc,d.exp);}).concat([1]));
  days.forEach(function(d) {
    var wrap = document.createElement('div');
    wrap.className = 'bar-wrap';
    var incBar = document.createElement('div');
    incBar.className = 'bar income';
    incBar.style.height = d.inc > 0 ? (d.inc/maxVal*120)+'px' : '2px';
    incBar.style.opacity = d.inc > 0 ? '1' : '0.2';
    var expBar = document.createElement('div');
    expBar.className = 'bar expense';
    expBar.style.height = d.exp > 0 ? (d.exp/maxVal*120)+'px' : '2px';
    expBar.style.opacity = d.exp > 0 ? '1' : '0.2';
    var lbl = document.createElement('div');
    lbl.className = 'bar-label';
    lbl.textContent = d.label;
    var stack = document.createElement('div');
    stack.style.cssText = 'display:flex;gap:2px;flex:1;align-items:flex-end;width:100%';
    stack.appendChild(incBar); stack.appendChild(expBar);
    wrap.appendChild(stack); wrap.appendChild(lbl);
    chart.appendChild(wrap);
  });
}



function renderDailySummary(income, expense, net) {
  var msgEl = document.getElementById('dailyMsgText');
  var card = document.getElementById('dailySummaryCard');
  if(!msgEl) return;
  var titleEl = document.getElementById('dailyMsgTitle');
  if(titleEl) titleEl.innerHTML = svgIcon('barChart', 15) + ' ' + escHtml(t('dailyTitle') || 'Daily Summary');
  var pendingDebts = state.debts.filter(function(d){return d.status!=='paid';});
  var lateDebts = pendingDebts.filter(function(d){return daysAgo(d.date)>3;});
  var totalOwed = pendingDebts.reduce(function(s,d){return s+d.amount;},0);

  // No transactions yet — nothing useful to summarize, so hide the card
  // entirely instead of showing an "add your first transaction" nudge.
  if(income===0 && expense===0) {
    if(card) card.style.display = 'none';
    return;
  }
  if(card) card.style.display = '';

  var incLbl = t('income')||'income';
  var expLbl = t('expense')||'expenses';
  var netLbl = 'Net';
  var msg = '<span class="daily-msg-highlight">+'+fmt(income)+'</span> '+incLbl+', <span style="color:#f87171">-'+fmt(expense)+'</span> '+expLbl+'. '+netLbl+': <span class="'+(net>=0?'daily-msg-highlight':'daily-msg-warn')+'">'+(net>=0?'+':'')+fmt(net)+'</span>';
  var pendLbl = {en:'pending debt', ar:'دين معلق', de:'offene Schuld'};
  var overdueLbl = {en:'overdue', ar:'متأخر', de:'überfällig'};
  var lang = state.lang;
  if(totalOwed > 0) msg += ' · <span class="daily-msg-warn">'+pendingDebts.length+' '+(pendLbl[lang]||pendLbl.en)+' ('+fmt(totalOwed)+')</span>';
  if(lateDebts.length) msg += ' · <span style="color:#f87171">'+svgIcon('warning',12)+' '+lateDebts.length+' '+(overdueLbl[lang]||overdueLbl.en)+'</span>';
  msgEl.innerHTML = msg;
}
