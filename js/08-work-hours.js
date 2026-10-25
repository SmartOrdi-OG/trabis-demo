// ────────────────────────────────────────
// ── WORK HOURS (Arbeitszeiterfassung) ──
// ────────────────────────────────────────
// Hours between two HH:MM times minus a break, handling overnight shifts (end <= start)
function whTimeDiffHours(start, end, breakMinutes) {
  if(!start || !end) return null;
  var sp = start.split(':'), ep = end.split(':');
  var startMin = parseInt(sp[0], 10) * 60 + parseInt(sp[1], 10);
  var endMin = parseInt(ep[0], 10) * 60 + parseInt(ep[1], 10);
  if(endMin <= startMin) endMin += 24 * 60;
  var mins = endMin - startMin - (parseFloat(breakMinutes) || 0);
  return Math.max(0, mins / 60);
}

function whComputeHours(entry) {
  if(entry.hours != null && entry.hours !== '') return parseFloat(entry.hours) || 0;
  var fromTimes = whTimeDiffHours(entry.start, entry.end, entry.breakMinutes);
  return fromTimes != null ? fromTimes : 0;
}



function whDaysInMonth(monthKey) {
  var parts = monthKey.split('-');
  var year = parseInt(parts[0],10), month = parseInt(parts[1],10);
  var lastDay = new Date(year, month, 0).getDate();
  var days = [];
  for(var d = 1; d <= lastDay; d++) days.push(monthKey + '-' + pad2(d));
  return days;
}

// Austrian German month names (Jänner, not Januar) — used only for this
// official-style monthly timesheet, matching the printed form it replicates.
var AT_MONTH_NAMES = ['Jänner','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];
function whAtMonthLabel(monthKey) {
  var parts = monthKey.split('-');
  return AT_MONTH_NAMES[parseInt(parts[1],10)-1] + ' ' + parts[0];
}
function whFmtDayDate(day) {
  var p = day.split('-');
  return p[2] + '.' + p[1] + '.' + p[0];
}

// A day-entry "belongs" to a grid row only if it is a single day (not a
// legacy multi-day range from before this grid existed).
function whDayEntry(emp, day) {
  return (emp.workHours || []).find(function(w) {
    var wd = whEntryDate(w);
    return wd === day && (!w.toDate || w.toDate === wd);
  });
}

function whDayLeavePeriod(emp, day) {
  return (emp.leavePeriods || []).find(function(lp) { return day >= lp.from && day <= lp.to; }) || null;
}
function whLeaveTypeLabel(type) { return type === 'karenz' ? 'Karenz' : (type === 'urlaub' ? 'Urlaub' : (type === 'feiertag' ? 'Feiertag' : 'Krankenstand')); }

// ── TIMESHEET & VACATION (replaces the old month grid) ──────────────────────────
// Works on the same data as before: emp.workHours (one entry per worked day) and
// emp.leavePeriods (Krankenstand/Karenz, now also Urlaub and Feiertag). A day is
// either worked (an entry) or covered by a leave period, never both.
var WT_L = {
  title:     {en:'Timesheet & Vacation', ar:'ساعات العمل والإجازات', de:'Stundenzettel & Urlaub'},
  sub:       {en:'Record working hours and leave. Vacation is calculated from the hire date.', ar:'سجّل ساعات العمل والإجازات. رصيد الإجازة بيتحسب من تاريخ التعيين.', de:'Arbeitszeiten und Abwesenheiten erfassen. Der Urlaub wird ab Eintrittsdatum berechnet.'},
  employee:  {en:'Employee', ar:'الموظف', de:'Mitarbeiter'},
  period:    {en:'Period', ar:'الفترة', de:'Zeitraum'},
  manage:    {en:'Manage staff', ar:'إدارة الموظفين', de:'Personal verwalten'},
  quick:     {en:'Quick entry', ar:'إدخال سريع', de:'Schnell-Eintrag'},
  monFri:    {en:'Mon – Fri', ar:'الاثنين – الجمعة', de:'Mo – Fr'},
  from:      {en:'From', ar:'من', de:'Von'},
  to:        {en:'To', ar:'إلى', de:'Bis'},
  brk:       {en:'Break (min)', ar:'استراحة (د)', de:'Pause (Min)'},
  apply:     {en:'Apply', ar:'تطبيق', de:'Anwenden'},
  quickNote: {en:'Fills every Monday–Friday that is not vacation, sick leave or a public holiday.', ar:'يملأ كل أيام الاثنين–الجمعة اللي مش إجازة ولا مرض ولا عطلة رسمية.', de:'Füllt jeden Montag–Freitag, der kein Urlaub, Krankenstand oder Feiertag ist.'},
  overwrite: {en:'This replaces the times already entered on some days. Continue?', ar:'ده هيستبدل الأوقات المدخلة في بعض الأيام. تكمل؟', de:'Dadurch werden bereits eingetragene Zeiten überschrieben. Fortfahren?'},
  applied:   {en:'Applied to {n} working days', ar:'اتطبّق على {n} يوم عمل', de:'Auf {n} Arbeitstage angewendet'},
  date:      {en:'Date', ar:'التاريخ', de:'Datum'},
  day:       {en:'Day', ar:'اليوم', de:'Tag'},
  status:    {en:'Status', ar:'الحالة', de:'Status'},
  urlaub:    {en:'Vacation', ar:'إجازة', de:'Urlaub'},
  krankenstand:{en:'Sick', ar:'مرض', de:'Krank'},
  karenz:    {en:'Karenz', ar:'Karenz', de:'Karenz'},
  feiertag:  {en:'Holiday', ar:'عطلة رسمية', de:'Feiertag'},
  vacTitle:  {en:'Vacation entitlement', ar:'رصيد الإجازات', de:'Urlaubsanspruch'},
  hire:      {en:'Hire date', ar:'تاريخ التعيين', de:'Eintrittsdatum'},
  months:    {en:'Counted months', ar:'الشهور المحسوبة', de:'Gerechnete Monate'},
  factor:    {en:'Factor / month', ar:'الفاكتور / شهر', de:'Faktor / Monat'},
  entitle:   {en:'Entitlement', ar:'الاستحقاق', de:'Anspruch'},
  used:      {en:'Vacation days used', ar:'أيام الإجازة المستهلكة', de:'Verbrauchte Urlaubstage'},
  remaining: {en:'Remaining', ar:'المتبقي', de:'Restanspruch'},
  dayUnit:   {en:'days', ar:'يوم', de:'Tage'},
  noHire:    {en:'No start date on this employee — add it in the employee profile to calculate vacation.', ar:'مفيش تاريخ بدء للموظف — أضفه من بروفايل الموظف عشان يتحسب رصيد الإجازة.', de:'Kein Eintrittsdatum — im Mitarbeiterprofil ergänzen, um den Urlaub zu berechnen.'},
  beforeHire:{en:'This month is before the hire date — nothing accrued yet.', ar:'الشهر ده قبل تاريخ التعيين — لسه مفيش رصيد.', de:'Dieser Monat liegt vor dem Eintritt — noch nichts angesammelt.'},
  totalTitle:{en:'Month total', ar:'مجموع الشهر', de:'Monatssumme'},
  net:       {en:'Net working hours', ar:'صافي ساعات العمل', de:'Netto-Arbeitsstunden'},
  workDays:  {en:'Working days', ar:'أيام العمل', de:'Arbeitstage'},
  absences:  {en:'Vacation / Sick / Holidays', ar:'إجازة / مرض / عطلات', de:'Urlaub / Krank / Feiertage'},
  export:    {en:'Export', ar:'تصدير', de:'Export'},
  exportTxt: {en:'A neat A4 sheet with every day of the month — hours, vacation, sick leave and holidays — plus the vacation balance.', ar:'شيت A4 منظم فيه كل أيام الشهر — الساعات والإجازات والمرض والعطلات — مع رصيد الإجازة.', de:'Ein übersichtliches A4-Blatt mit jedem Tag des Monats — Stunden, Urlaub, Krankenstand und Feiertage — samt Urlaubssaldo.'},
  exportBtn: {en:'Export PDF', ar:'تصدير PDF', de:'PDF exportieren'},
  addLeave:  {en:'+ Leave period with certificate', ar:'+ فترة إجازة/مرض مع شهادة', de:'+ Abwesenheit mit Nachweis'},
  rangeLocked:{en:'Period', ar:'فترة', de:'Zeitraum'},
  done:      {en:'Done', ar:'تم', de:'Fertig'},
  pdfFail:   {en:'PDF library not available', ar:'مكتبة PDF غير متاحة', de:'PDF-Bibliothek nicht verfügbar'},
  position:  {en:'Position', ar:'الوظيفة', de:'Position'}
};
function wttx(k) { return (WT_L[k] && WT_L[k][state.lang]) || (WT_L[k] && WT_L[k].en) || k; }
var WT_WD = {
  en: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],
  de: ['So','Mo','Di','Mi','Do','Fr','Sa'],
  ar: ['أحد','اثنين','ثلاثاء','أربعاء','خميس','جمعة','سبت']
};
function wtWd(dow) { return (WT_WD[state.lang] || WT_WD.en)[dow]; }
var WT = {empId: null};
var WT_ICONS = {
  cal: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>',
  clock: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',
  bolt: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2 3 14h9l-1 8 10-12h-9l1-8z"/></svg>',
  doc: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M16 13H8M16 17H8M10 9H8"/></svg>',
  dl: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="M7 10l5 5 5-5"/><path d="M12 15V3"/></svg>'
};

