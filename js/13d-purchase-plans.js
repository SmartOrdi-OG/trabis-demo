// ── RATENKAUF: buying something on installments ──
// The whole VAT of the purchase invoice is paid (and claimed as Vorsteuer) with the
// FIRST payment, together with the down payment — or, without one, with the first
// instalment. Everything after that is Netto only. Instalments can run monthly on
// their own (like the Fleet instalments) and extra payments can be booked by hand.
//
// Each payment is a normal expense transaction (so the month, the UVA and the
// accountant package see it). The first one carries the whole VAT: its vatRate is
// set to VAT / Netto-of-that-payment, so every place that splits gross by vatRate
// (vatBreakdown, trabis-package.js) gets exactly that Netto and that VAT.
//
// The user types the full price (with or without VAT), the VAT amount itself (the
// rate is worked out from it), the first payment, and how much he pays how often.
//
// state.purchasePlans: [{id, name, netto, vatRate, vat, date, down, months, monthly, interval (months, 0 = manual),
//   payments:[{txId, date, netto, vat, kind:'first'|'rate'|'extra'}], status:'active'|'completed'|'stopped'}]

var PP_L = {
  btn:      {en:'Instalment purchase', ar:'شراء بالتقسيط', de:'Ratenkauf'},
  title:    {en:'New instalment purchase', ar:'شراء جديد بالتقسيط', de:'Neuer Ratenkauf'},
  name:     {en:'What / from whom', ar:'إيه / من مين', de:'Was / bei wem'},
  namePh:   {en:'e.g. MAN truck · Autohaus Huber', ar:'مثلاً شاحنة MAN · Autohaus Huber', de:'z. B. LKW MAN · Autohaus Huber'},
  price:    {en:'Full price (€)', ar:'السعر كامل (€)', de:'Gesamtpreis (€)'},
  gross:    {en:'incl. VAT', ar:'شامل الضريبة', de:'inkl. MwSt'},
  net:      {en:'without VAT', ar:'من غير ضريبة', de:'ohne MwSt'},
  vatAmt:   {en:'VAT amount (€) — paid with the 1st payment', ar:'مبلغ الضريبة (€) — بيتدفع مع أول دفعة', de:'MwSt-Betrag (€) — mit der 1. Zahlung'},
  vatInfo:  {en:'= {r} % VAT · net {n}', ar:'= ضريبة {r} % · نيتو {n}', de:'= {r} % MwSt · netto {n}'},
  rateAmt:  {en:'Instalment (€ net)', ar:'القسط (€ نيتو)', de:'Rate (€ netto)'},
  every:    {en:'How often', ar:'كل قد إيه', de:'Wie oft'},
  iv1:      {en:'every month', ar:'كل شهر', de:'jeden Monat'},
  iv2:      {en:'every 2 months', ar:'كل شهرين', de:'alle 2 Monate'},
  iv3:      {en:'every 3 months', ar:'كل 3 شهور', de:'alle 3 Monate'},
  iv6:      {en:'every 6 months', ar:'كل 6 شهور', de:'alle 6 Monate'},
  iv12:     {en:'once a year', ar:'مرة في السنة', de:'jährlich'},
  iv0:      {en:'I book each payment myself', ar:'هسجل كل دفعة بإيدي', de:'ich buche selbst'},
  prevPlan: {en:'1st payment {d}: {f} (net {n} + VAT {v}) · then {k} × {m} net, {iv} · last on {l}', ar:'أول دفعة {d}: {f} (نيتو {n} + الضريبة {v}) · وبعدها {k} × {m} نيتو، {iv} · آخر قسط {l}', de:'1. Zahlung {d}: {f} (netto {n} + MwSt {v}) · danach {k} × {m} netto, {iv} · letzte am {l}'},
  prevOne:  {en:'One payment {d}: {f} (net {n} + VAT {v})', ar:'دفعة واحدة {d}: {f} (نيتو {n} + الضريبة {v})', de:'Eine Zahlung {d}: {f} (netto {n} + MwSt {v})'},
  prevMan:  {en:'1st payment {d}: {f} (net {n} + VAT {v}) · the rest ({r} net) you book when you pay', ar:'أول دفعة {d}: {f} (نيتو {n} + الضريبة {v}) · والباقي ({r} نيتو) بتسجله وقت ما تدفع', de:'1. Zahlung {d}: {f} (netto {n} + MwSt {v}) · den Rest ({r} netto) buchst du bei Zahlung'},
  badVat:   {en:'The VAT must be 0 or more and below the price', ar:'الضريبة لازم تكون صفر أو أكتر وأقل من السعر', de:'Die MwSt muss ≥ 0 und kleiner als der Preis sein'},
  badRate:  {en:'Enter the down payment or the instalment amount', ar:'اكتب المقدّم أو مبلغ القسط', de:'Anzahlung oder Ratenbetrag angeben'},
  date:     {en:'First payment on', ar:'أول دفعة يوم', de:'Erste Zahlung am'},
  down:     {en:'Down payment net (€, optional)', ar:'المقدّم نيتو (€، اختياري)', de:'Anzahlung netto (€, optional)'},
  hint:     {en:'The whole VAT goes with the first payment; later payments are net only.', ar:'الضريبة كلها بتتدفع مع أول دفعة، والدفعات اللي بعدها نيتو بس.', de:'Die gesamte MwSt fällt mit der ersten Zahlung an; spätere Zahlungen sind nur netto.'},
  save:     {en:'Save', ar:'حفظ', de:'Speichern'},
  grp:      {en:'Instalment purchases', ar:'مشتريات بالتقسيط', de:'Ratenkäufe'},
  paidOf:   {en:'paid {p} of {t} net', ar:'اتدفع {p} من {t} نيتو', de:'bezahlt {p} von {t} netto'},
  open:     {en:'open', ar:'باقي', de:'offen'},
  next:     {en:'next instalment', ar:'القسط الجاي', de:'nächste Rate'},
  done:     {en:'fully paid', ar:'اتدفع كله', de:'vollständig bezahlt'},
  stopped:  {en:'stopped', ar:'متوقف', de:'gestoppt'},
  pay:      {en:'Book payment', ar:'تسجيل دفعة', de:'Zahlung buchen'},
  payTtl:   {en:'Extra payment (net)', ar:'دفعة زيادة (نيتو)', de:'Sonderzahlung (netto)'},
  amount:   {en:'Amount net (€)', ar:'المبلغ نيتو (€)', de:'Betrag netto (€)'},
  payDate:  {en:'Payment date', ar:'تاريخ الدفع', de:'Zahlungsdatum'},
  stop:     {en:'Stop', ar:'إيقاف', de:'Stoppen'},
  stopQ:    {en:'Stop this instalment purchase? Payments already booked stay; no further instalments are booked.', ar:'توقف التقسيط ده؟ الدفعات اللي اتسجلت هتفضل، ومش هيتسجل أقساط تانية.', de:'Diesen Ratenkauf stoppen? Gebuchte Zahlungen bleiben; es werden keine weiteren Raten gebucht.'},
  first:    {en:'1st payment incl. all VAT', ar:'أول دفعة شاملة الضريبة كلها', de:'1. Zahlung inkl. gesamter MwSt'},
  rateN:    {en:'instalment {k}/{n}', ar:'قسط {k}/{n}', de:'Rate {k}/{n}'},
  extra:    {en:'extra payment', ar:'دفعة زيادة', de:'Sonderzahlung'},
  badName:  {en:'Enter what you bought', ar:'اكتب اشتريت إيه', de:'Bitte angeben, was gekauft wurde'},
  badNet:   {en:'Enter the net invoice amount', ar:'اكتب مبلغ الفاتورة نيتو', de:'Bitte den Nettobetrag eingeben'},
  badDown:  {en:'The down payment must be below the invoice amount', ar:'المقدّم لازم يكون أقل من مبلغ الفاتورة', de:'Die Anzahlung muss unter dem Rechnungsbetrag liegen'},
  badAmt:   {en:'Enter an amount above 0 and not above what is open', ar:'اكتب مبلغ أكبر من صفر ومش أكتر من الباقي', de:'Betrag über 0 und nicht über dem offenen Rest'},
  badDate:  {en:'Choose a date', ar:'اختار التاريخ', de:'Bitte ein Datum wählen'},
  saved:    {en:'Instalment purchase saved', ar:'اتسجل الشراء بالتقسيط', de:'Ratenkauf gespeichert'},
  booked:   {en:'Payment booked', ar:'اتسجلت الدفعة', de:'Zahlung gebucht'}
};
function pptx(k) { return (PP_L[k] && (PP_L[k][state.lang] || PP_L[k].en)) || k; }
function ppR2(n) { return Math.round(n * 100) / 100; }
function ppFill(s, o) { Object.keys(o).forEach(function(k) { s = s.split('{' + k + '}').join(o[k]); }); return s; }

