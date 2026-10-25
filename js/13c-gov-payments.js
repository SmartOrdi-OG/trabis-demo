// ── PAYMENTS TO GOVERNMENT ENTITIES (no invoice) ──
// SVS, ÖGK, Magistrat … send no invoice, so these are booked by hand: pick the
// entity from the fixed list, type the amount, done. It becomes a normal expense
// (category Government, 0 % VAT, linked by govId) and shows on the entity's card.
// Picking "Finanzamt — MwSt" opens the VAT payment instead (that one is not an expense).

var GOVPAY_L = {
  btn:     {en:'Pay a government entity', ar:'دفع لجهة حكومية', de:'Behörde bezahlen'},
  cardBtn: {en:'Record payment', ar:'تسجيل دفعة', de:'Zahlung erfassen'},
  title:   {en:'Payment to a government entity', ar:'دفعة لجهة حكومية', de:'Zahlung an eine Behörde'},
  entity:  {en:'Entity', ar:'الجهة', de:'Behörde'},
  vatOpt:  {en:'Finanzamt — VAT payment', ar:'الفينانس — دفع ضريبة القيمة المضافة', de:'Finanzamt — MwSt-Zahlung'},
  amount:  {en:'Amount (€)', ar:'المبلغ (€)', de:'Betrag (€)'},
  date:    {en:'Payment date', ar:'تاريخ الدفع', de:'Zahlungsdatum'},
  note:    {en:'Note (optional)', ar:'ملاحظة (اختياري)', de:'Notiz (optional)'},
  notePh:  {en:'e.g. contribution Q4', ar:'مثلاً اشتراك الربع الرابع', de:'z. B. Beitrag Q4'},
  hint:    {en:'No invoice needed — booked straight to expenses, without VAT.', ar:'من غير فاتورة — بتتسجل في المصروفات على طول ومن غير ضريبة.', de:'Ohne Beleg — wird direkt als Ausgabe ohne MwSt gebucht.'},
  save:    {en:'Save', ar:'حفظ', de:'Speichern'},
  badAmt:  {en:'Enter an amount above 0', ar:'اكتب مبلغ أكبر من صفر', de:'Bitte einen Betrag über 0 eingeben'},
  badDate: {en:'Choose a date', ar:'اختار التاريخ', de:'Bitte ein Datum wählen'},
  badEnt:  {en:'Choose an entity', ar:'اختار الجهة', de:'Bitte eine Behörde wählen'},
  saved:   {en:'Payment saved', ar:'اتسجلت الدفعة', de:'Zahlung gespeichert'}
};
function gptx(k) { return (GOVPAY_L[k] && (GOVPAY_L[k][state.lang] || GOVPAY_L[k].en)) || k; }

// The entities to choose from: the ones already set up, then the fixed list (created on first use).
function govPayChoices() {
  var have = govEntities(), names = have.map(function(c) { return (c.name || '').toLowerCase(); });
  var list = have.map(function(c) { return {key: 'id:' + c.id, name: c.name}; });
  GOV_QUICK.forEach(function(q) { if(names.indexOf(q.toLowerCase()) < 0) list.push({key: 'new:' + q, name: q}); });
  return list;
}

function govPayDefaultDate() {
  var now = new Date();
  if(state.homeView !== 'picker' && document.getElementById('monthDetail') &&
     document.getElementById('monthDetail').style.display !== 'none' &&
     (now.getFullYear() !== state.year || now.getMonth() !== state.month)) {
    return state.year + '-' + pad2(state.month + 1) + '-01';   // booking into the month on screen
  }
  return now.getFullYear() + '-' + pad2(now.getMonth() + 1) + '-' + pad2(now.getDate());
}