function wtEaster(y) {
  var a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4;
  var f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3);
  var h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4;
  var l = (32 + 2 * e + 2 * i - h - k) % 7, mm = Math.floor((a + 11 * h + 22 * l) / 451);
  var month = Math.floor((h + l - 7 * mm + 114) / 31), day = ((h + l - 7 * mm + 114) % 31) + 1;
  return new Date(y, month - 1, day);
}
var WT_FIXED_HOL = {'0-1':'Neujahr','0-6':'Heilige Drei Könige','4-1':'Staatsfeiertag','7-15':'Mariä Himmelfahrt','9-26':'Nationalfeiertag','10-1':'Allerheiligen','11-8':'Mariä Empfängnis','11-25':'Christtag','11-26':'Stefanitag'};
function wtHolidayName(day) {
  var p = day.split('-'), y = +p[0], m = +p[1] - 1, d = +p[2];
  if(WT_FIXED_HOL[m + '-' + d]) return WT_FIXED_HOL[m + '-' + d];
  var easter = wtEaster(y), t = new Date(y, m, d).getTime();
  var moving = [[1,'Ostermontag'],[39,'Christi Himmelfahrt'],[50,'Pfingstmontag'],[60,'Fronleichnam']];
  for(var i = 0; i < moving.length; i++) {
    if(new Date(easter.getFullYear(), easter.getMonth(), easter.getDate() + moving[i][0]).getTime() === t) return moving[i][1];
  }
  return '';
}
function wtDow(day) { var p = day.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]).getDay(); }
function wtEmp() { return (state.employees || []).find(function(e) { return e.id === WT.empId; }); }
function wtEmpName(e) { return e.fullName || e.name || ''; }
function wtSaveSoon() { clearTimeout(wtSaveSoon._t); wtSaveSoon._t = setTimeout(save, 250); }

// Everything known about one day.
function wtDayInfo(emp, day) {
  var leave = whDayLeavePeriod(emp, day);
  var entry = leave ? null : whDayEntry(emp, day);
  var hol = wtHolidayName(day);
  var st = leave ? leave.type : (entry ? '' : (hol ? 'feiertag' : ''));
  return {leave: leave, entry: entry, hol: hol, st: st, locked: !!(leave && leave.from !== leave.to), auto: !leave && !entry && !!hol};
}
function wtMonthStats(emp, monthKey) {
  var s = {hours: 0, workDays: 0, urlaub: 0, krank: 0, karenz: 0, feiertag: 0};
  whDaysInMonth(monthKey).forEach(function(day) {
    var i = wtDayInfo(emp, day);
    if(i.st === 'urlaub') s.urlaub++;
    else if(i.st === 'krankenstand') s.krank++;
    else if(i.st === 'karenz') s.karenz++;
    else if(i.st === 'feiertag') s.feiertag++;
    else if(i.entry) { var h = whComputeHours(i.entry); if(h > 0) { s.hours += h; s.workDays++; } }
  });
  return s;
}
// Vacation accrues per month from the start date; days taken are counted Mon–Fri
// (ranges may span weekends and holidays).
function wtVacation(emp, monthKey) {
  var res = {hasHire: !!emp.startDate, months: 0, used: 0, factor: parseFloat(emp.vacationFactor) || 2.08};
  if(!emp.startDate) { res.entitled = 0; res.rest = 0; return res; }
  var hm = emp.startDate.substring(0, 7);
  var hy = +hm.substring(0, 4), hmo = +hm.substring(5, 7), y = +monthKey.substring(0, 4), m = +monthKey.substring(5, 7);
  res.months = Math.max(0, (y - hy) * 12 + (m - hmo) + 1);
  var lastDay = monthKey + '-' + pad2(new Date(y, m, 0).getDate());
  (emp.leavePeriods || []).forEach(function(lp) {
    if(lp.type !== 'urlaub') return;
    var a = new Date(lp.from + 'T00:00:00'), b = new Date(lp.to + 'T00:00:00');
    for(var d = new Date(a); d <= b; d.setDate(d.getDate() + 1)) {
      var iso = d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(d.getDate());
      if(iso < emp.startDate || iso > lastDay) continue;
      var dw = d.getDay();
      if(dw === 0 || dw === 6) continue;
      if(lp.from !== lp.to && wtHolidayName(iso)) continue;
      res.used++;
    }
  });
  res.entitled = res.months * res.factor;
  res.rest = res.entitled - res.used;
  return res;
}
function wtDe(n, dec) { return (Math.round(n * Math.pow(10, dec)) / Math.pow(10, dec)).toFixed(dec).replace('.', ','); }