function ppPaidNetto(pl) { return ppR2((pl.payments || []).reduce(function(s, p) { return s + p.netto; }, 0)); }
function ppOpenNetto(pl) { return ppR2(pl.netto - ppPaidNetto(pl)); }
function ppRatesBooked(pl) { return (pl.payments || []).filter(function(p) { return p.kind === 'rate'; }).length; }

// Date of scheduled instalment k (1-based): k months after the first payment, same day (clamped to month end).
function ppRateDate(pl, k) {
  var iv = pl.interval > 0 ? pl.interval : 1;
  var p = pl.date.split('-'), y = +p[0], m = +p[1] - 1 + k * iv, d = +p[2];
  var last = new Date(y, m + 1, 0).getDate();
  var dt = new Date(y, m, Math.min(d, last));
  return dt.getFullYear() + '-' + pad2(dt.getMonth() + 1) + '-' + pad2(dt.getDate());
}

function ppBook(pl, kind, date, netto, label) {
  var vat = kind === 'first' ? pl.vat : 0;
  var txId = Date.now() + Math.floor(Math.random() * 1000);
  state.transactions = state.transactions || [];
  state.transactions.push({
    id: txId, type: 'expense', name: pl.name + ' · ' + label,
    amount: ppR2(netto + vat), vatRate: netto > 0 && vat > 0 ? (vat / netto) * 100 : 0,
    category: 'Other', date: date, planId: pl.id
  });
  pl.payments = pl.payments || [];
  pl.payments.push({txId: txId, date: date, netto: ppR2(netto), vat: ppR2(vat), kind: kind});
  if(ppOpenNetto(pl) <= 0.005) pl.status = 'completed';
}

