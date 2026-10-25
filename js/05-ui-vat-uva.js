// ── PLACEHOLDER "COMING SOON" PAGES ──


// ── PERIOD ──
function monthNamesLocal() { return KAL_MONTH_NAMES[state.lang] || KAL_MONTH_NAMES.en; }

// Label for the active filter, e.g. "Juli 2026" — replaces the old t('month') wording.
function periodLabelText() { return monthNamesLocal()[state.month] + ' ' + state.year; }

// Years are derived from the data, never a fixed list: every year that has a
// transaction, plus the current one, plus whatever is selected.


function renderMonthTabs() {
  var strip = document.getElementById('monthStrip');
  if(strip) {
    var h = '';
    for(var m = 0; m < 12; m++) {
      h += '<button type="button" class="mtab' + (m === state.month ? ' active' : '') +
           '" onclick="setMonth(' + m + ')" title="' + escHtml(monthNamesLocal()[m]) + '">' + (m+1) + '</button>';
    }
    strip.innerHTML = h;
  }
  var yc = document.getElementById('yearChip');
  if(yc) yc.textContent = state.year;
}

function setMonth(m) {
  state.month = m;
  state.period = 'month';
  state.customDateFilter = null;
  renderCustomDateActiveBar();
  renderMonthTabs();
  renderHome();
  var rp = document.getElementById('reportsPage');
  if(rp && rp.style.display !== 'none') { renderReports(); renderChart(); }
}



// Jump the home filter to whatever month a date belongs to.
function goToDate(dateStr) {
  var y = parseInt((dateStr||'').substring(0,4),10), m = parseInt((dateStr||'').substring(5,7),10) - 1;
  if(!y || isNaN(m) || m < 0 || m > 11) return false;
  if(y === state.year && m === state.month) return false;
  state.year = y;
  openMonthDetail(m);
  return true;
}

function updatePeriodBarVisibility(page) {
  var periodTabs = document.getElementById('periodTabs');
  if(!periodTabs) return;
  periodTabs.style.display = (page === 'home' && state.homeView === 'month' && !state.customDateFilter) ? 'flex' : 'none';
  var activeBar = document.getElementById('customDateActiveBar');
  if(activeBar) activeBar.style.display = (page === 'home' && state.customDateFilter) ? 'flex' : 'none';
}

// ── CUSTOM DATE FILTER ──










function formatCustomDateLabel(dateStr) {
  var d = new Date(dateStr + 'T12:00:00');
  var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  return months[d.getMonth()] + ' ' + d.getDate() + ', ' + d.getFullYear();
}

function formatCustomDateLabelShort(dateStr) {
  var d = new Date(dateStr + 'T12:00:00');
  var monthsShort = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return {month: monthsShort[d.getMonth()], day: d.getDate(), year: d.getFullYear()};
}

function buildCustomDateFilterSubLabel() {
  var f = state.customDateFilter;
  if(!f) return '';
  if(f.mode === 'single') {
    var a = formatCustomDateLabelShort(f.date);
    return a.month + ' ' + a.day + ', ' + a.year;
  }
  var from = formatCustomDateLabelShort(f.from);
  var to = formatCustomDateLabelShort(f.to);
  if(from.year === to.year) {
    return from.month + ' ' + from.day + ' – ' + to.month + ' ' + to.day + ', ' + to.year;
  }
  return from.month + ' ' + from.day + ', ' + from.year + ' – ' + to.month + ' ' + to.day + ', ' + to.year;
}

function renderCustomDateActiveBar() {
  var labelEl = document.getElementById('customDateActiveLabel');
  if(!labelEl) return;
  if(state.customDateFilter) {
    if(state.customDateFilter.mode === 'single') {
      labelEl.innerHTML = svgIcon('calendar',13) + ' ' + escHtml(formatCustomDateLabel(state.customDateFilter.date));
    } else {
      labelEl.innerHTML = svgIcon('calendar',13) + ' ' + escHtml(formatCustomDateLabel(state.customDateFilter.from) + ' – ' + formatCustomDateLabel(state.customDateFilter.to));
    }
  }
  var mainPageEl = document.getElementById('mainPage');
  var onHome = mainPageEl && mainPageEl.style.display !== 'none';
  if(onHome) updatePeriodBarVisibility('home');
}

// ── MODAL ──