function wtCardHd(icon, color, title, sub) {
  return '<div class="wt-card-hd"><div class="wt-ico ' + color + '">' + WT_ICONS[icon] + '</div><div><span class="wt-card-title">' + title + '</span>' + (sub ? '<span class="wt-card-sub">' + sub + '</span>' : '') + '</div></div>';
}
function wtRowHtml(emp, day) {
  var i = wtDayInfo(emp, day), dow = wtDow(day);
  var cls = 'wt-row' + ((dow === 0 || dow === 6) ? ' wk' : '') + (i.st ? ' st-' + i.st : '');
  var dd = pad2(+day.substring(8)) + '.' + day.substring(5, 7) + '.';
  var h = '<div class="' + cls + '" id="wtRow_' + day + '"><div class="wt-row-top"><div class="wt-date">' + dd + '</div><div class="wt-wd">' + wtWd(dow) + '</div>';
  if(i.locked) {
    h += '<div class="wt-locked"><span>' + wttx(i.leave.type) + ': ' + whFmtDayDate(i.leave.from).substring(0, 5) + ' – ' + whFmtDayDate(i.leave.to).substring(0, 5) + '</span><span class="wt-lk-act">'
      + (i.leave.docId ? '<span class="wh-leave-view" data-id="' + i.leave.id + '">' + svgIcon('fileText', 15) + '</span>' : '')
      + '<span class="wh-leave-del" data-id="' + i.leave.id + '">' + svgIcon('trash', 15) + '</span></span></div></div>';
  } else {
    var opts = [['', '—'], ['urlaub', wttx('urlaub')], ['krankenstand', wttx('krankenstand')], ['feiertag', wttx('feiertag')]];
    if(i.st === 'karenz') opts.push(['karenz', wttx('karenz')]);
    h += '<select class="wt-input" onchange="wtSetStatus(\'' + day + '\',this.value)">' + opts.map(function(o) {
      return '<option value="' + o[0] + '"' + (o[0] === i.st ? ' selected' : '') + '>' + o[1] + '</option>';
    }).join('') + '</select></div>';
    if(i.st === '' || i.auto) {
      var e = i.entry, hrs = e ? whComputeHours(e) : 0;
      h += '<div class="wt-times">'
        + '<input class="wt-input" type="time" value="' + (e && e.start || '') + '" aria-label="' + wttx('from') + '" onchange="wtSetField(\'' + day + '\',\'start\',this.value)">'
        + '<input class="wt-input" type="time" value="' + (e && e.end || '') + '" aria-label="' + wttx('to') + '" onchange="wtSetField(\'' + day + '\',\'end\',this.value)">'
        + '<input class="wt-input" type="number" min="0" step="5" placeholder="30" value="' + (e && e.breakMinutes != null ? e.breakMinutes : '') + '" aria-label="' + wttx('brk') + '" oninput="wtSetField(\'' + day + '\',\'breakMinutes\',this.value)">'
        + '<div class="wt-hrs" id="wtHrs_' + day + '">' + (hrs > 0 ? wtDe(hrs, 2) + ' h' : '–') + '</div></div>';
    }
  }
  if(i.hol) h += '<div class="wt-hol">&#127881; ' + escHtml(i.hol) + '</div>';
  return h + '</div>';
}