// Books every scheduled instalment that is due by today. Called with the other "due" checks.
function checkPurchasePlansDue() {
  var now = today(), n = 0;
  (state.purchasePlans || []).forEach(function(pl) {
    if(pl.status !== 'active' || !(pl.months > 0)) return;
    var k = ppRatesBooked(pl);
    while(k < pl.months && pl.status === 'active') {
      var d = ppRateDate(pl, k + 1);
      if(d > now) break;
      // the last scheduled instalment takes whatever is still open (rounding cents included)
      var amt = k === pl.months - 1 ? ppOpenNetto(pl) : Math.min(pl.monthly, ppOpenNetto(pl));
      if(amt <= 0.005) { pl.status = 'completed'; break; }
      k++;
      // instalment numbering: with a down payment the instalments count on their own; without one the 1st payment was instalment 1
      var total = pl.down > 0 ? pl.months : pl.months + 1;
      var idx = pl.down > 0 ? k : k + 1;
      ppBook(pl, 'rate', d, amt, ppFill(pptx('rateN'), {k: idx, n: total}));
      n++;
    }
  });
  if(n > 0) save();
  return n;
}

function ppGroupHtml() {
  var y = state.year, m = state.month, pre = y + '-' + pad2(m + 1);
  var plans = (state.purchasePlans || []).filter(function(pl) {
    return pl.status === 'active' || (pl.payments || []).some(function(p) { return p.date.substring(0, 7) === pre; });
  });
  if(!plans.length) return '';
  var h = '<div class="tx-grp pp-grp"><div class="tx-grp-hdr"><span class="tx-grp-ttl">' + escHtml(pptx('grp')) + '</span></div>';
  plans.forEach(function(pl) {
    var open = ppOpenNetto(pl), st = '';
    if(pl.status === 'completed') st = pptx('done');
    else if(pl.status === 'stopped') st = pptx('stopped');
    else if(pl.months > 0 && ppRatesBooked(pl) < pl.months) {
      var nd = ppRateDate(pl, ppRatesBooked(pl) + 1);
      st = pptx('next') + ': ' + nd.substring(8, 10) + '.' + nd.substring(5, 7) + '.' + nd.substring(0, 4) + ' · ' + fmt(Math.min(pl.monthly, open));
    }
    h += '<div class="pp-card"><div class="pp-top"><span class="pp-name">' + escHtml(pl.name) + '</span>'
       + '<span class="pp-open">' + escHtml(pptx('open')) + ' <b>' + fmt(Math.max(0, open)) + '</b></span></div>'
       + '<div class="pp-sub">' + escHtml(ppFill(pptx('paidOf'), {p: fmt(ppPaidNetto(pl)), t: fmt(pl.netto)})) + ' · MwSt ' + fmt(pl.vat) + (st ? ' · ' + escHtml(st) : '') + '</div>'
       + '<div class="pp-bar"><i style="width:' + Math.min(100, Math.round(ppPaidNetto(pl) / pl.netto * 100)) + '%"></i></div>'
       + (pl.status === 'active' ? '<div class="pp-btns"><button type="button" class="pp-pay" data-pp-pay="' + pl.id + '">' + escHtml(pptx('pay')) + '</button>'
          + '<button type="button" class="pp-stop" data-pp-stop="' + pl.id + '">' + escHtml(pptx('stop')) + '</button></div>' : '')
       + '</div>';
  });
  return h + '</div>';
}
function ppWire(host) {
  host.querySelectorAll('[data-pp-pay]').forEach(function(el) { el.onclick = function() { openPlanPayment(+el.getAttribute('data-pp-pay')); }; });
  host.querySelectorAll('[data-pp-stop]').forEach(function(el) {
    el.onclick = function() {
      var pl = ppFind(+el.getAttribute('data-pp-stop'));
      if(!pl) return;
      showConfirm(pptx('stop'), pptx('stopQ'), function() { pl.status = 'stopped'; save(); renderHome(); });
    };
  });
}
function ppFind(id) { return (state.purchasePlans || []).filter(function(p) { return p.id === id; })[0]; }