function closeModal() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.getElementById('amountInput').value = '';
  document.getElementById('nameInput').value = '';
  var debtPersonSelC = document.getElementById('modal-debt-person-select');
  if(debtPersonSelC) debtPersonSelC.value = '';
  var debtPersonOtherC = document.getElementById('modal-debt-person-other');
  if(debtPersonOtherC) { debtPersonOtherC.value = ''; debtPersonOtherC.style.display = 'none'; }
  var di = document.getElementById('dateInput');
  if(di) di.value = '';
  var cliSelC = document.getElementById('modal-client');
  if(cliSelC) cliSelC.value = '';
  var incRefInpC = document.getElementById('modal-income-invoice-ref');
  if(incRefInpC) incRefInpC.value = '';
  var supSel = document.getElementById('modal-supplier');
  if(supSel) supSel.value = '';
  var govSelC = document.getElementById('modal-gov');
  if(govSelC) govSelC.value = '';
  var refInp = document.getElementById('modal-invoice-ref');
  if(refInp) refInp.value = '';
  var prodSelC = document.getElementById('modal-product');
  if(prodSelC) prodSelC.value = '';
  var prodQtyC = document.getElementById('modal-product-qty');
  if(prodQtyC) prodQtyC.value = '';
  var prodHintC = document.getElementById('modal-product-stock-hint');
  if(prodHintC) prodHintC.textContent = '';
  receiptClear();
  clearInvoice();
}



// ── HOME LOAD ANIMATION (staggered entrance) ──
function playHomeAnim() {
  var mp = document.getElementById('mainPage');
  if(!mp) return;
  mp.classList.remove('home-anim');
  void mp.offsetWidth; // force reflow so the animation restarts
  mp.classList.add('home-anim');
}

// ── SCROLL LOCK: pin the background page while any modal/overlay is open (iOS-safe) ──
var _scrollLockY = 0, _scrollLocked = false;
function anyOverlayOpen() {
  if(document.querySelector('.modal-overlay.open,.cleardata-overlay.open,.export-overlay.open,.policy-overlay.open,.client-profile-overlay.open,.edit-debt-overlay.open,#sidebarOverlay.open')) return true;
  var tx = document.getElementById('txDetailOverlay');
  if(tx && tx.style.display && tx.style.display !== 'none') return true;
  var mm = document.getElementById('moreMenuOverlay');
  if(mm && mm.style.display && mm.style.display !== 'none') return true;
  return false;
}
function syncScrollLock() {
  var open = anyOverlayOpen();
  if(open && !_scrollLocked) {
    _scrollLockY = window.pageYOffset || document.documentElement.scrollTop || 0;
    document.body.style.position = 'fixed';
    document.body.style.top = (-_scrollLockY) + 'px';
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    _scrollLocked = true;
  } else if(!open && _scrollLocked) {
    document.body.style.position = '';
    document.body.style.top = '';
    document.body.style.left = '';
    document.body.style.right = '';
    document.body.style.width = '';
    _scrollLocked = false;
    window.scrollTo(0, _scrollLockY);
  }
}
new MutationObserver(syncScrollLock).observe(document.body, {subtree:true, childList:true, attributes:true, attributeFilter:['class','style']});
['touchstart','scroll','click'].forEach(function(ev){ window.addEventListener(ev, syncScrollLock, {passive:true, capture:true}); });

// ── SWIPE-DOWN TO CLOSE: bottom-sheet gesture for all modals (mobile) ──
(function(){
  var m = null, startY = 0, curY = 0, dragging = false;
  document.addEventListener('touchstart', function(e) {
    var t = e.target.closest ? e.target.closest('.modal') : null;
    if(!t) return;
    var ov = t.parentElement;
    if(!ov || !ov.classList.contains('modal-overlay') || !ov.classList.contains('open')) return;
    m = t; startY = curY = e.touches[0].clientY; dragging = false;
  }, {passive:true});
  document.addEventListener('touchmove', function(e) {
    if(!m) return;
    curY = e.touches[0].clientY;
    var dy = curY - startY;
    if(dy > 0 && m.scrollTop <= 0) {
      if(!dragging) { dragging = true; startY = curY; dy = 0; }
      m.style.transition = 'none';
      m.style.transform = 'translateY(' + dy + 'px)';
      if(e.cancelable) e.preventDefault();
    } else if(dragging) {
      m.style.transform = 'translateY(0px)';
    }
  }, {passive:false});
  document.addEventListener('touchend', function() {
    if(!m) return;
    var el = m, dy = curY - startY;
    m = null;
    el.style.transition = '';
    el.style.transform = '';
    if(dragging && dy > 90) {
      var ov = el.parentElement;
      if(ov && ov.id === 'modalOverlay') { closeModal(); }
      else {
        var btn = el.querySelector('.modal-close-btn');
        if(btn) { btn.click(); }
        else if(ov) { ov.classList.remove('open'); }
      }
    }
  });
})();



// ── VAT (manual entry — any percentage, not just AT rates) ──