function whOpenMonthSheet(empId) {
  if(empId != null) WT.empId = empId;
  if(!_whViewMonth) _whViewMonth = today().substring(0, 7);
  var ov = document.getElementById('whSheetOverlay');
  if(!ov) {
    ov = document.createElement('div');
    ov.id = 'whSheetOverlay';
    ov.style.cssText = 'position:fixed;inset:0;z-index:100000;background:var(--bg);overflow-y:auto;-webkit-overflow-scrolling:touch';
    document.body.appendChild(ov);
  }
  wtRender();
}
function wtClose() {
  var o = document.getElementById('whSheetOverlay');
  if(o) o.parentNode.removeChild(o);
  clearTimeout(wtSaveSoon._t); save();
  var emp = wtEmp();
  if(emp && document.getElementById('whList')) renderWorkHoursSection(emp);
}
function wtRender() {
  var ov = document.getElementById('whSheetOverlay'), emp = wtEmp();
  if(!ov || !emp) return;
  var monthKey = _whViewMonth, keep = ov.scrollTop;
  var empOpts = (state.employees || []).map(function(e) {
    return '<option value="' + e.id + '"' + (e.id === emp.id ? ' selected' : '') + '>' + escHtml(wtEmpName(e)) + '</option>';
  }).join('');
  var rows = whDaysInMonth(monthKey).map(function(d) { return wtRowHtml(emp, d); }).join('');
  var mname = monthNamesLocal()[+monthKey.substring(5, 7) - 1] + ' ' + monthKey.substring(0, 4);
  var html = '<div class="wt-hdr"><button type="button" class="wt-back" onclick="wtClose()">' + svgIcon('chevronLeft', 18) + '</button><div class="wt-hdr-t">' + escHtml(wttx('title')) + '</div></div>'
    + '<div class="wt-body">'
    + '<div class="wt-sub">' + escHtml(wttx('sub')) + '</div>'
    + '<div class="wt-card"><div class="wt-card-body">'
    +   '<div class="wt-field"><div class="wt-lbl">' + escHtml(wttx('employee')) + '</div><select class="wt-input" onchange="wtPickEmp(this.value)">' + empOpts + '</select></div>'
    +   '<div class="wt-field"><div class="wt-lbl">' + escHtml(wttx('period')) + '</div><div class="wt-month-nav"><button type="button" class="wt-arrow" onclick="wtShiftMonth(-1)">&lsaquo;</button><div class="wt-month-lbl">' + escHtml(mname) + '</div><button type="button" class="wt-arrow" onclick="wtShiftMonth(1)">&rsaquo;</button></div></div>'
    +   '<button type="button" class="wt-btn" onclick="wtClose();showNav(\'employees\')">' + escHtml(wttx('manage')) + '</button>'
    + '</div></div>'
    + '<div class="wt-card">' + wtCardHd('bolt', 'amber', escHtml(wttx('quick')), escHtml(wttx('monFri'))) + '<div class="wt-card-body">'
    +   '<div class="wt-grid3"><div><div class="wt-lbl">' + escHtml(wttx('from')) + '</div><input class="wt-input" type="time" id="wtQFrom" value="08:00"></div>'
    +   '<div><div class="wt-lbl">' + escHtml(wttx('to')) + '</div><input class="wt-input" type="time" id="wtQTo" value="17:00"></div>'
    +   '<div><div class="wt-lbl">' + escHtml(wttx('brk')) + '</div><input class="wt-input" type="number" id="wtQBrk" min="0" step="5" value="30"></div></div>'
    +   '<button type="button" class="wt-btn" onclick="wtApplyQuick()">' + escHtml(wttx('apply')) + '</button>'
    +   '<div class="wt-note">' + escHtml(wttx('quickNote')) + '</div>'
    + '</div></div>'
    + '<div class="wt-card"><div class="wt-th"><div>' + escHtml(wttx('date')) + '</div><div>' + escHtml(wttx('day')) + '</div><div>' + escHtml(wttx('status')) + '</div></div><div id="wtRows">' + rows + '</div></div>'
    + '<button type="button" class="wt-btn ghost block" style="margin-bottom:14px" onclick="whOpenLeaveForm(' + emp.id + ')">' + escHtml(wttx('addLeave')) + '</button>'
    + '<div class="wt-card">' + wtCardHd('cal', 'blue', escHtml(wttx('vacTitle'))) + '<div class="wt-card-body" id="wtVac"></div></div>'
    + '<div class="wt-card">' + wtCardHd('clock', 'green', escHtml(wttx('totalTitle'))) + '<div class="wt-card-body" id="wtTotal"></div></div>'
    + '<div class="wt-card">' + wtCardHd('doc', 'violet', escHtml(wttx('export'))) + '<div class="wt-card-body"><div class="wt-note" style="margin:0 0 14px;font-size:13px">' + escHtml(wttx('exportTxt')) + '</div>'
    +   '<button type="button" class="wt-btn block" onclick="wtExportPdf()">' + WT_ICONS.dl + ' ' + escHtml(wttx('exportBtn')) + '</button></div></div>'
    + '</div>';
  ov.innerHTML = html;
  ov.scrollTop = keep;
  wtWireLeaveIcons();
  wtSummary();
}
function wtWireLeaveIcons() {
  var ov = document.getElementById('whSheetOverlay'), emp = wtEmp();
  if(!ov || !emp) return;
  [].forEach.call(ov.querySelectorAll('.wh-leave-view'), function(el) {
    var id = parseInt(el.getAttribute('data-id'), 10);
    el.onclick = function() { whLeaveDocView(id, emp); };
  });
  [].forEach.call(ov.querySelectorAll('.wh-leave-del'), function(el) {
    var id = parseInt(el.getAttribute('data-id'), 10);
    el.onclick = function() { whDeleteLeavePeriod(emp.id, id); };
  });
}
function wtSummary() {
  var emp = wtEmp(), vacEl = document.getElementById('wtVac'), totEl = document.getElementById('wtTotal');
  if(!emp || !vacEl || !totEl) return;
  var st = wtMonthStats(emp, _whViewMonth), v = wtVacation(emp, _whViewMonth), u = escHtml(wttx('dayUnit'));
  vacEl.innerHTML = '<div class="wt-kv"><span>' + escHtml(wttx('hire')) + '</span><b>' + (emp.startDate ? escHtml(formatDateDisplay(emp.startDate)) : '—') + '</b></div>'
    + '<div class="wt-kv"><span>' + escHtml(wttx('months')) + '</span><b>' + v.months + '</b></div>'
    + '<div class="wt-kv"><span>' + escHtml(wttx('factor')) + '</span><span><input class="wt-input" type="number" min="0" step="0.01" value="' + v.factor + '" onchange="wtSetFactor(this.value)"> <b>' + u.charAt(0) + '</b></span></div>'
    + '<div class="wt-kv"><span>' + escHtml(wttx('entitle')) + '</span><b>' + wtDe(v.entitled, 2) + '</b></div>'
    + '<div class="wt-kv"><span>' + escHtml(wttx('used')) + '</span><b>' + v.used + '</b></div>'
    + '<div class="wt-big-wrap"><div class="wt-big-lbl">' + escHtml(wttx('remaining')) + '</div><div class="wt-big' + (v.rest < 0 ? ' neg' : '') + '">' + wtDe(v.rest, 2) + '<small>' + u + '</small></div></div>'
    + (!v.hasHire ? '<div class="wt-note">' + escHtml(wttx('noHire')) + '</div>' : (v.months === 0 ? '<div class="wt-note">' + escHtml(wttx('beforeHire')) + '</div>' : ''));
  totEl.innerHTML = '<div style="text-align:center"><div class="wt-big" style="margin-top:0">' + wtDe(st.hours, 2) + ' <small>h</small></div><div class="wt-big-lbl" style="margin-top:6px">' + escHtml(wttx('net')) + '</div></div>'
    + '<div class="wt-kv" style="margin-top:12px;border-top:1px solid var(--border)"><span>' + escHtml(wttx('workDays')) + '</span><b>' + st.workDays + '</b></div>'
    + '<div class="wt-kv"><span>' + escHtml(wttx('absences')) + '</span><b>' + st.urlaub + ' / ' + (st.krank + st.karenz) + ' / ' + st.feiertag + '</b></div>';
}
function wtPickEmp(id) { WT.empId = parseInt(id, 10); wtRender(); }
function wtShiftMonth(delta) {
  var p = _whViewMonth.split('-'), d = new Date(+p[0], +p[1] - 1 + delta, 1);
  _whViewMonth = d.getFullYear() + '-' + pad2(d.getMonth() + 1);
  wtRender();
}
function wtSetFactor(v) {
  var f = parseFloat(v), emp = wtEmp();
  if(emp && !isNaN(f) && f >= 0) { emp.vacationFactor = f; wtSaveSoon(); }
  wtSummary();
}
function wtRefreshRow(day) {
  var emp = wtEmp(), row = document.getElementById('wtRow_' + day);
  if(!emp || !row) return;
  var tmp = document.createElement('div'); tmp.innerHTML = wtRowHtml(emp, day);
  row.parentNode.replaceChild(tmp.firstChild, row);
  wtWireLeaveIcons();
}
// Status select: a single-day leave period (or none). Times and leave exclude each other.
function wtSetStatus(day, st) {
  var emp = wtEmp(); if(!emp) return;
  emp.leavePeriods = (emp.leavePeriods || []).filter(function(lp) { return !(lp.from === day && lp.to === day); });
  if(st) {
    emp.workHours = (emp.workHours || []).filter(function(w) { return whEntryDate(w) !== day; });
    emp.leavePeriods.push({id: Date.now(), type: st, from: day, to: day, docId: null, createdAt: Date.now()});
  }
  wtSaveSoon(); wtRefreshRow(day); wtSummary();
}
function wtSetField(day, field, value) {
  var emp = wtEmp(); if(!emp) return;
  if(!emp.workHours) emp.workHours = [];
  var e = whDayEntry(emp, day);
  if(!e) {
    e = {id: Date.now() + Math.floor(Math.random() * 1000), date: day, fromDate: day, toDate: day, start: null, end: null, breakMinutes: null, hours: 0};
    emp.workHours.push(e);
  }
  if(field === 'breakMinutes') e.breakMinutes = value === '' ? null : (parseFloat(value) || 0);
  else e[field] = value || null;
  var h = whTimeDiffHours(e.start, e.end, e.breakMinutes);
  e.hours = h != null ? h : 0;
  if(!e.start && !e.end && !(e.breakMinutes > 0)) emp.workHours = emp.workHours.filter(function(w) { return w !== e; });
  wtSaveSoon();
  var el = document.getElementById('wtHrs_' + day);
  if(el) el.textContent = e.hours > 0 ? wtDe(e.hours, 2) + ' h' : '–';
  wtSummary();
}
async function wtApplyQuick() {
  var emp = wtEmp(); if(!emp) return;
  var from = document.getElementById('wtQFrom').value, to = document.getElementById('wtQTo').value, brk = parseFloat(document.getElementById('wtQBrk').value) || 0;
  if(!from || !to) return;
  var targets = whDaysInMonth(_whViewMonth).filter(function(day) {
    var dow = wtDow(day);
    if(dow === 0 || dow === 6) return false;
    var i = wtDayInfo(emp, day);
    return !i.leave && !i.auto;
  });
  var clash = targets.filter(function(day) { var e = whDayEntry(emp, day); return e && (e.start !== from || e.end !== to || (e.breakMinutes || 0) !== brk); }).length;
  if(clash && !(await confirmAsync(wttx('quick'), wttx('overwrite')))) return;
  if(!emp.workHours) emp.workHours = [];
  var h = whTimeDiffHours(from, to, brk) || 0;
  targets.forEach(function(day, idx) {
    var e = whDayEntry(emp, day);
    if(!e) { e = {id: Date.now() + idx, date: day, fromDate: day, toDate: day}; emp.workHours.push(e); }
    e.start = from; e.end = to; e.breakMinutes = brk; e.hours = h;
  });
  save(); wtRender();
  showToast(wttx('applied').replace('{n}', targets.length));
}