// ── dialogs ──
function ppModal(id, inner) {
  var ov = document.getElementById(id);
  if(!ov) {
    ov = document.createElement('div');
    ov.id = id;
    ov.className = 'modal-overlay';
    ov.addEventListener('click', function(e) { if(e.target === ov) ppClose(id); });
    document.body.appendChild(ov);
  }
  ov.innerHTML = '<div class="modal vat-pay-modal" role="dialog" aria-modal="true">'
    + '<button type="button" class="modal-close-btn" onclick="ppClose(\'' + id + '\')" aria-label="Close">&times;</button>' + inner + '</div>';
  ov.classList.add('open');
  if(typeof syncScrollLock === 'function') syncScrollLock();
  return ov;
}
function ppClose(id) {
  var ov = document.getElementById(id);
  if(ov) ov.classList.remove('open');
  if(typeof syncScrollLock === 'function') syncScrollLock();
}
function ppField(id, label, input) {
  return '<div class="wt-field"><label class="vat-pay-lbl" for="' + id + '">' + escHtml(label) + '</label>' + input + '</div>';
}
function ppTodayInMonth() {
  var now = new Date();
  if(now.getFullYear() === state.year && now.getMonth() === state.month) return today();
  return state.year + '-' + pad2(state.month + 1) + '-01';
}