function ensureGovPayModal() {
  var ov = document.getElementById('govPayOverlay');
  if(ov) return ov;
  ov = document.createElement('div');
  ov.id = 'govPayOverlay';
  ov.className = 'modal-overlay';
  ov.innerHTML =
    '<div class="modal vat-pay-modal" role="dialog" aria-modal="true" aria-labelledby="govPayTitle">' +
      '<button type="button" class="modal-close-btn" onclick="closeGovPayment()" aria-label="Close">&times;</button>' +
      '<div class="vat-pay-ttl" id="govPayTitle"></div>' +
      '<div class="wt-field"><label class="vat-pay-lbl" for="govPayEnt" id="govPayEntL"></label>' +
        '<select class="wt-input" id="govPayEnt"></select></div>' +
      '<div class="wt-field"><label class="vat-pay-lbl" for="govPayAmt" id="govPayAmtL"></label>' +
        '<input class="wt-input" id="govPayAmt" type="number" inputmode="decimal" step="0.01" min="0"/></div>' +
      '<div class="wt-field"><label class="vat-pay-lbl" for="govPayDate" id="govPayDateL"></label>' +
        '<input class="wt-input" id="govPayDate" type="date"/></div>' +
      '<div class="wt-field"><label class="vat-pay-lbl" for="govPayNote" id="govPayNoteL"></label>' +
        '<input class="wt-input" id="govPayNote" type="text" maxlength="60"/></div>' +
      '<div class="vat-pay-hint" id="govPayHint"></div>' +
      '<div class="vat-pay-err" id="govPayErr"></div>' +
      '<div class="vat-pay-btns"><button type="button" class="wt-btn" id="govPaySave"></button></div>' +
    '</div>';
  ov.addEventListener('click', function(e) { if(e.target === ov) closeGovPayment(); });
  document.body.appendChild(ov);
  return ov;
}

// govId given = that entity is preselected (from its card on the Behörden page).
function openGovPayment(govId) {
  var ov = ensureGovPayModal();
  function $(i) { return document.getElementById(i); }
  var choices = govPayChoices();
  var opts = '<option value="">—</option>' + choices.map(function(c) {
    return '<option value="' + escHtml(c.key) + '">' + escHtml(c.name) + '</option>';
  }).join('') + '<option value="vat">' + escHtml(gptx('vatOpt')) + '</option>';
  $('govPayEnt').innerHTML = opts;
  $('govPayEnt').value = govId != null ? 'id:' + govId : '';
  $('govPayEnt').onchange = function() {
    if(this.value === 'vat') { closeGovPayment(); openVatPayment(); }
  };
  $('govPayTitle').textContent = gptx('title');
  $('govPayEntL').textContent = gptx('entity');
  $('govPayAmtL').textContent = gptx('amount');
  $('govPayDateL').textContent = gptx('date');
  $('govPayNoteL').textContent = gptx('note');
  $('govPayNote').placeholder = gptx('notePh');
  $('govPayHint').textContent = gptx('hint');
  $('govPayErr').textContent = '';
  $('govPayAmt').value = '';
  $('govPayNote').value = '';
  $('govPayDate').value = govPayDefaultDate();
  $('govPaySave').textContent = gptx('save');
  $('govPaySave').onclick = saveGovPayment;
  ov.classList.add('open');
  if(typeof syncScrollLock === 'function') syncScrollLock();
}

function closeGovPayment() {
  var ov = document.getElementById('govPayOverlay');
  if(ov) ov.classList.remove('open');
  if(typeof syncScrollLock === 'function') syncScrollLock();
}

function saveGovPayment() {
  var key = document.getElementById('govPayEnt').value;
  var amt = Math.round((parseFloat(String(document.getElementById('govPayAmt').value).replace(',', '.')) || 0) * 100) / 100;
  var date = document.getElementById('govPayDate').value;
  var note = (document.getElementById('govPayNote').value || '').trim();
  var err = document.getElementById('govPayErr');
  if(!key || key === 'vat') { err.textContent = gptx('badEnt'); return; }
  if(!(amt > 0)) { err.textContent = gptx('badAmt'); return; }
  if(!/^\d{4}-\d{2}-\d{2}$/.test(date)) { err.textContent = gptx('badDate'); return; }
  var ent;
  if(key.indexOf('new:') === 0) {               // first payment to a fixed-list entity: set it up
    state.contacts = state.contacts || [];
    ent = {id: Date.now(), name: key.substring(4), phone: '', email: '', type: 'government', notes: '', createdAt: Date.now()};
    state.contacts.push(ent);
  } else {
    var id = +key.substring(3);
    ent = govEntities().filter(function(c) { return c.id === id; })[0];
  }
  if(!ent) { err.textContent = gptx('badEnt'); return; }
  state.transactions = state.transactions || [];
  state.transactions.push({
    id: Date.now() + 1, type: 'expense', name: ent.name + (note ? ' · ' + note : ''),
    amount: amt, category: 'Government', date: date, vatRate: 0, govId: ent.id
  });
  save();
  closeGovPayment();
  var gp = document.getElementById('govPage');
  if(gp && gp.style.display !== 'none' && gp.offsetParent !== null) renderGovPage(); else renderHome();
  if(typeof showToast === 'function') showToast(gptx('saved'), 'success');
}

document.addEventListener('keydown', function(e) {
  var ov = document.getElementById('govPayOverlay');
  if(e.key === 'Escape' && ov && ov.classList.contains('open')) closeGovPayment();
});