function wtExportPdf() {
  var emp = wtEmp(); if(!emp) return;
  var JsPdf = (window.jspdf && window.jspdf.jsPDF) ? window.jspdf.jsPDF : (window.jsPDF || null);
  if(!JsPdf) { showToast(wttx('pdfFail'), 'error'); return; }
  var monthKey = _whViewMonth, days = whDaysInMonth(monthKey);
  var st = wtMonthStats(emp, monthKey), v = wtVacation(emp, monthKey);
  var y0 = +monthKey.substring(0, 4), m0 = +monthKey.substring(5, 7) - 1;
  var doc = new JsPdf({unit: 'mm', format: 'a4', orientation: 'portrait'});
  var L = 14, W = 182;
  var monthLabel = whAtMonthLabel(monthKey);
  var company = state.businessName || 'Trabis';

  doc.setFillColor(26, 127, 212); doc.rect(0, 0, 210, 28, 'F');
  doc.setTextColor(255, 255, 255); doc.setFont('helvetica', 'bold'); doc.setFontSize(18);
  doc.text('Stundenzettel & Urlaub', L, 13);
  doc.setFont('helvetica', 'normal'); doc.setFontSize(10);
  doc.text(company, L, 21);
  doc.setFont('helvetica', 'bold'); doc.setFontSize(12);
  doc.text(monthLabel, 210 - L, 13, {align: 'right'});
  doc.setFont('helvetica', 'normal'); doc.setFontSize(10);
  doc.text('Trabis', 210 - L, 21, {align: 'right'});

  doc.setTextColor(26, 42, 58); doc.setFontSize(10);
  doc.setFont('helvetica', 'bold'); doc.text('Mitarbeiter:', L, 38); doc.setFont('helvetica', 'normal'); doc.text(wtEmpName(emp), L + 26, 38);
  doc.setFont('helvetica', 'bold'); doc.text('Position:', L, 44); doc.setFont('helvetica', 'normal'); doc.text(emp.position || '', L + 26, 44);
  doc.setFont('helvetica', 'bold'); doc.text('Eintritt:', 110, 38); doc.setFont('helvetica', 'normal'); doc.text(emp.startDate ? whFmtDayDate(emp.startDate) : '-', 130, 38);
  doc.setFont('helvetica', 'bold'); doc.text('Zeitraum:', 110, 44); doc.setFont('helvetica', 'normal'); doc.text(monthLabel, 130, 44);

  var cols = [{t: 'Datum', w: 24, a: 'l'}, {t: 'Tag', w: 14, a: 'l'}, {t: 'Status', w: 34, a: 'l'}, {t: 'Von', w: 26, a: 'c'}, {t: 'Bis', w: 26, a: 'c'}, {t: 'Pause (Min)', w: 24, a: 'c'}, {t: 'Stunden', w: 34, a: 'r'}];
  var y = 50, rh = 6;
  function cell(txt, ci, yy) {
    var x = L; for(var i = 0; i < ci; i++) x += cols[i].w;
    var c = cols[ci];
    if(c.a === 'l') doc.text(String(txt), x + 2, yy); else if(c.a === 'c') doc.text(String(txt), x + c.w / 2, yy, {align: 'center'}); else doc.text(String(txt), x + c.w - 2, yy, {align: 'right'});
  }
  doc.setFillColor(26, 42, 58); doc.rect(L, y, W, 7, 'F');
  doc.setTextColor(255, 255, 255); doc.setFont('helvetica', 'bold'); doc.setFontSize(9);
  cols.forEach(function(c, i) { cell(c.t, i, y + 4.8); });
  y += 7;
  var labels = {urlaub: 'Urlaub', krankenstand: 'Krankenstand', karenz: 'Karenz', feiertag: 'Feiertag'};
  var fills = {urlaub: [219, 234, 254], krankenstand: [254, 226, 226], karenz: [237, 233, 254], feiertag: [237, 233, 254]};
  doc.setFont('helvetica', 'normal'); doc.setFontSize(9);
  days.forEach(function(day) {
    var i = wtDayInfo(emp, day), dow = wtDow(day);
    var fill = fills[i.st] || ((dow === 0 || dow === 6) ? [241, 245, 249] : null);
    if(fill) { doc.setFillColor(fill[0], fill[1], fill[2]); doc.rect(L, y, W, rh, 'F'); }
    doc.setDrawColor(226, 232, 240); doc.line(L, y + rh, L + W, y + rh);
    doc.setTextColor(26, 42, 58);
    cell(pad2(+day.substring(8)) + '.' + day.substring(5, 7) + '.', 0, y + 4.2);
    cell(WT_WD.de[dow], 1, y + 4.2);
    cell(labels[i.st] || '', 2, y + 4.2);
    if(i.entry) {
      var e = i.entry, h = whComputeHours(e);
      if(e.start) cell(e.start, 3, y + 4.2);
      if(e.end) cell(e.end, 4, y + 4.2);
      if(e.start && e.end) cell(e.breakMinutes || 0, 5, y + 4.2);
      if(h > 0) cell(wtDe(h, 2), 6, y + 4.2);
    }
    y += rh;
  });
  doc.setDrawColor(26, 42, 58); doc.line(L, y, L + W, y);

  y += 6;
  var bw = (W - 8) / 3, bh = 30;
  function box(x, title) {
    doc.setFillColor(245, 251, 255); doc.setDrawColor(204, 228, 247); doc.roundedRect(x, y, bw, bh, 2, 2, 'FD');
    doc.setTextColor(138, 171, 184); doc.setFont('helvetica', 'bold'); doc.setFontSize(7.5); doc.text(title, x + 4, y + 6);
  }
  box(L, 'NETTO-ARBEITSSTUNDEN');
  doc.setTextColor(26, 127, 212); doc.setFontSize(18); doc.text(wtDe(st.hours, 2) + ' h', L + 4, y + 17);
  doc.setTextColor(74, 106, 138); doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.text(st.workDays + ' Arbeitstage', L + 4, y + 25);
  box(L + bw + 4, 'ABWESENHEIT (MONAT)');
  doc.setTextColor(26, 42, 58); doc.setFont('helvetica', 'normal'); doc.setFontSize(9);
  doc.text('Urlaub: ' + st.urlaub + ' Tage', L + bw + 8, y + 13);
  doc.text('Krankenstand/Karenz: ' + (st.krank + st.karenz) + ' Tage', L + bw + 8, y + 19);
  doc.text('Feiertage: ' + st.feiertag, L + bw + 8, y + 25);
  box(L + (bw + 4) * 2, 'URLAUBSANSPRUCH');
  var bx = L + (bw + 4) * 2 + 4;
  doc.setTextColor(26, 42, 58); doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5);
  doc.text(v.months + ' Mon. x ' + wtDe(v.factor, 2) + ' = ' + wtDe(v.entitled, 2) + ' T.', bx, y + 12);
  doc.text('Verbraucht: ' + v.used + ' T.', bx, y + 17.5);
  doc.setFont('helvetica', 'bold'); doc.setFontSize(12);
  if(v.rest < 0) doc.setTextColor(220, 38, 38); else doc.setTextColor(26, 127, 212);
  doc.text('Rest: ' + wtDe(v.rest, 2) + ' Tage', bx, y + 25);
  doc.setTextColor(138, 171, 184); doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5);
  doc.text('Erstellt mit Trabis am ' + new Date().toLocaleDateString('de-AT'), L, 290);
  doc.save('Stundenzettel_' + wtEmpName(emp).replace(/\s+/g, '_') + '_' + monthKey + '.pdf');
}