function openPurchasePlan() {
  var num = ' type="number" inputmode="decimal" step="0.01" min="0"';
  var ivs = [1, 2, 3, 6, 12, 0].map(function(v) { return '<option value="' + v + '">' + escHtml(pptx('iv' + v)) + '</option>'; }).join('');
  ppModal('ppOverlay',
    '<div class="vat-pay-ttl">' + escHtml(pptx('title')) + '</div>'
    + ppField('ppName', pptx('name'), '<input class="wt-input" id="ppName" type="text" maxlength="80" placeholder="' + escHtml(pptx('namePh')) + '">')
    + ppField('ppPrice', pptx('price'), '<div class="pp-price"><input class="wt-input" id="ppPrice"' + num + '>'
        + '<div class="invd-seg pp-mode"><button type="button" class="on" data-mode="gross">' + escHtml(pptx('gross')) + '</button>'
        + '<button type="button" data-mode="net">' + escHtml(pptx('net')) + '</button></div></div>')
    + ppField('ppVat', pptx('vatAmt'), '<input class="wt-input" id="ppVat"' + num + '><div class="pp-info" id="ppVatInfo"></div>')
    + ppField('ppDate', pptx('date'), '<input class="wt-input" id="ppDate" type="date" value="' + ppTodayInMonth() + '">')
    + ppField('ppDown', pptx('down'), '<input class="wt-input" id="ppDown"' + num + ' placeholder="0">')
    + '<div class="pp-row2">' + ppField('ppRateAmt', pptx('rateAmt'), '<input class="wt-input" id="ppRateAmt"' + num + '>')
    + ppField('ppEvery', pptx('every'), '<select class="wt-input" id="ppEvery">' + ivs + '</select>') + '</div>'
    + '<div class="vat-pay-open pp-preview" id="ppPreview"></div>'
    + '<div class="vat-pay-hint">' + escHtml(pptx('hint')) + '</div>'
    + '<div class="vat-pay-err" id="ppErr"></div>'
    + '<div class="vat-pay-btns"><button type="button" class="wt-btn" onclick="savePurchasePlan()">' + escHtml(pptx('save')) + '</button></div>');
  ppOpenPlan.mode = 'gross';
  document.querySelectorAll('#ppOverlay .pp-mode button').forEach(function(bt) {
    bt.onclick = function() {
      ppOpenPlan.mode = bt.getAttribute('data-mode');
      document.querySelectorAll('#ppOverlay .pp-mode button').forEach(function(x) { x.classList.toggle('on', x === bt); });
      ppPreview();
    };
  });
  ['ppPrice', 'ppVat', 'ppDown', 'ppRateAmt', 'ppEvery', 'ppDate'].forEach(function(i) {
    var el = document.getElementById(i); el.oninput = el.onchange = ppPreview;
  });
  ppPreview();
}
var ppOpenPlan = {mode: 'gross'};
function ppNum(id) { return ppR2(parseFloat(String((document.getElementById(id) || {}).value || '').replace(',', '.')) || 0); }
// Everything the dialog implies: net price, VAT (typed in; rate derived), first payment, instalments.
function ppCalc() {
  var price = ppNum('ppPrice'), vat = ppNum('ppVat'), down = ppNum('ppDown'), rateAmt = ppNum('ppRateAmt');
  var iv = parseInt((document.getElementById('ppEvery') || {}).value, 10) || 0;
  var net = ppR2(ppOpenPlan.mode === 'net' ? price : price - vat);
  var rate = net > 0 ? vat / net * 100 : 0;
  var firstNet = down > 0 ? down : rateAmt;
  var rest = ppR2(net - firstNet);
  var count = iv > 0 && rateAmt > 0 && rest > 0.005 ? Math.ceil(rest / rateAmt - 1e-9) : 0;
  var lastAmt = count > 0 ? ppR2(rest - rateAmt * (count - 1)) : 0;
  return {price: price, net: net, vat: vat, rate: rate, down: down, rateAmt: rateAmt, interval: iv,
          firstNet: firstNet, rest: rest, count: count, lastAmt: lastAmt};
}
function ppDmy(iso) { return iso ? iso.substring(8, 10) + '.' + iso.substring(5, 7) + '.' + iso.substring(0, 4) : ''; }
function ppPreview() {
  var c = ppCalc(), el = document.getElementById('ppPreview'), info = document.getElementById('ppVatInfo');
  var date = (document.getElementById('ppDate') || {}).value || '';
  if(info) info.textContent = c.net > 0 ? ppFill(pptx('vatInfo'), {r: wtDe(c.rate, 1), n: fmt(c.net)}) : '';
  if(!el) return;
  if(!(c.net > 0) || !(c.firstNet > 0) || c.firstNet > c.net + 0.005) { el.style.display = 'none'; return; }
  el.style.display = '';
  var o = {d: ppDmy(date), f: fmt(c.firstNet + c.vat), n: fmt(c.firstNet), v: fmt(c.vat)};
  if(c.rest <= 0.005) { el.textContent = ppFill(pptx('prevOne'), o); return; }
  if(c.interval === 0 || !(c.rateAmt > 0)) { o.r = fmt(c.rest); el.textContent = ppFill(pptx('prevMan'), o); return; }
  o.k = c.count; o.m = fmt(c.rateAmt); o.iv = pptx('iv' + c.interval);
  o.l = ppDmy(ppRateDate({date: date || today(), interval: c.interval}, c.count)) + (Math.abs(c.lastAmt - c.rateAmt) > 0.005 ? ' (' + fmt(c.lastAmt) + ')' : '');
  el.textContent = ppFill(pptx('prevPlan'), o);
}
function savePurchasePlan() {
  var name = (document.getElementById('ppName').value || '').trim(), date = document.getElementById('ppDate').value;
  var c = ppCalc(), err = document.getElementById('ppErr');
  if(!name) { err.textContent = pptx('badName'); return; }
  if(!(c.price > 0) || !(c.net > 0)) { err.textContent = pptx('badNet'); return; }
  if(c.vat < 0 || (ppOpenPlan.mode === 'gross' && c.vat >= c.price)) { err.textContent = pptx('badVat'); return; }
  if(!(c.firstNet > 0)) { err.textContent = pptx('badRate'); return; }
  if(c.firstNet > c.net + 0.005) { err.textContent = pptx('badDown'); return; }
  if(!/^\d{4}-\d{2}-\d{2}$/.test(date)) { err.textContent = pptx('badDate'); return; }
  var manual = c.interval === 0 || !(c.rateAmt > 0);
  var pl = {id: Date.now(), name: name, netto: c.net, vatRate: ppR2(c.rate), vat: c.vat, date: date, down: c.down,
            interval: manual ? 0 : c.interval, months: manual ? 0 : c.count, monthly: c.rateAmt, payments: [], status: 'active'};
  state.purchasePlans = state.purchasePlans || [];
  state.purchasePlans.push(pl);
  ppBook(pl, 'first', date, Math.min(c.firstNet, c.net), pptx('first'));
  checkPurchasePlansDue();
  save();
  ppClose('ppOverlay');
  renderHome();
  if(typeof showToast === 'function') showToast(pptx('saved'), 'success');
}

