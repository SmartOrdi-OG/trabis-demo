// ── MwSt PAYMENTS TO THE FINANZAMT ──
// A payment of VAT to the Finanzamt is not an operating expense: it settles the
// VAT owed. It is booked against the month it pays FOR (p.period, 'YYYY-MM' —
// owner's decision), lowers only that month's MwSt (Netto stays as it is), shows
// in that month's expenses as its own group, and is kept out of the UVA and the
// profit figures. Each year stands on its own. Stored in state.vatPayments, not in
// state.transactions, so reports/UVA/exports that walk transactions never count it.

var VATPAY_L = {
  grp:      {en:'Finanzamt — VAT payments', ar:'الفينانس — دفعات الضريبة', de:'Finanzamt — MwSt-Zahlungen'},
  row:      {en:'VAT payment', ar:'دفع ضريبة', de:'MwSt-Zahlung'},
  pay:      {en:'Pay', ar:'ادفع', de:'Bezahlen'},
  title:    {en:'VAT payment to the Finanzamt', ar:'دفع ضريبة للفينانس', de:'MwSt-Zahlung ans Finanzamt'},
  editTtl:  {en:'Edit VAT payment', ar:'تعديل دفعة الضريبة', de:'MwSt-Zahlung bearbeiten'},
  amount:   {en:'Amount paid (€)', ar:'المبلغ المدفوع (€)', de:'Bezahlter Betrag (€)'},
  date:     {en:'Payment date', ar:'تاريخ الدفع', de:'Zahlungsdatum'},
  period:   {en:'Paid for (month)', ar:'عن شهر', de:'Bezahlt für (Monat)'},
  paidOn:   {en:'paid on', ar:'اتدفعت يوم', de:'bezahlt am'},
  paid:     {en:'paid', ar:'اتدفعت', de:'bezahlt'},
  openAll:  {en:'Open VAT in total (incl. past months)', ar:'الضريبة المستحقة كلها (مع الشهور اللي فاتت)', de:'Offene MwSt gesamt (inkl. Vormonate)'},
  open:     {en:'Open VAT for this month', ar:'الضريبة المستحقة عن الشهر ده', de:'Offene MwSt für diesen Monat'},
  useOpen:  {en:'Pay all of it', ar:'ادفعها كلها', de:'Ganz bezahlen'},
  hint:     {en:'Counts only against VAT — not as a net expense.', ar:'بيتخصم من الضريبة بس — مش مصروف نيتو.', de:'Wird nur mit der MwSt verrechnet — kein Netto-Aufwand.'},
  save:     {en:'Save', ar:'حفظ', de:'Speichern'},
  del:      {en:'Delete', ar:'حذف', de:'Löschen'},
  delQ:     {en:'Delete this VAT payment?', ar:'تحذف دفعة الضريبة دي؟', de:'Diese MwSt-Zahlung löschen?'},
  badAmt:   {en:'Enter an amount above 0', ar:'اكتب مبلغ أكبر من صفر', de:'Bitte einen Betrag über 0 eingeben'},
  badDate:  {en:'Choose a date', ar:'اختار التاريخ', de:'Bitte ein Datum wählen'},
  saved:    {en:'VAT payment saved', ar:'اتسجلت دفعة الضريبة', de:'MwSt-Zahlung gespeichert'}
};
function vptx(k) { return (VATPAY_L[k] && (VATPAY_L[k][state.lang] || VATPAY_L[k].en)) || k; }

// Payments whose (year, monthIndex) passes the test.
function vatPaymentsWhere(test) {
  return (state.vatPayments || []).filter(function(p) {
    if(!p || !(p.amount > 0)) return false;
    var per = vatPayPeriod(p);
    if(!per) return false;
    return test(parseInt(per.substring(0, 4), 10), parseInt(per.substring(5, 7), 10) - 1);
  });
}

// 'YYYY-MM' the payment is for (older records without one: the month it was paid in).
function vatPayPeriod(p) {
  if(p.period && /^\d{4}-\d{2}$/.test(p.period)) return p.period;
  return p.date && /^\d{4}-\d{2}/.test(p.date) ? p.date.substring(0, 7) : '';
}
function vatPaidFor(y, m) {
  return vatPaymentsWhere(function(py, pm) { return py === y && pm === m; }).length > 0;
}
// VAT still open up to and including the month on screen (same year scope as the saldo).
function vatOpenUpToMonth(y, m) {
  return carryInTotals(y, m).vat + monthTotals(y, m).vat;
}