var _whLeavePendingFile = null;

function whLeaveFileChosen(input) {
  var f = input.files && input.files[0];
  if(!f) return;
  var isPdf = f.type === 'application/pdf';
  input.value = '';
  receiptCompress(f).then(function(blob) {
    _whLeavePendingFile = {blob: blob, type: isPdf ? 'application/pdf' : 'image/jpeg', name: f.name || 'certificate'};
    var status = document.getElementById('whLeaveFileStatus');
    if(status) status.textContent = _whLeavePendingFile.name;
  });
}

function whOpenLeaveForm(empId) {
  var existing = document.getElementById('whLeaveOverlay');
  if(existing) existing.parentNode.removeChild(existing);
  _whLeavePendingFile = null;

  var ov = document.createElement('div');
  ov.id = 'whLeaveOverlay';
  ov.className = 'modal-overlay open';
  ov.style.zIndex = '100002'; // above whSheetOverlay (100000)

  var monthKey = _whViewMonth || today().substring(0,7);
  var defaultDate = monthKey + '-01';

  var html = '';
  html += '<div class="modal" id="whLeaveModal">';
  html += '<button class="modal-close-btn" id="whLeaveCloseBtn">' + svgIcon('x', 16) + '</button>';
  html += '<div class="modal-handle"></div>';
  html += '<div class="modal-title">' + emptx('whLeaveTitle') + '</div>';
  html += '<label style="font-size:12px;color:var(--text3);display:block;margin-bottom:4px">' + emptx('whLeaveType') + '</label>';
  html += '<select id="whl-type" class="input-field"><option value="krankenstand">Krankenstand</option><option value="urlaub">Urlaub</option><option value="karenz">Karenz</option><option value="feiertag">Feiertag</option></select>';
  html += '<label style="font-size:12px;color:var(--text3);display:block;margin-bottom:4px">' + emptx('whLeaveFrom') + '</label>';
  html += '<div class="date-fix-wrap"><input type="date" id="whl-from" class="input-field" value="' + defaultDate + '"></div>';
  html += '<label style="font-size:12px;color:var(--text3);display:block;margin-bottom:4px">' + emptx('whLeaveTo') + '</label>';
  html += '<div class="date-fix-wrap"><input type="date" id="whl-to" class="input-field" value="' + defaultDate + '"></div>';
  html += '<label style="font-size:12px;color:var(--text3);display:block;margin:4px 0 6px">' + emptx('whLeaveCert') + '</label>';
  html += '<button type="button" id="whLeaveUploadBtn" style="width:100%;padding:10px;border-radius:10px;border:1.5px dashed var(--border);background:var(--bg);color:var(--text2);font-size:13px;font-weight:600;cursor:pointer">' + emptx('docUpload') + '</button>';
  html += '<div id="whLeaveFileStatus" style="font-size:12px;color:var(--primary);margin-top:6px"></div>';
  html += '<input type="file" id="whLeaveFileInput" accept="image/*,application/pdf" style="display:none">';
  html += '<div id="whLeaveError" style="font-size:12px;color:#ef4444;margin-top:6px;display:none"></div>';
  html += '<div style="display:flex;gap:10px;margin-top:14px">';
  html += '<button id="whLeaveSaveBtn" style="flex:1;background:#8b5cf6;color:#fff;border:none;border-radius:12px;padding:13px;font-size:15px;font-weight:700;cursor:pointer">' + emptx('save') + '</button>';
  html += '<button id="whLeaveCancelBtn" style="flex:1;background:var(--bg);color:var(--text2);border:1.5px solid var(--border);border-radius:12px;padding:13px;font-size:15px;font-weight:600;cursor:pointer">' + emptx('cancel') + '</button>';
  html += '</div></div>';
  ov.innerHTML = html;
  document.body.appendChild(ov);

  function close() { _whLeavePendingFile = null; var o = document.getElementById('whLeaveOverlay'); if(o) o.parentNode.removeChild(o); }
  document.getElementById('whLeaveCloseBtn').onclick = close;
  document.getElementById('whLeaveCancelBtn').onclick = close;
  ov.onclick = function(e) { if(e.target === ov) close(); };
  document.getElementById('whLeaveUploadBtn').onclick = function() { document.getElementById('whLeaveFileInput').click(); };
  document.getElementById('whLeaveFileInput').onchange = function() { whLeaveFileChosen(this); };
  document.getElementById('whLeaveSaveBtn').onclick = function() { whSaveLeavePeriod(empId); };
}