function vatBreakdown(amount, rate) {
  var netto = amount / (1 + rate / 100);
  return {brutto: amount, netto: netto, steuer: amount - netto};
}
function bruttoFromNetto(netto, rate) {
  return netto * (1 + (parseFloat(rate) || 0) / 100);
}



// ── Home dashboard: Expenses/Income drill-down (Netto/VAT per item, for the selected period) ──


// ────────────────────────────────────────
// ── UVA (Umsatzsteuervoranmeldung) + Freigabe ──
// ────────────────────────────────────────
var UVA_TXT = {
  title:      {en:'UVA — VAT Return', ar:'UVA — الإقرار الضريبي', de:'UVA — Umsatzsteuervoranmeldung'},
  sub:        {en:'Preparation for FinanzOnline', ar:'تحضير للتقديم على FinanzOnline', de:'Vorbereitung für FinanzOnline'},
  monthly:    {en:'Monthly', ar:'شهري', de:'Monatlich'},
  quarterly:  {en:'Quarterly', ar:'ربع سنوي', de:'Vierteljährlich'},
  yearly:     {en:'Yearly', ar:'سنوي', de:'Jährlich'},
  kz000:      {en:'KZ 000 — Total net revenue', ar:'KZ 000 — إجمالي الإيرادات (صافي)', de:'KZ 000 — Gesamtbetrag Bemessungsgrundlage'},
  sales20:    {en:'KZ 022 — Sales 20%', ar:'KZ 022 — مبيعات 20%', de:'KZ 022 — Umsätze 20%'},
  sales13:    {en:'KZ 006 — Sales 13%', ar:'KZ 006 — مبيعات 13%', de:'KZ 006 — Umsätze 13%'},
  sales10:    {en:'KZ 029 — Sales 10%', ar:'KZ 029 — مبيعات 10%', de:'KZ 029 — Umsätze 10%'},
  sales0:     {en:'Tax-free sales 0%', ar:'مبيعات معفاة 0%', de:'Steuerfreie Umsätze 0%'},
  salesOther: {en:'Sales at other rates', ar:'مبيعات بنسب أخرى', de:'Umsätze zu sonstigen Sätzen'},
  sumUst:     {en:'Total VAT (Umsatzsteuer)', ar:'إجمالي ضريبة المبيعات', de:'Summe Umsatzsteuer'},
  vorsteuer:  {en:'KZ 060 — Input VAT (Vorsteuer)', ar:'KZ 060 — ضريبة المشتريات (Vorsteuer)', de:'KZ 060 — Vorsteuer'},
  vorsteuerByRate: {en:'Breakdown by rate (for your reference — not an official form field)', ar:'تفصيل حسب النسبة (للتوضيح فقط — مش جزء من الفورم الرسمي)', de:'Aufschlüsselung nach Sätzen (nur informativ — kein offizielles Formularfeld)'},
  zahllast:   {en:'KZ 095 — Amount payable', ar:'KZ 095 — المستحق للدفع (Zahllast)', de:'KZ 095 — Zahllast'},
  gutschrift: {en:'KZ 095 — Credit (Gutschrift)', ar:'KZ 095 — رصيد دائن (Gutschrift)', de:'KZ 095 — Gutschrift'},
  netUst:     {en:'Net / VAT', ar:'الصافي / الضريبة', de:'Netto / USt'},
  offen:      {en:'OPEN', ar:'مفتوحة', de:'OFFEN'},
  freigegeben:{en:'APPROVED', ar:'معتمدة', de:'FREIGEGEBEN'},
  freigabeBtn:{en:'Approve', ar:'اعتماد', de:'Freigabe'},
  revokeBtn:  {en:'Revoke approval', ar:'إلغاء الاعتماد', de:'Freigabe zurückziehen'},
  confirmFg:  {en:'Approve this period? Numbers are final and will be marked as approved for your accountant.', ar:'هل تريد اعتماد هذه الفترة؟ ستُعتبر الأرقام نهائية وستُصنَّف كمعتمدة للمحاسب.', de:'Diesen Zeitraum freigeben? Die Zahlen gelten als final und werden für Ihren Steuerberater als freigegeben markiert.'},
  confirmRev: {en:'Revoke the approval for this period?', ar:'هل تريد إلغاء اعتماد هذه الفترة؟', de:'Freigabe für diesen Zeitraum zurückziehen?'},
  lockWarn:   {en:'This period is already approved. Changing it will revoke the approval. Continue?', ar:'هذه الفترة معتمدة بالفعل. التعديل سيؤدي إلى إلغاء الاعتماد. هل تريد المتابعة؟', de:'Dieser Zeitraum ist bereits freigegeben. Eine Änderung zieht die Freigabe zurück. Fortfahren?'},
  fgAt:       {en:'Approved on', ar:'اعتمدت في', de:'Freigegeben am'},
  disclaimer: {en:'Preparation for the UVA — not tax advice. Official filing is done via FinanzOnline. PDF/Excel exports are in German for your accountant.',
               ar:'تحضير لتقرير UVA — ليس استشارة ضريبية. التقديم الرسمي يتم عبر FinanzOnline. ملفات PDF/Excel بتطلع بالألماني للمحاسب.',
               de:'Vorbereitung für die UVA — keine steuerliche Beratung. Die offizielle Einreichung erfolgt über FinanzOnline.'}
};
var VATBASIS_L = {
  label: {en:'Basis',            ar:'أساس الاحتساب',        de:'Versteuerung'},
  ist:   {en:'When paid (cash)', ar:'وقت التحصيل',          de:'Ist-Besteuerung'},
  soll:  {en:'When invoiced',    ar:'وقت الكتابة',          de:'Soll-Besteuerung'},
  istHint:  {en:'A sales invoice counts as income on the day it is paid.',
             ar:'الفاتورة الصادرة بتتحسب دخل يوم ما تتحصّل.',
             de:'Eine Ausgangsrechnung zählt am Zahlungstag als Einnahme.'},
  sollHint: {en:'A sales invoice counts as income on its issue date, paid or not.',
             ar:'الفاتورة الصادرة بتتحسب دخل بتاريخ إصدارها، اتحصّلت أو لأ.',
             de:'Eine Ausgangsrechnung zählt am Rechnungsdatum als Einnahme, bezahlt oder nicht.'},
  switched: {en:'Applies to invoices created from now on.',
             ar:'بينطبق على الفواتير اللي بتتعمل من هلق وجاي.',
             de:'Gilt für künftig erstellte Rechnungen.'},
};