function vatPayGroupHtml(y, m) {
  var rows = vatPaymentsWhere(function(py, pm) { return py === y && pm === m; })
    .sort(function(a, b) { return a.date < b.date ? -1 : a.date > b.date ? 1 : 0; });
  if(!rows.length) return '';
  var total = rows.reduce(function(s, p) { return s + p.amount; }, 0);
  var h = '<div class="tx-grp tx-grp-vatpay"><div class="tx-grp-hdr"><span class="tx-grp-ttl">' + escHtml(vptx('grp')) + '</span>'
        + '<span class="tx-grp-sum" style="color:var(--expense)">-' + fmt(total) + '</span></div>';
  rows.forEach(function(p) {
    var d = p.date ? p.date.substring(8, 10) + '.' + p.date.substring(5, 7) + '.' + p.date.substring(0, 4) : '';
    h += '<button type="button" class="tx-row tx-row-vatpay" data-vatpay="' + escHtml(p.id) + '">'
       + '<span class="tx-row-nm">' + escHtml(vptx('row')) + '</span>'
       + '<span class="tx-row-dt">' + d + '</span>'
       + '<span class="tx-row-am" style="color:var(--expense)">-' + fmt(p.amount) + '</span>'
       + '<span class="tx-row-sub"><i>' + escHtml(hptx('rowNet')) + ' ' + fmt(0) + '</i><i>' + escHtml(hptx('rowVat')) + ' ' + fmt(p.amount)
       + '</i><i>' + escHtml(hptx('rowTot')) + ' ' + fmt(p.amount) + '</i></span></button>';
  });
  return h + '</div>';
}

// Footer of the month card: VAT still open up to this month (incl. past months)
// and the "Bezahlen" button. Hidden when nothing is open and nothing was paid.
function renderVatPayBtn() {
  var card = document.getElementById('monthCard');
  if(!card) return;
  var foot = document.getElementById('vatPayFoot');
  if(!foot) {
    foot = document.createElement('div');
    foot.id = 'vatPayFoot';
    foot.className = 'vat-pay-foot';
    foot.innerHTML = '<span class="vat-pay-foot-l" id="vatPayFootL"></span><b class="vat-pay-foot-v" id="vatPayFootV"></b>'
                   + '<button type="button" class="vat-pay-btn" id="vatPayBtn"></button>';
    card.appendChild(foot);
    document.getElementById('vatPayBtn').onclick = function(e) { e.stopPropagation(); openVatPayment(); };
  }
  var open = vatOpenUpToMonth(state.year, state.month);
  var paidHere = vatPaidFor(state.year, state.month);
  var show = open > 0.005 || paidHere || Math.abs(carryInTotals(state.year, state.month).vat) > 0.005;
  foot.style.display = show ? '' : 'none';
  document.getElementById('vatPayFootL').textContent = vptx('openAll') + ':';
  var v = document.getElementById('vatPayFootV');
  v.textContent = fmt(Math.abs(open)) + (open < -0.005 ? ' ' + hptx('vatCredit') : '');
  v.style.color = open > 0.005 ? '#c2410c' : (open < -0.005 ? 'var(--income)' : 'var(--text3)');
  var btn = document.getElementById('vatPayBtn');
  btn.textContent = vptx('pay');
  btn.style.display = monthTotals(state.year, state.month).vat > 0.005 ? '' : 'none';
}

function vatPayDefaultDate() {
  var now = new Date();
  return now.getFullYear() + '-' + pad2(now.getMonth() + 1) + '-' + pad2(now.getDate());
}

function ensureVatPayModal() {
  var ov = document.getElementById('vatPayOverlay');
  if(ov) return ov;
  ov = document.createElement('div');
  ov.id = 'vatPayOverlay';
  ov.className = 'modal-overlay';
  ov.innerHTML =
    '<div class="modal vat-pay-modal" role="dialog" aria-modal="true" aria-labelledby="vatPayTitle">' +
      '<button type="button" class="modal-close-btn" onclick="closeVatPayment()" aria-label="Close">&times;</button>' +
      '<div class="vat-pay-ttl" id="vatPayTitle"></div>' +
      '<div class="wt-field"><label class="vat-pay-lbl" for="vatPayPerM" id="vatPayPerL"></label>' +
        '<div class="vat-pay-per"><select class="wt-input" id="vatPayPerM"></select>' +
        '<select class="wt-input" id="vatPayPerY"></select></div></div>' +
      '<div class="vat-pay-open"><span id="vatPayOpenL"></span><b id="vatPayOpenV"></b>' +
        '<button type="button" class="vat-pay-use" id="vatPayUse"></button></div>' +
      '<div class="wt-field"><label class="vat-pay-lbl" for="vatPayAmt" id="vatPayAmtL"></label>' +
        '<input class="wt-input" id="vatPayAmt" type="number" inputmode="decimal" step="0.01" min="0"/></div>' +
      '<div class="wt-field"><label class="vat-pay-lbl" for="vatPayDate" id="vatPayDateL"></label>' +
        '<input class="wt-input" id="vatPayDate" type="date"/></div>' +

      '<div class="vat-pay-hint" id="vatPayHint"></div>' +
      '<div class="vat-pay-err" id="vatPayErr"></div>' +
      '<div class="vat-pay-btns"><button type="button" class="wt-btn" id="vatPaySave"></button>' +
        '<button type="button" class="vat-pay-del" id="vatPayDel"></button></div>' +
    '</div>';
  ov.addEventListener('click', function(e) { if(e.target === ov) closeVatPayment(); });
  document.body.appendChild(ov);
  return ov;
}