function whSaveLeavePeriod(empId) {
  var emp = (state.employees || []).find(function(e){ return e.id === empId; });
  if(!emp) return;
  var type = document.getElementById('whl-type').value;
  var from = document.getElementById('whl-from').value;
  var to = document.getElementById('whl-to').value;
  var errEl = document.getElementById('whLeaveError');
  if(!from || !to || from > to) {
    if(errEl) { errEl.textContent = emptx('whLeaveInvalid'); errEl.style.display = 'block'; }
    return;
  }

  var leaveId = Date.now();
  var pending = _whLeavePendingFile;
  _whLeavePendingFile = null;

  var finish = function(docId) {
    if(!emp.leavePeriods) emp.leavePeriods = [];
    emp.leavePeriods.push({id: leaveId, type: type, from: from, to: to, docId: docId || null, createdAt: Date.now()});
    // Any pre-existing time entries inside the new leave range are now contradictory — remove them.
    emp.workHours = (emp.workHours || []).filter(function(w) {
      var wd = whEntryDate(w);
      return !(wd >= from && wd <= to);
    });
    save();
    var o = document.getElementById('whLeaveOverlay');
    if(o) o.parentNode.removeChild(o);
    whOpenMonthSheet(empId);
  };

  if(pending) {
    empDocPut({
      id: leaveId + 1,
      empId: empId,
      user: localStorage.getItem('smartac_user') || '',
      name: pending.name,
      type: pending.type,
      blob: pending.blob,
      createdAt: new Date().toISOString()
    }).then(function() { finish(leaveId + 1); });
  } else {
    finish(null);
  }
}

function whLeaveDocView(leaveId, emp) {
  var leave = (emp.leavePeriods || []).find(function(l){ return l.id === leaveId; });
  if(!leave || !leave.docId) return;
  empDocGet(leave.docId).then(function(rec) { if(rec) openReceiptViewer(rec); });
}

async function whDeleteLeavePeriod(empId, leaveId) {
  if(!(await confirmAsync(DELETE_CONFIRM_TITLE[state.lang]||DELETE_CONFIRM_TITLE.en, emptx('whLeaveConfirmDelete')))) return;
  var emp = (state.employees || []).find(function(e){ return e.id === empId; });
  if(!emp) return;
  var leave = (emp.leavePeriods || []).find(function(l){ return l.id === leaveId; });
  if(leave && leave.docId) empDocDeleteRec(leave.docId);
  emp.leavePeriods = (emp.leavePeriods || []).filter(function(l){ return l.id !== leaveId; });
  save();
  whOpenMonthSheet(empId);
}

async function whDelete(empId, entryId) {
  if(!(await confirmAsync(DELETE_CONFIRM_TITLE[state.lang]||DELETE_CONFIRM_TITLE.en, emptx('whConfirmDelete')))) return;
  var emp = (state.employees || []).find(function(e){ return e.id === empId; });
  if(!emp) return;
  emp.workHours = (emp.workHours || []).filter(function(w){ return w.id !== entryId; });
  save();
  renderWorkHoursSection(emp);
}

function whEntryDate(w) { return w.fromDate || w.date || ''; }

function whMonthLabelText(monthKey) {
  var parts = monthKey.split('-');
  var monthNames = KAL_MONTH_NAMES[state.lang] || KAL_MONTH_NAMES.en;
  return monthNames[parseInt(parts[1],10)-1] + ' ' + parts[0];
}

function whShiftMonth(delta) {
  var parts = _whViewMonth.split('-');
  var d = new Date(parseInt(parts[0],10), parseInt(parts[1],10)-1 + delta, 1);
  _whViewMonth = d.getFullYear() + '-' + pad2(d.getMonth()+1);
  var emp = (state.employees || []).find(function(e){ return e.id === _empProfileId; });
  if(emp) renderWorkHoursSection(emp);
}

function renderWorkHoursSection(emp) {
  var list = document.getElementById('whList');
  var summary = document.getElementById('whSummary');
  var monthLabelEl = document.getElementById('whMonthLabel');
  if(!list || !summary) return;
  if(!_whViewMonth) _whViewMonth = today().substring(0,7);
  if(monthLabelEl) monthLabelEl.textContent = whMonthLabelText(_whViewMonth);

  var entries = (emp.workHours || []).filter(function(w){ return whEntryDate(w).substring(0,7) === _whViewMonth; })
    .sort(function(a,b){
      var da = whEntryDate(a), db = whEntryDate(b);
      return da < db ? 1 : (da > db ? -1 : b.id - a.id);
    });

  var monthTotal = entries.reduce(function(s,w){ return s + whComputeHours(w); }, 0);
  summary.textContent = emptx('whMonthTotal') + ': ' + whFmtHM(monthTotal);

  var prevBtn = document.getElementById('whPrevMonthBtn');
  if(prevBtn) prevBtn.onclick = function(){ whShiftMonth(-1); };
  var nextBtn = document.getElementById('whNextMonthBtn');
  if(nextBtn) nextBtn.onclick = function(){ whShiftMonth(1); };
  var exportBtn = document.getElementById('whExportBtn');
  if(exportBtn) exportBtn.onclick = function(){ whExportPDF(emp.id); };

  if(!entries.length) {
    list.innerHTML = '<div style="text-align:center;padding:16px;color:var(--text3);font-size:13px">' + emptx('whNoEntriesMonth') + '</div>';
    return;
  }
  var h = '';
  entries.forEach(function(w) {
    var hrs = whComputeHours(w);
    var from = whEntryDate(w);
    var to = w.toDate || from;
    var periodLabel = to && to !== from ? (formatDateDisplay(from) + ' – ' + formatDateDisplay(to)) : formatDateDisplay(from);
    var timeLabel = (w.start && w.end) ? (' <span style="color:var(--text3);font-weight:400">· ' + escHtml(w.start) + '–' + escHtml(w.end) + (w.breakMinutes ? ' (−' + w.breakMinutes + 'm)' : '') + '</span>') : '';
    h += '<div style="display:flex;align-items:center;gap:10px;padding:10px 0;border-bottom:1px solid var(--border)">';
    h += '<div style="flex:1;min-width:0">';
    h += '<div style="font-size:14px;font-weight:600">' + periodLabel + timeLabel + '</div>';
    if(w.note) h += '<div style="font-size:12px;color:var(--text3);margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + escHtml(w.note) + '</div>';
    h += '</div>';
    h += '<div style="font-size:14px;font-weight:700;color:var(--primary);white-space:nowrap">' + whFmtHM(hrs) + '</div>';
    h += '<button onclick="whOpenMonthSheet(' + emp.id + ')" style="border:none;background:none;color:var(--text3);cursor:pointer;padding:6px;flex-shrink:0">' + svgIcon('pencil', 14) + '</button>';
    h += '<button onclick="whDelete(' + emp.id + ',' + w.id + ')" style="border:none;background:none;color:var(--text3);cursor:pointer;padding:6px;flex-shrink:0">' + svgIcon('trash', 14) + '</button>';
    h += '</div>';
  });
  list.innerHTML = h;
}