// Which event puts a sales invoice on the books. Austrian businesses run one or
// the other, never both — the choice has to be exclusive or invoices get counted
// twice (once when written, once when paid).




function uvat(k) { var lang = state.lang; return (UVA_TXT[k] && (UVA_TXT[k][lang] || UVA_TXT[k].en)) || k; }

function uvaKeyForDate(dateStr, interval) {
  var y = dateStr.substring(0,4), m = parseInt(dateStr.substring(5,7), 10);
  if(interval === 'month') return y + '-' + ('0'+m).slice(-2);
  if(interval === 'quarter') return y + '-Q' + Math.ceil(m/3);
  return y;
}

function uvaKeyLabel(key) {
  if(/^\d{4}-Q\d$/.test(key)) return 'Q' + key.substring(6) + ' ' + key.substring(0,4);
  if(/^\d{4}-\d{2}$/.test(key)) {
    var mon = ['Jan','Feb','Mär','Apr','Mai','Jun','Jul','Aug','Sep','Okt','Nov','Dez'];
    return mon[parseInt(key.substring(5,7),10)-1] + ' ' + key.substring(0,4);
  }
  return key;
}









// A date is locked if it falls inside ANY approved period (month, quarter or year)
function uvaDateLocked(dateStr) {
  if(!state.uvaFreigaben || !dateStr) return false;
  return ['month','quarter','year'].some(function(iv) {
    return !!state.uvaFreigaben[uvaKeyForDate(dateStr, iv)];
  });
}

// Confirm with the user, then revoke every Freigabe covering this date. Returns false = abort.
async function uvaConfirmUnlock(dateStr) {
  if(!uvaDateLocked(dateStr)) return true;
  var unlockTitle = {en:'Unlock Period', ar:'فك القفل', de:'Zeitraum entsperren'};
  if(!(await confirmAsync(unlockTitle[state.lang]||unlockTitle.en, uvat('lockWarn')))) return false;
  ['month','quarter','year'].forEach(function(iv) {
    var k = uvaKeyForDate(dateStr, iv);
    if(state.uvaFreigaben[k]) delete state.uvaFreigaben[k];
  });
  save();
  return true;
}











// Exports are always in German — they are addressed to the Austrian accountant.




// Returns the months covered by a UVA period key ('YYYY-MM'/'YYYY-Qn'/'YYYY'),
// each with its own transactions — used to build one Excel sheet per month.


// Accountant export in the classic Austrian Einnahmen-Ausgaben-Rechnung (EAR)
// format: an Übersicht sheet plus one sheet per month covered by the selected
// UVA period, each with a Netto/MwSt/Brutto summary and a dynamic transaction
// table — followed by Fixkosten and Anlagevermögen sheets for extra context.