// id given = edit that payment; no id = new payment for the month on screen.
function openVatPayment(id) {
  var ov = ensureVatPayModal();
  var p = id ? (state.vatPayments || []).filter(function(x) { return x.id === id; })[0] : null;
  var per = p ? vatPayPeriod(p) : (state.year + '-' + pad2(state.month + 1));
  function $(i) { return document.getElementById(i); }
  // Month / year selects for the period it pays for
  var names = monthNamesLocal(), mh = '', yh = '', py = parseInt(per.substring(0, 4), 10), nowY = new Date().getFullYear();
  for(var i = 0; i < 12; i++) mh += '<option value="' + pad2(i + 1) + '">' + escHtml(names[i]) + '</option>';
  for(var yy = Math.min(py, nowY) - 2; yy <= Math.max(py, nowY) + 1; yy++) yh += '<option value="' + yy + '">' + yy + '</option>';
  $('vatPayPerM').innerHTML = mh; $('vatPayPerY').innerHTML = yh;
  $('vatPayPerM').value = per.substring(5, 7); $('vatPayPerY').value = String(py);
  // VAT still open for the chosen month (when editing, this payment's own amount counts as open)
  function openFor() {
    var y = parseInt($('vatPayPerY').value, 10), m = parseInt($('vatPayPerM').value, 10) - 1;
    var o = monthTotals(y, m).vat;
    if(p && vatPayPeriod(p) === y + '-' + pad2(m + 1)) o += p.amount;
    return o;
  }
  function showOpen() {
    var o = openFor();
    $('vatPayOpenV').textContent = fmt(Math.max(0, o));
    $('vatPayUse').style.display = o > 0.005 ? '' : 'none';
    return o;
  }
  $('vatPayPerM').onchange = $('vatPayPerY').onchange = showOpen;
  $('vatPayTitle').textContent = vptx(p ? 'editTtl' : 'title');
  $('vatPayPerL').textContent = vptx('period');
  $('vatPayOpenL').textContent = vptx('open') + ': ';
  $('vatPayUse').textContent = vptx('useOpen');
  $('vatPayUse').onclick = function() { $('vatPayAmt').value = (Math.round(Math.max(0, openFor()) * 100) / 100).toFixed(2); };
  $('vatPayAmtL').textContent = vptx('amount');
  $('vatPayDateL').textContent = vptx('date');
  $('vatPayHint').textContent = vptx('hint');
  $('vatPayErr').textContent = '';
  var o = showOpen();
  $('vatPayAmt').value = p ? p.amount.toFixed(2) : (o > 0.005 ? (Math.round(o * 100) / 100).toFixed(2) : '');
  $('vatPayDate').value = p ? p.date : vatPayDefaultDate();
  $('vatPaySave').textContent = vptx('save');
  $('vatPaySave').onclick = function() { saveVatPayment(p ? p.id : null); };
  $('vatPayDel').textContent = vptx('del');
  $('vatPayDel').style.display = p ? '' : 'none';
  $('vatPayDel').onclick = function() {
    closeVatPayment();
    showConfirm(vptx('del'), vptx('delQ'), function() {
      state.vatPayments = (state.vatPayments || []).filter(function(x) { return x.id !== p.id; });
      save();
      renderHome();
    });
  };
  ov.classList.add('open');
  if(typeof syncScrollLock === 'function') syncScrollLock();
}

function closeVatPayment() {
  var ov = document.getElementById('vatPayOverlay');
  if(ov) ov.classList.remove('open');
  if(typeof syncScrollLock === 'function') syncScrollLock();
}

function saveVatPayment(id) {
  var amt = Math.round((parseFloat(String(document.getElementById('vatPayAmt').value).replace(',', '.')) || 0) * 100) / 100;
  var date = document.getElementById('vatPayDate').value;
  var period = document.getElementById('vatPayPerY').value + '-' + document.getElementById('vatPayPerM').value;
  var err = document.getElementById('vatPayErr');
  if(!(amt > 0)) { err.textContent = vptx('badAmt'); return; }
  if(!/^\d{4}-\d{2}-\d{2}$/.test(date)) { err.textContent = vptx('badDate'); return; }
  state.vatPayments = state.vatPayments || [];
  if(id) {
    state.vatPayments.forEach(function(x) { if(x.id === id) { x.amount = amt; x.date = date; x.period = period; } });
  } else {
    state.vatPayments.push({id: 'vp' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), date: date, period: period, amount: amt});
  }
  save();
  closeVatPayment();
  renderHome();
  if(typeof showToast === 'function') showToast(vptx('saved'), 'success');
}

document.addEventListener('keydown', function(e) {
  var ov = document.getElementById('vatPayOverlay');
  if(e.key === 'Escape' && ov && ov.classList.contains('open')) closeVatPayment();
});