// Renders a bordered monthly grid PDF matching the printed Austrian
// Arbeitszeit sheet exactly: one row per calendar day + signature line.
function whFmtHM(decimalHours) {
  var totalMin = Math.round((decimalHours||0) * 60);
  var h = Math.floor(totalMin / 60);
  var m = totalMin % 60;
  return h + ':' + pad2(m);
}

function whExportPDF(empId) {
  var emp = (state.employees || []).find(function(e){ return e.id === empId; });
  if(!emp) return;
  var JsPdf = (window.jspdf && window.jspdf.jsPDF) ? window.jspdf.jsPDF : (window.jsPDF || null);
  if(!JsPdf) { showToast('PDF library not available', 'error'); return; }
  var monthKey = _whViewMonth || today().substring(0,7);
  var days = whDaysInMonth(monthKey);
  var empName = emp.fullName || emp.name || '';

  var doc = new JsPdf({orientation:'p', unit:'mm', format:'a4'});
  var cols = [14, 46, 90, 118, 146, 170, 196]; // 6 column boundaries
  var headers = ['Datum','Fahrer','Startzeit','Endzeit','Pause (min)','Gesamtstunden'];
  var rowH = 6.6;
  var y = 16;

  doc.setDrawColor(120);
  doc.setFillColor(216,216,216);
  doc.rect(cols[0], y, cols[6]-cols[0], rowH, 'FD');
  doc.setFontSize(11); doc.setFont(undefined, 'bold'); doc.setTextColor(0);
  doc.text(whAtMonthLabel(monthKey), cols[0]+2, y+rowH-2);
  y += rowH;

  // NOTE: jsPDF's text() reuses the same internal fill-color state as
  // rect(...,'F'/'FD'), so it must be re-asserted before every filled rect —
  // otherwise every cell after the first one renders solid black.
  doc.setFontSize(8);
  for(var i = 0; i < 6; i++) {
    doc.setFillColor(240,240,240);
    doc.rect(cols[i], y, cols[i+1]-cols[i], rowH, 'FD');
    doc.setTextColor(0);
    doc.text(headers[i], cols[i]+2, y+rowH-2);
  }
  y += rowH;

  doc.setFont(undefined, 'normal'); doc.setFontSize(9); doc.setTextColor(0);
  var total = 0;
  days.forEach(function(day) {
    var leave = whDayLeavePeriod(emp, day);
    if(leave) {
      doc.rect(cols[0], y, cols[1]-cols[0], rowH);
      doc.text(whFmtDayDate(day).substring(0,12), cols[0]+2, y+rowH-2);
      doc.rect(cols[1], y, cols[2]-cols[1], rowH);
      doc.text(empName.substring(0,22), cols[1]+2, y+rowH-2);
      doc.rect(cols[2], y, cols[6]-cols[2], rowH);
      doc.setFont(undefined, 'bold');
      doc.text(whLeaveTypeLabel(leave.type), cols[2]+2, y+rowH-2);
      doc.setFont(undefined, 'normal');
      y += rowH;
      if(y > 280) { doc.addPage(); y = 16; }
      return;
    }
    var entry = whDayEntry(emp, day);
    var hrs = entry ? whComputeHours(entry) : 0;
    if(entry) total += hrs;
    var values = [
      whFmtDayDate(day), empName,
      entry && entry.start ? entry.start : '',
      entry && entry.end ? entry.end : '',
      entry && entry.breakMinutes != null ? String(entry.breakMinutes) : '',
      entry ? whFmtHM(hrs) : ''
    ];
    for(var c = 0; c < 6; c++) {
      doc.rect(cols[c], y, cols[c+1]-cols[c], rowH);
      doc.text(String(values[c]).substring(0, c===1?22:12), cols[c]+2, y+rowH-2);
    }
    y += rowH;
    if(y > 280) { doc.addPage(); y = 16; }
  });

  y += 14;
  doc.setDrawColor(0);
  doc.line(14, y, 74, y);
  y += 5;
  doc.setFontSize(10); doc.setFont(undefined, 'normal'); doc.setTextColor(0);
  doc.text('Unterschrift Fahrer', 14, y);

  y += 10;
  doc.setFontSize(8); doc.setTextColor(120);
  doc.text('Gesamtstunden Monat: ' + whFmtHM(total) + '  ·  Erstellt am: ' + new Date().toLocaleString('de-AT'), 14, y);

  doc.save('Arbeitszeit_' + empName.replace(/\s+/g,'_') + '_' + monthKey + '.pdf');
}

function openReceiptViewer(rec) {
  var url = URL.createObjectURL(rec.blob);
  var ov = document.createElement('div');
  ov.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,0.88);z-index:600000;display:flex;align-items:center;justify-content:center;padding:16px';
  function close() { if(ov.parentNode) ov.parentNode.removeChild(ov); URL.revokeObjectURL(url); }
  ov.onclick = function(e) { if(e.target === ov) close(); };
  ov.innerHTML = (rec.type === 'application/pdf'
      ? '<iframe src="' + url + '" style="width:100%;height:92vh;border:none;background:#fff;border-radius:12px"></iframe>'
      : '<img src="' + url + '" style="max-width:100%;max-height:92vh;border-radius:12px"/>')
    + '<button style="position:absolute;top:14px;right:14px;width:38px;height:38px;border-radius:50%;border:none;background:rgba(255,255,255,0.15);color:#fff;font-size:18px;cursor:pointer">' + svgIcon('x',16) + '</button>';
  ov.querySelector('button').onclick = close;
  document.body.appendChild(ov);
}