function openPlanPayment(id) {
  var pl = ppFind(id);
  if(!pl) return;
  var open = ppOpenNetto(pl);
  ppModal('ppPayOverlay',
    '<div class="vat-pay-ttl">' + escHtml(pptx('payTtl')) + '</div>'
    + '<div class="vat-pay-open"><span>' + escHtml(pl.name) + ' · ' + escHtml(pptx('open')) + ':</span><b>' + fmt(open) + '</b></div>'
    + ppField('ppPayAmt', pptx('amount'), '<input class="wt-input" id="ppPayAmt" type="number" inputmode="decimal" step="0.01" min="0" value="' + (pl.monthly > 0 ? Math.min(pl.monthly, open).toFixed(2) : '') + '">')
    + ppField('ppPayDate', pptx('payDate'), '<input class="wt-input" id="ppPayDate" type="date" value="' + ppTodayInMonth() + '">')
    + '<div class="vat-pay-err" id="ppPayErr"></div>'
    + '<div class="vat-pay-btns"><button type="button" class="wt-btn" onclick="savePlanPayment(' + pl.id + ')">' + escHtml(pptx('save')) + '</button></div>');
}
function savePlanPayment(id) {
  var pl = ppFind(id);
  if(!pl) return;
  var amt = ppNum('ppPayAmt'), date = document.getElementById('ppPayDate').value, err = document.getElementById('ppPayErr');
  if(!(amt > 0) || amt > ppOpenNetto(pl) + 0.005) { err.textContent = pptx('badAmt'); return; }
  if(!/^\d{4}-\d{2}-\d{2}$/.test(date)) { err.textContent = pptx('badDate'); return; }
  ppBook(pl, 'extra', date, amt, pptx('extra'));
  save();
  ppClose('ppPayOverlay');
  renderHome();
  if(typeof showToast === 'function') showToast(pptx('booked'), 'success');
}

document.addEventListener('keydown', function(e) {
  if(e.key !== 'Escape') return;
  ['ppOverlay', 'ppPayOverlay'].forEach(function(id) {
    var ov = document.getElementById(id);
    if(ov && ov.classList.contains('open')) ppClose(id);
  });
});
