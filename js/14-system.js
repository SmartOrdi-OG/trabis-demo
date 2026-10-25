// ── IN-APP NOTIFICATIONS ──
function showInAppNotifications() {
  var container = document.getElementById('inAppNotifContainer');
  if(!container) return;
  container.innerHTML = '';
  var lang = state.lang;
  var today2 = today();

  // Green: transactions recorded today
  var todayTxs = state.transactions.filter(function(t){ return t.date===today2; });
  if(todayTxs.length>0) {
    var inc = todayTxs.filter(function(t){return t.type==='income';}).reduce(function(s,t){return s+t.amount;},0);
    var exp = todayTxs.filter(function(t){return t.type==='expense';}).reduce(function(s,t){return s+t.amount;},0);
    var body = {
      en:todayTxs.length+' transaction(s) · Income: '+fmt(inc)+' · Exp: '+fmt(exp),
      ar:todayTxs.length+' معاملة · دخل: '+fmt(inc)+' · مصاريف: '+fmt(exp),
      de:todayTxs.length+' Transaktion(en) · Einnahmen: '+fmt(inc)+' · Ausgaben: '+fmt(exp),
    };
    var todayMsg = body[lang] || body.en;
    addNotification(todayMsg, 'success');
    showToast(todayMsg, 'success');
  }

  // Orange: debts due in 1-3 days (not yet overdue)
  var now2 = Date.now();
  var soonDebts = state.debts.filter(function(d){
    if(d.status==='paid') return false;
    var msLeft = new Date(d.date).getTime() - now2;
    var days = Math.ceil(msLeft/86400000);
    return days>=1 && days<=3;
  });
  if(soonDebts.length>0) {
    var soonLines = {en:[],ar:[],de:[]};
    soonDebts.forEach(function(d){
      var msLeft = new Date(d.date).getTime() - now2;
      var dLeft = Math.ceil(msLeft/86400000);
      var isIOwe = d.type==='i-owe';
      var dayStr = {en:dLeft+(dLeft===1?' day':' days'),ar:dLeft+' أيام',de:dLeft+(dLeft===1?' Tag':' Tagen')};
      soonLines.en.push((isIOwe?'YOU owe '+d.person+' '+fmt(d.amount):d.person+' owes YOU '+fmt(d.amount))+' — due in '+dayStr.en);
      soonLines.ar.push((isIOwe?'أنت مدين لـ '+d.person+' بـ '+fmt(d.amount):d.person+' مدين لك بـ '+fmt(d.amount))+' — خلال '+dayStr.ar);
      soonLines.de.push((isIOwe?'SIE schulden '+d.person+' '+fmt(d.amount):d.person+' schuldet IHNEN '+fmt(d.amount))+' — in '+dayStr.de);
    });
    var soonMsg = (soonLines[lang]||soonLines.en).join('; ');
    addNotification(soonMsg, 'warning');
    showToast(soonMsg, 'warning');
  }

  // Red: overdue debts (>3 days past due date) — one banner per debt
  var overdueDebts = state.debts.filter(function(d){
    return d.status!=='paid' && daysAgo(d.date)>3;
  });
  if(overdueDebts.length>0) {
    var ovLines = {en:[],ar:[],de:[]};
    overdueDebts.forEach(function(d){
      var days = daysAgo(d.date);
      var isIOwe = d.type==='i-owe';
      var dStr = {en:days+(days===1?' day':' days'),ar:days+' أيام',de:days+(days===1?' Tag':'e')};
      ovLines.en.push((isIOwe?'YOU owe '+d.person+' '+fmt(d.amount):d.person+' owes YOU '+fmt(d.amount))+' — '+dStr.en+' overdue');
      ovLines.ar.push((isIOwe?'أنت مدين لـ '+d.person+' بـ '+fmt(d.amount):d.person+' مدين لك بـ '+fmt(d.amount))+' — متأخر '+dStr.ar);
      ovLines.de.push((isIOwe?'SIE schulden '+d.person+' '+fmt(d.amount):d.person+' schuldet IHNEN '+fmt(d.amount))+' — '+dStr.de+' überfällig');
    });
    var overdueMsg = (ovLines[lang]||ovLines.en).join('; ');
    addNotification(overdueMsg, 'error');
    showToast(overdueMsg, 'error');
    // Browser push notification if permission granted
    if('Notification' in window && Notification.permission==='granted') {
      var pushLines = ovLines[lang]||ovLines.en;
      try { new Notification('Trabis Alert',{body:pushLines.join('\n'),icon:'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 32 32%22><circle cx=%2216%22 cy=%2216%22 r=%2216%22 fill=%22%231e88e5%22/></svg>'}); } catch(e){}
    }
  }
}

function showInAppBanner(type, icon, titleMap, bodyMap, actionLabel, actionFn) {
  var container = document.getElementById('inAppNotifContainer');
  if(!container) return;
  var lang = state.lang;
  var title = titleMap[lang]||titleMap.en;
  var body = bodyMap[lang]||bodyMap.en;
  var notif = document.createElement('div');
  notif.className = 'inapp-notif '+type;
  notif.innerHTML = '<div class="inapp-notif-icon">'+icon+'</div>'
    +'<div class="inapp-notif-body"><div class="inapp-notif-title">'+title+'</div>'
    +'<div class="inapp-notif-text" style="white-space:normal">'+body+'</div>'
    +(actionLabel ? '<button class="inapp-notif-action" style="margin-top:6px;background:none;border:none;color:inherit;font-weight:700;font-size:12px;cursor:pointer;padding:0;text-decoration:underline">'+actionLabel+'</button>' : '')
    +'</div>'
    +'<button class="inapp-notif-close" onclick="this.parentNode.remove()">'+svgIcon('x',14)+'</button>';
  if(actionLabel && actionFn) {
    var actionBtn = notif.querySelector('.inapp-notif-action');
    if(actionBtn) actionBtn.onclick = function(e){ e.stopPropagation(); actionFn(); notif.remove(); };
  }
  notif.onclick = function(e){ if(e.target.className!=='inapp-notif-close' && e.target.className!=='inapp-notif-action') notif.remove(); };
  container.appendChild(notif);
  setTimeout(function(){
    if(notif.parentNode){
      notif.style.transition='opacity 0.4s,transform 0.4s';
      notif.style.opacity='0';notif.style.transform='translateY(-8px) scale(0.97)';
      setTimeout(function(){if(notif.parentNode)notif.remove();},400);
    }
  },8000);
}

// ── AUTOMATIC RECURRING TRANSACTION GENERATION ──
function checkRecurringDue() {
  var now = new Date();
  var curMonth = now.getFullYear() + '-' + pad2(now.getMonth()+1);
  var todayDay = now.getDate();
  var recordedCount = 0;

  state.recurring.forEach(function(item) {
    if(item.day <= todayDay && item.lastRecorded !== curMonth) {
      var name = item.description || item.name || '';
      var dateStr = curMonth + '-' + pad2(item.day);
      state.transactions.push({
        id: Date.now() + Math.floor(Math.random()*1000),
        type: 'expense',
        name: name,
        amount: parseFloat(item.amount) || 0,
        vatRate: parseFloat(item.vatRate) || 0,
        category: item.category || 'Other',
        date: dateStr
      });
      item.lastRecorded = curMonth;
      recordedCount++;
    }
  });

  (state.fixedIncome||[]).forEach(function(item) {
    if(item.day <= todayDay && item.lastRecorded !== curMonth) {
      var dateStr = curMonth + '-' + pad2(item.day);
      state.transactions.push({
        id: Date.now() + Math.floor(Math.random()*1000),
        type: 'income',
        name: item.name || '',
        amount: parseFloat(item.amount) || 0,
        vatRate: parseFloat(item.vatRate) || 0,
        category: item.category || 'Other',
        date: dateStr
      });
      item.lastRecorded = curMonth;
      recordedCount++;
    }
  });

  state.employees.forEach(function(item) {
    if(item.lastRecorded !== curMonth) {
      var salaryLabel = {en:' - Salary', ar:' - راتب', de:' - Gehalt'};
      var lang = state.lang || 'en';
      var suffix = salaryLabel[lang] || salaryLabel.en;
      var dateStr = curMonth + '-01';
      state.transactions.push({
        id: Date.now() + Math.floor(Math.random()*1000),
        type: 'expense',
        name: (item.name || '') + suffix,
        amount: parseFloat(item.salary) || 0,
        category: 'salary',
        date: dateStr
      });
      item.lastRecorded = curMonth;
      recordedCount++;
    }
  });

  if(recordedCount > 0) {
    save();
    showRecurringNotification(recordedCount);
  }
  return recordedCount;
}

// ── Ausschreibung / installment schedules (vehicles bought via Fleet, or any big purchase from Assets) ──
function checkInstallmentsDue() {
  var now = new Date();
  var curMonth = now.getFullYear() + '-' + pad2(now.getMonth()+1);
  var recordedCount = 0;

  (state.installments || []).forEach(function(inst) {
    if(inst.status !== 'active') return;
    // Catch up every elapsed month since startDate (not just the current one) —
    // covers both a purchase date entered in the past and the app not having
    // been opened for a while, so monthsPosted always matches real elapsed time.
    var elapsed = Math.min(monthsBetween(inst.startDate, today()), inst.totalMonths);
    while(inst.monthsPosted < elapsed) {
      var d = new Date(inst.startDate + 'T00:00:00');
      d.setMonth(d.getMonth() + 1 + inst.monthsPosted);
      var dateStr = d.getFullYear() + '-' + pad2(d.getMonth()+1) + '-01';
      state.transactions.push({
        id: Date.now() + recordedCount,
        type: 'expense',
        name: inst.name,
        amount: bruttoFromNetto(inst.monthlyNetto, inst.vatRate),
        vatRate: inst.vatRate,
        category: 'Vehicle',
        date: dateStr
      });
      inst.monthsPosted++;
      recordedCount++;
    }
    inst.lastRecorded = curMonth;
    if(inst.monthsPosted >= inst.totalMonths) inst.status = 'completed';
  });

  if(recordedCount > 0) {
    save();
    showRecurringNotification(recordedCount);
  }
  return recordedCount;
}

function checkAppointmentReminders() {
  var todayDate = new Date(today() + 'T00:00:00');
  var lang = state.lang || 'en';
  function processAppt(appt, reminderDays) {
    if(!appt.date || !reminderDays) return;
    var apptDate = new Date(appt.date + 'T00:00:00');
    var daysUntil = Math.round((apptDate - todayDate) / 86400000);
    if(daysUntil < 0 || daysUntil > reminderDays) return;
    var sourceId = 'appt-' + appt.id;
    var already = state.notifications.some(function(n){ return n.sourceId === sourceId; });
    if(already) return;
    var msg;
    if(daysUntil === 0) {
      msg = ({en:'Appointment today: ', ar:'موعد اليوم: ', de:'Termin heute: '}[lang] || 'Appointment today: ') + appt.title;
    } else if(daysUntil === 1) {
      msg = ({en:'Appointment tomorrow: ', ar:'موعد غداً: ', de:'Termin morgen: '}[lang] || 'Appointment tomorrow: ') + appt.title;
    } else {
      var prefix = ({en:'Appointment in ', ar:'موعد خلال ', de:'Termin in '}[lang] || 'Appointment in ');
      var suffix = ({en:' days: ', ar:' أيام: ', de:' Tagen: '}[lang] || ' days: ');
      msg = prefix + daysUntil + suffix + appt.title;
    }
    addNotification(msg, 'warning', sourceId);
  }
  (state.appointments || []).forEach(function(appt) { processAppt(appt, appt.reminderDays); });
  // Document/vehicle expiry (auto-generated, not persisted) — fixed 30-day heads-up
  generateAutoAppointments().forEach(function(appt) { processAppt(appt, 30); });
}

function checkInvoicesDue() {
  var todayStr = today();
  var todayDate = new Date(todayStr + 'T00:00:00');
  var overdueList = [];
  var dueTodayList = [];
  var dueSoonList = [];
  var changed = false;

  state.issuedInvoices.forEach(function(inv) {
    if((inv.status !== 'Pending' && inv.status !== 'Overdue') || !inv.dueDate) return;
    var dueDate = new Date(inv.dueDate + 'T00:00:00');
    var diff = Math.round((dueDate - todayDate) / 86400000);
    if(diff < 0) {
      if(inv.status !== 'Overdue') { inv.status = 'Overdue'; changed = true; }
      overdueList.push(inv);
    } else if(diff === 0) {
      dueTodayList.push(inv);
    } else if(diff > 0 && diff <= 3) {
      dueSoonList.push(inv);
    }
  });

  if(changed) save();

  var lang = state.lang || 'en';

  if(overdueList.length) {
    var n1 = overdueList.length;
    var msg1Map = { en: n1 + ' invoice(s) overdue', ar: n1 + ' فاتورة متأخرة', de: n1 + ' Rechnung(en) überfällig' };
    var msg1 = msg1Map[lang] || msg1Map.en;
    addNotification(msg1, 'error');
    void(msg1, 'error');
  }
  if(dueTodayList.length) {
    var n2 = dueTodayList.length;
    var msg2Map = { en: n2 + ' invoice(s) due today', ar: n2 + ' فاتورة مستحقة اليوم', de: n2 + ' Rechnung(en) heute fällig' };
    var msg2 = msg2Map[lang] || msg2Map.en;
    addNotification(msg2, 'warning');
    void(msg2, 'warning');
  }
  if(dueSoonList.length) {
    var n3 = dueSoonList.length;
    var msg3Map = { en: n3 + ' invoice(s) due in 1-3 days', ar: n3 + ' فاتورة مستحقة خلال 3 أيام', de: n3 + ' Rechnung(en) in 1-3 Tagen fällig' };
    var msg3 = msg3Map[lang] || msg3Map.en;
    addNotification(msg3, 'info');
    void(msg3, 'info');
  }
}

function showRecurringNotification(count) {}

// ── PDF EXPORT ──



function logout() {
  localStorage.removeItem('smartac_loggedin');
  localStorage.removeItem('smartac_session');
  state.transactions = [];
  state.debts = [];
  state.clients = [];
  state.employees = [];
  state.fleet = [];
  state.assets = [];
  state.inventory = [];
  state.recurring = [];
  state.budgets = {};
  // Hide any open overlays
  var ob = document.getElementById('onboardingOverlay');
  if(ob) ob.style.display = 'none';
  // Show landing page
  var lp = document.getElementById('landingPage');
  if(lp) {
    lp.style.display = 'flex';
    var u = document.getElementById('lp-username');
    var p = document.getElementById('lp-password');
    if(u) u.value = '';
    if(p) p.value = '';
    var errEl = document.getElementById('lp-login-error');
    if(errEl) errEl.style.display = 'none';
    lpSetLang(lpLang || state.lang || 'en');
  }
}

function initApp() {
  var loggedIn = localStorage.getItem('smartac_loggedin');
  var savedUser = localStorage.getItem('smartac_user');
  if(loggedIn === '1' && savedUser) {
    loadUserData();
    updateNotifBadge();
    applyLang();
    checkRecurringDue();
    checkInstallmentsDue();
    checkInvoicesDue();
    checkAppointmentReminders();
    checkLowStockAll();
    renderHome();
    playHomeAnim();
  } else {
    var lp = document.getElementById('landingPage');
    if(lp) {
      lp.style.display = 'flex';
      var savedLang = localStorage.getItem('smartac_lang') || 'en';
      lpSetLang(savedLang);
    }
  }
}


document.addEventListener('click', function(e) {
  var dd = document.getElementById('lp-lang-dropdown');
  var list = document.getElementById('lp-lang-list');
  if(dd && list && !dd.contains(e.target)) {
    list.style.display = 'none';
  }
});
function closeLegalPage(id) {
  var el = document.getElementById(id);
  if(el) el.style.display = 'none';
}
function openLegalOverlay(title, subtitle, contentHTML) {
  var overlay = document.createElement('div');
  overlay.style.cssText = 'position:fixed;top:0;right:0;bottom:0;left:0;z-index:999999;background:#f8fafc;overflow-y:auto;-webkit-overflow-scrolling:touch';
  var hdr = document.createElement('div');
  hdr.style.cssText = 'background:#0061a4;padding:16px 24px;display:flex;align-items:center;position:-webkit-sticky;position:sticky;top:0;z-index:1';
  var btn = document.createElement('button');
  btn.innerHTML = '&#8592;';
  btn.style.cssText = 'background:rgba(255,255,255,0.2);border:none;color:#fff;font-size:20px;border-radius:50%;width:36px;height:36px;cursor:pointer;flex-shrink:0;margin-right:16px;display:flex;align-items:center;justify-content:center;line-height:1';
  btn.onclick = function() { document.body.removeChild(overlay); };
  var hdrText = document.createElement('div');
  var hdrTitle = document.createElement('div');
  hdrTitle.style.cssText = 'font-size:18px;font-weight:700;color:#fff';
  hdrTitle.textContent = title;
  var hdrSub = document.createElement('div');
  hdrSub.style.cssText = 'font-size:13px;color:rgba(255,255,255,0.7);margin-top:2px';
  hdrSub.textContent = subtitle;
  hdrText.appendChild(hdrTitle);
  hdrText.appendChild(hdrSub);
  hdr.appendChild(btn);
  hdr.appendChild(hdrText);
  var wrap = document.createElement('div');
  wrap.style.cssText = 'max-width:760px;margin:0 auto;padding:40px 32px 80px';
  wrap.innerHTML = contentHTML;
  overlay.appendChild(hdr);
  overlay.appendChild(wrap);
  document.body.appendChild(overlay);
}
function openImpressum() {
  var cs = 'background:#fff;border-radius:12px;padding:20px 24px;box-shadow:0 1px 4px rgba(0,0,0,0.06);margin-bottom:16px';
  var hs = 'font-size:15px;font-weight:700;color:#1e293b;margin:0 0 12px;padding-bottom:6px;border-bottom:2px solid #f0fdf4';
  var ps = 'font-size:14px;color:#475569;line-height:1.8;margin-bottom:0';
  var as = 'color:#0061a4;text-decoration:none';
  var fs = 'margin-top:48px;padding-top:20px;border-top:1px solid #e2e8f0;font-size:12px;color:#94a3b8;text-align:center';
  var h =
    '<div style="' + cs + '">' +
    '<div style="' + hs + '">Company</div>' +
    '<p style="' + ps + '"><strong>Smartordi OG</strong><br>Steingasse 6a, 4020 Linz<br>Firmenbuchnummer: FN 675586 i<br>Firmenbuchgericht: Landesgericht Linz<br>Rechtsform: Offene Gesellschaft (OG)</p>' +
    '</div>' +
    '<div style="' + cs + '">' +
    '<div style="' + hs + '">Contact</div>' +
    '<p style="' + ps + '">E-Mail: <a href="mailto:team@smartordi.eu" style="' + as + '">team@smartordi.eu</a><br>Tel: <a href="tel:+436677624392" style="' + as + '">+43 667 762439293</a></p>' +
    '</div>' +
    '<div style="' + fs + '">&#169;&#65039; 2026 Smartordi OG &middot; Steingasse 6a, 4020 Linz &middot; FN 675586 i</div>';
  openLegalOverlay('Impressum', 'Angaben gemäß § 5 ECG', h);
}
function openContact() {
  var cs = 'background:#fff;border-radius:12px;padding:20px 24px;box-shadow:0 1px 4px rgba(0,0,0,0.06);margin-bottom:16px';
  var hs = 'font-size:15px;font-weight:700;color:#1e293b;margin:0 0 12px;padding-bottom:6px;border-bottom:2px solid #f0fdf4';
  var ps = 'font-size:14px;color:#475569;line-height:1.8;margin-bottom:0';
  var as = 'color:#0061a4;text-decoration:none';
  var fs = 'margin-top:48px;padding-top:20px;border-top:1px solid #e2e8f0;font-size:12px;color:#94a3b8;text-align:center';
  var h =
    '<div style="' + cs + '">' +
    '<div style="' + hs + '">Get in Touch</div>' +
    '<p style="' + ps + '"><strong>Smartordi OG</strong><br>Tel: <a href="tel:+436677624392" style="' + as + '">+43 667 762439293</a><br>E-Mail: <a href="mailto:team@smartordi.eu" style="' + as + '">team@smartordi.eu</a><br>Web: <a href="https://www.smartordiog.eu" target="_blank" style="' + as + '">www.smartordiog.eu</a></p>' +
    '</div>' +
    '<div style="' + fs + '">&#169;&#65039; 2026 Smartordi OG &middot; Steingasse 6a, 4020 Linz &middot; FN 675586 i</div>';
  openLegalOverlay('Contact', 'We are happy to help', h);
}
function openTerms() {
  var sh = 'font-size:15px;font-weight:700;color:#1e293b;margin:28px 0 8px;padding-bottom:6px;border-bottom:2px solid #f0fdf4';
  var ps = 'font-size:14px;color:#475569;line-height:1.8;margin-bottom:0';
  var as = 'color:#0061a4;text-decoration:none';
  var fs = 'margin-top:48px;padding-top:20px;border-top:1px solid #e2e8f0;font-size:12px;color:#94a3b8;text-align:center';
  var h =
    '<h2 style="' + sh + '">1. Acceptance of Terms</h2>' +
    '<p style="' + ps + '">By using Trabis, you agree to these Terms of Use. If you do not agree, please do not use the application.</p>' +
    '<h2 style="' + sh + '">2. Use of the Application</h2>' +
    '<p style="' + ps + '">Trabis is a business tracking tool intended for personal and small business use. You agree to use the application only for lawful purposes and in accordance with applicable laws and regulations.</p>' +
    '<h2 style="' + sh + '">3. Data Storage</h2>' +
    '<p style="' + ps + '">All data entered into Trabis is stored locally on your device using browser storage (localStorage). Smartordi OG does not collect, transmit, or store any of your business data on external servers. You are solely responsible for the backup and security of your data.</p>' +
    '<h2 style="' + sh + '">4. Limitation of Liability</h2>' +
    '<p style="' + ps + '">Smartordi OG is not liable for any loss of data, financial loss, or damage resulting from the use or inability to use Trabis. The application is provided as-is without warranties of any kind.</p>' +
    '<h2 style="' + sh + '">5. Changes to the Service</h2>' +
    '<p style="' + ps + '">Smartordi OG reserves the right to modify, suspend, or discontinue Trabis at any time without prior notice.</p>' +
    '<h2 style="' + sh + '">6. Governing Law</h2>' +
    '<p style="' + ps + '">These Terms of Use are governed by Austrian law. Any disputes shall be subject to the jurisdiction of the competent courts in Linz, Austria.</p>' +
    '<h2 style="' + sh + '">7. Contact</h2>' +
    '<p style="' + ps + '">For questions contact: <a href="mailto:team@smartordi.eu" style="' + as + '">team@smartordi.eu</a></p>' +
    '<div style="' + fs + '">&#169;&#65039; 2026 Smartordi OG &middot; Steingasse 6a, 4020 Linz &middot; FN 675586 i</div>';
  openLegalOverlay('Terms of Use', 'Last updated: June 2026 · Smartordi OG', h);
}
function openPrivacy() {
  var sh = 'font-size:15px;font-weight:700;color:#1e293b;margin:28px 0 8px;padding-bottom:6px;border-bottom:2px solid #f0fdf4';
  var ps = 'font-size:14px;color:#475569;line-height:1.8;margin-bottom:0';
  var as = 'color:#0061a4;text-decoration:none';
  var fs = 'margin-top:48px;padding-top:20px;border-top:1px solid #e2e8f0;font-size:12px;color:#94a3b8;text-align:center';
  var h =
    '<h2 style="' + sh + '">1. Controller</h2>' +
    '<p style="' + ps + '">Smartordi OG &middot; Steingasse 6a, 4020 Linz &middot; <a href="mailto:team@smartordi.eu" style="' + as + '">team@smartordi.eu</a></p>' +
    '<h2 style="' + sh + '">2. Data We Collect</h2>' +
    '<p style="' + ps + '">Trabis does not collect or transmit any personal or business data to external servers. All information you enter is stored exclusively on your own device using browser localStorage.</p>' +
    '<h2 style="' + sh + '">3. No Third-Party Sharing</h2>' +
    '<p style="' + ps + '">We do not share, sell, or transfer your data to any third party. Since all data remains on your device, no external access is possible by Smartordi OG or any other party.</p>' +
    '<h2 style="' + sh + '">4. Cookies and Tracking</h2>' +
    '<p style="' + ps + '">Trabis does not use cookies or any tracking technologies. No analytics, advertising, or usage tracking is implemented.</p>' +
    '<h2 style="' + sh + '">5. Your Rights (DSGVO/GDPR)</h2>' +
    '<p style="' + ps + '">You have the right to access, correct, and delete your data at any time through the Settings page in the application.</p>' +
    '<h2 style="' + sh + '">6. Data Security</h2>' +
    '<p style="' + ps + '">Your data is as secure as your own device. Smartordi OG cannot be held responsible for data loss due to device failure, browser clearing, or unauthorized access to your device.</p>' +
    '<h2 style="' + sh + '">7. Contact</h2>' +
    '<p style="' + ps + '">For privacy questions: <a href="mailto:team@smartordi.eu" style="' + as + '">team@smartordi.eu</a></p>' +
    '<div style="' + fs + '">&#169;&#65039; 2026 Smartordi OG &middot; Steingasse 6a, 4020 Linz &middot; FN 675586 i</div>';
  openLegalOverlay('Privacy Policy', 'Last updated: June 2026 · Smartordi OG', h);
}
initApp();

// ────────────────────────────────────────
// ── PWA: Manifest (inline blob) ──
// ────────────────────────────────────────
(function() {
  try {
    var svgIcon = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">'
      + '<defs><linearGradient id="pg" x1="0%25" y1="0%25" x2="100%25" y2="100%25"><stop offset="0%25" stop-color="%231a7fd4"/><stop offset="100%25" stop-color="%232196f3"/></linearGradient></defs>'
      + '<rect width="100" height="100" rx="22" fill="url(%23pg)"/>'
      + '<circle cx="50" cy="36" r="21" fill="none" stroke="white" stroke-width="3.5"/>'
      + '<rect x="38" y="56" width="24" height="3.5" rx="1.75" fill="white"/>'
      + '<rect x="40" y="62" width="20" height="3.5" rx="1.75" fill="white"/>'
      + '<rect x="42" y="68" width="16" height="3.5" rx="1.75" fill="white"/>'
      + '<text x="50" y="43" text-anchor="middle" font-size="21" font-weight="900" font-family="Arial,sans-serif" fill="white">%24</text>'
      + '<rect x="13" y="69" width="8" height="13" rx="2.5" fill="white" opacity="0.75"/>'
      + '<rect x="24" y="61" width="8" height="21" rx="2.5" fill="white" opacity="0.85"/>'
      + '<rect x="35" y="53" width="8" height="29" rx="2.5" fill="white" opacity="0.9"/>'
      + '<polyline points="17,73 28,57 40,63 60,37" fill="none" stroke="white" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/>'
      + '<path d="M60 37 L53 42 L57 49 Z" fill="white"/>'
      + '<path d="M14 16 L15.5 12 L17 16 L21 17.5 L17 19 L15.5 23 L14 19 L10 17.5 Z" fill="white" opacity="0.9"/>'
      + '<path d="M76 13 L77 10 L78 13 L81 14 L78 15 L77 18 L76 15 L73 14 Z" fill="white" opacity="0.8"/>'
      + '<path d="M84 28 L84.8 26 L85.6 28 L87.6 28.8 L85.6 29.6 L84.8 31.6 L84 29.6 L82 28.8 Z" fill="white" opacity="0.65"/>'
      + '</svg>';
    var manifest = {
      name: 'Trabis',
      short_name: 'Trabis',
      description: 'Business Tracking System',
      theme_color: '#0061a4',
      background_color: '#f4faff',
      display: 'standalone',
      orientation: 'portrait',
      start_url: './',
      icons: [
        {src:'data:image/svg+xml,'+svgIcon, sizes:'192x192', type:'image/svg+xml', purpose:'any'},
        {src:'data:image/svg+xml,'+svgIcon, sizes:'512x512', type:'image/svg+xml', purpose:'any maskable'}
      ]
    };
    var mBlob = new Blob([JSON.stringify(manifest)], {type:'application/manifest+json'});
    var mUrl = URL.createObjectURL(mBlob);
    var link = document.createElement('link');
    link.rel = 'manifest';
    link.href = mUrl;
    document.head.appendChild(link);
  } catch(e) {}
})();

// ── PWA: Service Worker (inline blob) ──
(function() {
  if(!('serviceWorker' in navigator)) return;
  try {
    var swCode = [
      "var CACHE_NAME='trabis-v2';",
      "self.addEventListener('install',function(e){",
      "  self.skipWaiting();",
      "});",
      "self.addEventListener('activate',function(e){",
      "  e.waitUntil(caches.keys().then(function(keys){",
      "    return Promise.all(keys.filter(function(k){ return k!==CACHE_NAME; }).map(function(k){ return caches.delete(k); }));",
      "  }).then(function(){ return clients.claim(); }));",
      "});",
      "self.addEventListener('fetch',function(e){",
      "  if(e.request.method!=='GET') return;",
      "  e.respondWith(",
      "    caches.open(CACHE_NAME).then(function(cache){",
      "      return fetch(e.request, {cache:'no-store'}).then(function(r){",
      "        if(r && r.status===200) cache.put(e.request,r.clone());",
      "        return r;",
      "      }).catch(function(){ return caches.match(e.request); });",
      "    })",
      "  );",
      "});",
    ].join('\n');
    var swBlob = new Blob([swCode], {type:'text/javascript'});
    var swUrl = URL.createObjectURL(swBlob);
    navigator.serviceWorker.register(swUrl).catch(function(){});
  } catch(e) {}
})();

// ── PWA: Install prompt ──
var _pwaPrompt = null;
window.addEventListener('beforeinstallprompt', function(e) {
  e.preventDefault();
  _pwaPrompt = e;
  var banner = document.getElementById('pwaInstallBanner');
  if(banner) banner.style.display = 'flex';
});
window.addEventListener('appinstalled', function() {
  var banner = document.getElementById('pwaInstallBanner');
  if(banner) banner.style.display = 'none';
});
function pwaInstall() {
  if(!_pwaPrompt) return;
  _pwaPrompt.prompt();
  _pwaPrompt.userChoice.then(function(){ _pwaPrompt = null; });
  var banner = document.getElementById('pwaInstallBanner');
  if(banner) banner.style.display = 'none';
}
function pwaDismiss() {
  var banner = document.getElementById('pwaInstallBanner');
  if(banner) banner.style.display = 'none';
}

// ═══════════════ THEME SYSTEM ═══════════════
function applyTheme() {
  var theme = state.theme || 'light';
  document.documentElement.className = 'theme-' + theme;
  var tog = document.getElementById('themeToggle');
  var ico = document.getElementById('theme-icon-wrap');
  if(tog) { tog.classList.toggle('on', theme==='dark'); }
  if(ico) ico.innerHTML = svgIcon(theme==='dark' ? 'sun' : 'moon', 18);
}
function toggleTheme() {
  state.theme = (state.theme==='dark') ? 'light' : 'dark';
  applyTheme();
  save();
  renderSettings();
}

// ═══════════════ TAX HELPERS ═══════════════

// ═══════════════ INVOICE DOWNLOAD (attached receipts, combined PDF) ═══════════════
var INVDL_L = {
  title: {en:'Attached Invoices', ar:'الفواتير المرفقة', de:'Angehängte Rechnungen'},
  intervalMonth: {en:'Monthly', ar:'شهري', de:'Monatlich'},
  intervalQuarter: {en:'Quarterly', ar:'ربع سنوي', de:'Vierteljährlich'},
  intervalYear: {en:'Yearly', ar:'سنوي', de:'Jährlich'},
  downloadExpenses: {en:'Download Expenses as PDF', ar:'تنزيل المصروفات كـ PDF', de:'Ausgaben als PDF herunterladen'},
  downloadIncome: {en:'Download Income as PDF', ar:'تنزيل الدخل كـ PDF', de:'Einnahmen als PDF herunterladen'},
  generating: {en:'Generating…', ar:'جاري الإنشاء…', de:'Wird erstellt…'},
  errorGen: {en:'Error generating the PDF.', ar:'حدث خطأ أثناء إنشاء الملف.', de:'Fehler beim Erstellen des PDFs.'},
  countLbl: {
    en:function(exp,inc){ return exp+' expense receipt(s) · '+inc+' income receipt(s) in the selected period'; },
    ar:function(exp,inc){ return exp+' إيصال مصروف · '+inc+' إيصال دخل في الفترة المختارة'; },
    de:function(exp,inc){ return exp+' Ausgabenbeleg(e) · '+inc+' Einnahmenbeleg(e) im gewählten Zeitraum'; },
  },
  expenseLbl: {en:'Expenses', ar:'مصروفات', de:'Ausgaben'},
  incomeLbl: {en:'Income', ar:'دخل', de:'Einnahmen'},
  expenseCaption: {en:'Expense', ar:'مصروف', de:'Ausgabe'},
  incomeCaption: {en:'Income', ar:'دخل', de:'Einnahme'},
  disclaimer: {en:'All receipts/invoices attached to transactions in the app (photo or PDF), grouped by period — expenses and income as two separate PDF files.', ar:'كل الإيصالات/الفواتير المرفقة بالمعاملات في التطبيق (صورة أو PDF)، مجمّعة حسب الفترة — المصروفات والدخل في ملفين PDF منفصلين.', de:'Alle Belege/Rechnungen, die im Programm an Transaktionen angehängt wurden (Foto oder PDF), gruppiert nach Zeitraum — Ausgaben und Einnahmen als zwei separate PDF-Dateien.'},
};
function invdltx(k) { return (INVDL_L[k] && INVDL_L[k][state.lang]) || (INVDL_L[k] && INVDL_L[k].en) || k; }

var _invDlInterval = 'month';
var _invDlPeriod = null;

function invDlPeriods(interval) {
  var years = {}; years[today().substring(0,4)] = true;
  (state.transactions||[]).forEach(function(tx){ if(tx && tx.date && (tx.receiptId || tx.invoice)) years[tx.date.substring(0,4)]=true; });
  var yearNums = Object.keys(years).map(Number);
  var minYear = Math.min.apply(null, yearNums), maxYear = Math.max.apply(null, yearNums);
  var keys = [];
  for(var y = minYear; y <= maxYear; y++) {
    if(interval === 'month') { for(var m = 1; m <= 12; m++) keys.push(y + '-' + ('0'+m).slice(-2)); }
    else if(interval === 'quarter') { for(var q = 1; q <= 4; q++) keys.push(y + '-Q' + q); }
    else keys.push(String(y));
  }
  return keys.sort().reverse();
}
function invDlReceiptsForPeriod(type, key, interval) {
  return (state.transactions||[]).filter(function(tx) {
    return tx && (tx.receiptId || tx.invoice) && tx.type === type && tx.date && uvaKeyForDate(tx.date, interval) === key;
  }).sort(function(a,b){ return (a.date||'') < (b.date||'') ? -1 : ((a.date||'') > (b.date||'') ? 1 : 0); });
}

function renderInvoiceDownloadSection() {
  var card = document.getElementById('invoiceDlCard');
  if(!card) return;
  if(!_invDlPeriod) _invDlPeriod = uvaKeyForDate(today(), _invDlInterval);
  var periods = invDlPeriods(_invDlInterval);
  if(periods.indexOf(_invDlPeriod) === -1) _invDlPeriod = periods[0];
  var exp = invDlReceiptsForPeriod('expense', _invDlPeriod, _invDlInterval);
  var inc = invDlReceiptsForPeriod('income', _invDlPeriod, _invDlInterval);
  var lang = state.lang;
  var countFn = INVDL_L.countLbl[lang] || INVDL_L.countLbl.en;

  var h = '<div class="report-card-title" style="margin-bottom:12px">' + escHtml(invdltx('title')) + '</div>';
  h += '<div style="display:flex;gap:8px;margin-bottom:10px;flex-wrap:wrap">';
  h += '<select id="invDlIntervalSel" style="flex:1;min-width:120px;padding:10px 12px;border-radius:10px;border:1.5px solid var(--border);background:var(--bg);color:var(--text);font-size:13px;box-sizing:border-box">';
  h += '<option value="month"' + (_invDlInterval==='month'?' selected':'') + '>' + escHtml(invdltx('intervalMonth')) + '</option>';
  h += '<option value="quarter"' + (_invDlInterval==='quarter'?' selected':'') + '>' + escHtml(invdltx('intervalQuarter')) + '</option>';
  h += '<option value="year"' + (_invDlInterval==='year'?' selected':'') + '>' + escHtml(invdltx('intervalYear')) + '</option>';
  h += '</select>';
  h += '<select id="invDlPeriodSel" style="flex:1;min-width:120px;padding:10px 12px;border-radius:10px;border:1.5px solid var(--border);background:var(--bg);color:var(--text);font-size:13px;box-sizing:border-box">';
  h += periods.map(function(k){ return '<option value="'+k+'"'+(k===_invDlPeriod?' selected':'')+'>'+uvaKeyLabel(k)+'</option>'; }).join('');
  h += '</select>';
  h += '</div>';
  h += '<div style="font-size:12.5px;color:var(--text3);margin-bottom:12px">' + escHtml(countFn(exp.length, inc.length)) + '</div>';
  h += '<button id="invDlExpBtn" style="width:100%;margin-bottom:8px;padding:12px;border-radius:12px;border:1.5px solid var(--border);background:var(--bg);color:var(--text);font-size:13px;font-weight:700;cursor:pointer"' + (!exp.length?' disabled':'') + '>' + svgIcon('download',14) + ' ' + escHtml(invdltx('downloadExpenses')) + '</button>';
  h += '<button id="invDlIncBtn" style="width:100%;padding:12px;border-radius:12px;border:1.5px solid var(--border);background:var(--bg);color:var(--text);font-size:13px;font-weight:700;cursor:pointer"' + (!inc.length?' disabled':'') + '>' + svgIcon('download',14) + ' ' + escHtml(invdltx('downloadIncome')) + '</button>';
  h += '<div id="invDlStatus" style="font-size:12.5px;color:var(--text3);margin-top:8px"></div>';
  h += '<div class="invoice-dl-disclaimer">' + escHtml(invdltx('disclaimer')) + '</div>';
  card.innerHTML = h;

  var ivSel = document.getElementById('invDlIntervalSel');
  var pSel = document.getElementById('invDlPeriodSel');
  if(ivSel) ivSel.onchange = function(){ _invDlInterval = ivSel.value; _invDlPeriod = null; renderInvoiceDownloadSection(); };
  if(pSel) pSel.onchange = function(){ _invDlPeriod = pSel.value; renderInvoiceDownloadSection(); };
  var expBtn = document.getElementById('invDlExpBtn');
  var incBtn = document.getElementById('invDlIncBtn');
  if(expBtn) expBtn.onclick = function(){ downloadInvoicesPdf('expense'); };
  if(incBtn) incBtn.onclick = function(){ downloadInvoicesPdf('income'); };
}

function imageBlobToDataUrl(blob) {
  return new Promise(function(resolve, reject) {
    var reader = new FileReader();
    reader.onload = function() { resolve(reader.result); };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}
function imageDimensionsFromDataUrl(dataUrl) {
  return new Promise(function(resolve) {
    var img = new Image();
    img.onload = function() { resolve({w: img.naturalWidth || 800, h: img.naturalHeight || 1131}); };
    img.onerror = function() { resolve({w: 800, h: 1131}); }; // A4-ish fallback ratio
    img.src = dataUrl;
  });
}

function downloadInvoicesPdf(type) {
  var statusEl = document.getElementById('invDlStatus');
  var JsPdf = (window.jspdf && window.jspdf.jsPDF) ? window.jspdf.jsPDF : (window.jsPDF || null);
  if(!JsPdf) return;
  var list = invDlReceiptsForPeriod(type, _invDlPeriod, _invDlInterval);
  if(!list.length) return;
  var lang = state.lang;
  var typeLbl = type === 'expense' ? invdltx('expenseLbl') : invdltx('incomeLbl');
  var captionLbl = type === 'expense' ? invdltx('expenseCaption') : invdltx('incomeCaption');

  var doc = new JsPdf({orientation:'p', unit:'mm', format:'a4'});
  doc.setFontSize(18); doc.setFont(undefined,'bold');
  doc.text(typeLbl + ' — ' + (state.businessName||''), 14, 24);
  doc.setFontSize(11); doc.setFont(undefined,'normal');
  doc.text(uvaKeyLabel(_invDlPeriod), 14, 34);
  doc.text(String(list.length), 14, 42);
  doc.setFontSize(9); doc.setTextColor(140);
  doc.text(new Date().toLocaleDateString(), 14, 52);
  doc.setTextColor(0);

  function jsPdfImageFormat(dataUrl) {
    var m = /^data:image\/([a-zA-Z0-9.+-]+);/.exec(dataUrl || '');
    var ext = m ? m[1].toUpperCase() : 'JPEG';
    if(ext === 'JPG') ext = 'JPEG';
    if(ext !== 'JPEG' && ext !== 'PNG' && ext !== 'WEBP' && ext !== 'BMP') ext = 'JPEG';
    return ext;
  }
  function addImagePage(dataUrl, dims, caption) {
    var isLandscape = dims.w > dims.h;
    doc.addPage('a4', isLandscape ? 'l' : 'p');
    var pageW = doc.internal.pageSize.getWidth();
    var pageH = doc.internal.pageSize.getHeight();
    var margin = 12;
    doc.setFontSize(9); doc.setFont(undefined,'normal'); doc.setTextColor(90);
    doc.text(caption, margin, margin, {maxWidth: pageW - margin*2});
    doc.setTextColor(0);
    var top = margin + 8;
    var usableW = pageW - margin*2, usableH = pageH - top - margin;
    var ratio = Math.min(usableW / dims.w, usableH / dims.h);
    var drawW = dims.w * ratio, drawH = dims.h * ratio;
    doc.addImage(dataUrl, jsPdfImageFormat(dataUrl), margin + (usableW-drawW)/2, top + (usableH-drawH)/2, drawW, drawH);
  }
  // Two separate attachment mechanisms feed the transaction list: the OCR receipt-scan
  // (tx.receiptId, IndexedDB blob) and the generic "Attach Invoice" upload (tx.invoice,
  // a dataURL stored directly on the transaction). Normalize both to {blob, type}.
  function attachmentBlobForTx(tx) {
    if(tx.receiptId) {
      return receiptGet(tx.receiptId).then(function(rec) {
        return (rec && rec.blob) ? {blob: rec.blob, type: rec.type} : null;
      });
    }
    if(tx.invoice) {
      return fetch(tx.invoice).then(function(resp) { return resp.blob(); }).then(function(blob) {
        return {blob: blob, type: blob.type};
      }).catch(function(){ return null; });
    }
    return Promise.resolve(null);
  }
  function processGroup(list) {
    return list.reduce(function(chain, tx) {
      return chain.then(function() {
        return attachmentBlobForTx(tx).then(function(att) {
          if(!att || !att.blob) return; // attachment not on this device — skip silently, same as the single viewer does
          var caption = captionLbl + ' · ' + formatDateDisplay(tx.date) + ' · ' + (tx.name||'') + ' · ' + fmt(tx.amount);
          if(att.type === 'application/pdf') {
            return pdfPagesToImageBlobs(att.blob).then(function(blobs) {
              return blobs.reduce(function(c2, blob, idx) {
                return c2.then(function() {
                  return imageBlobToDataUrl(blob).then(function(url) {
                    return imageDimensionsFromDataUrl(url).then(function(dims) {
                      addImagePage(url, dims, caption + (blobs.length>1 ? ' (' + (idx+1) + '/' + blobs.length + ')' : ''));
                    });
                  });
                });
              }, Promise.resolve());
            }).catch(function(){});
          }
          return imageBlobToDataUrl(att.blob).then(function(url) {
            return imageDimensionsFromDataUrl(url).then(function(dims) { addImagePage(url, dims, caption); });
          });
        });
      });
    }, Promise.resolve());
  }

  if(statusEl) statusEl.textContent = invdltx('generating');
  processGroup(list).then(function() {
    doc.save(typeLbl + '_' + _invDlPeriod + '.pdf');
    if(statusEl) statusEl.textContent = '';
  }).catch(function() {
    if(statusEl) statusEl.textContent = invdltx('errorGen');
  });
}

// ═══════════════ ENHANCED EXPORT ═══════════════

function doExportPDF() {
  var period = (document.getElementById('exp-period-sel')||{}).value || state.reportPeriod || 'month';
  var prevPeriod = state.reportPeriod;
  state.reportPeriod = period;
  var txs = getReportFiltered();
  var income = txs.filter(function(t){return t.type==='income';}).reduce(function(s,t){return s+t.amount;},0);
  var txExp  = txs.filter(function(t){return t.type==='expense';}).reduce(function(s,t){return s+t.amount;},0);
  var rp = period;
  var fixedCostsR=0, fixedIncR=0;
  if(rp==='month'){
    fixedCostsR=state.recurring.reduce(function(s,r){return s+(parseFloat(r.amount)||0);},0)+state.employees.reduce(function(s,e){return s+(parseFloat(e.salary)||0);},0);
    fixedIncR=(state.fixedIncome||[]).reduce(function(s,fi){return s+(parseFloat(fi.amount)||0);},0);
  } else if(rp==='quarter'){
    fixedCostsR=(state.recurring.reduce(function(s,r){return s+(parseFloat(r.amount)||0);},0)+state.employees.reduce(function(s,e){return s+(parseFloat(e.salary)||0);},0))*3;
    fixedIncR=(state.fixedIncome||[]).reduce(function(s,fi){return s+(parseFloat(fi.amount)||0);},0)*3;
  } else if(rp==='year'){
    fixedCostsR=(state.recurring.reduce(function(s,r){return s+(parseFloat(r.amount)||0);},0)+state.employees.reduce(function(s,e){return s+(parseFloat(e.salary)||0);},0))*12;
    fixedIncR=(state.fixedIncome||[]).reduce(function(s,fi){return s+(parseFloat(fi.amount)||0);},0)*12;
  }
  income += fixedIncR;
  var expense = txExp + fixedCostsR;
  var net = income - expense;
  var margin2 = income > 0 ? ((net/income)*100).toFixed(1)+'%' : '0%';
  var r = {
    id:Date.now(), date:today(), period:period,
    businessName:state.businessName||'',
    username:localStorage.getItem('smartac_user')||'',
    summary:{income:income,expenses:expense,netProfit:net,profitMargin:margin2,transactions:txs.length},
    generatedAt:new Date().toISOString()
  };
  state.reportPeriod = prevPeriod;
  document.getElementById('exportOverlay').classList.remove('open');
  generateReportPDF(r);
}

function doExport(action) {
  var lang = state.lang;
  var period = (document.getElementById('exp-period-sel')||{}).value || state.reportPeriod || 'month';
  var prevPeriod = state.reportPeriod;
  state.reportPeriod = period;
  var txs = getReportFiltered();
  var income = txs.filter(function(t){return t.type==='income';}).reduce(function(s,t){return s+t.amount;},0);
  var expense = txs.filter(function(t){return t.type==='expense';}).reduce(function(s,t){return s+t.amount;},0);
  var net = income - expense;
  var periodLabels = {day:{en:'Today',ar:'اليوم',de:'Heute'},week:{en:'This Week',ar:'هذا الأسبوع',de:'Diese Woche'},month:{en:'This Month',ar:'هذا الشهر',de:'Diesen Monat'},quarter:{en:'This Quarter',ar:'هذا الربع',de:'Dieses Quartal'},year:{en:'This Year',ar:'هذا العام',de:'Dieses Jahr'}};
  var periodLbl = (periodLabels[period]&&periodLabels[period][lang])||period;
  var biz = state.businessName || localStorage.getItem('smartac_user') || 'Trabis';
  var date = new Date().toLocaleDateString();
  var reportText = '*Trabis Report — ' + biz + '*\n'
    + 'Period: ' + periodLbl + '\n'
    + t('totalIncome') + ': ' + fmt(income) + '\n'
    + t('totalExpenses') + ': ' + fmt(expense) + '\n'
    + t('netProfit') + ': ' + fmt(net) + '\n'
    + 'Generated: ' + date;
  if(action === 'whatsapp') {
    document.getElementById('exportOverlay').classList.remove('open');
    window.open('https://wa.me/?text=' + encodeURIComponent(reportText));
  } else if(action === 'email') {
    var subject = 'Trabis Report — ' + biz + ' — ' + periodLbl;
    document.getElementById('exportOverlay').classList.remove('open');
    window.location.href = 'mailto:?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(reportText);
  } else if(action === 'print') {
    document.getElementById('exportOverlay').classList.remove('open');
    var user = localStorage.getItem('smartac_user') || '';
    var userLbl = lang==='ar'?'المستخدم':lang==='de'?'Benutzer':'User';
    var periodLblPr = lang==='ar'?'الفترة':lang==='de'?'Zeitraum':'Period';
    var el = document.getElementById('print-period-info');
    var printBizEl = document.getElementById('print-biz-name');
    if(printBizEl) printBizEl.textContent = biz || user;
    var printDateEl = document.getElementById('print-date-lbl');
    if(printDateEl) printDateEl.textContent = date;
    if(el) el.textContent = periodLblPr+': '+periodLbl+' · '+userLbl+': '+user;
    setTimeout(function(){ window.print(); }, 100);
  }
  state.reportPeriod = prevPeriod;
}

// ═══════════════ PRIVACY POLICY TRANSLATIONS ═══════════════
function updatePrivacyTexts() {
  var lang = state.lang;
  var privText = document.getElementById('lp-privacy-text');
  if(privText) {
    var agreeText = {en:'I agree to the ',ar:'أوافق على ',de:'Ich stimme der '}[lang]||'I agree to the ';
    var andText = {en:' and ',ar:' و',de:' und den '}[lang]||' and ';
    var ppLbl = {en:'Privacy Policy',ar:'سياسة الخصوصية',de:'Datenschutzrichtlinie'}[lang]||'Privacy Policy';
    var tmLbl = {en:'Terms of Use',ar:'شروط الاستخدام',de:'Nutzungsbedingungen'}[lang]||'Terms of Use';
    privText.innerHTML = agreeText+'<span class="lp-privacy-link" onclick="document.getElementById(\'privacyModal\').classList.add(\'open\')">'+ppLbl+'</span>'+andText+'<span class="lp-privacy-link" onclick="document.getElementById(\'termsModal\').classList.add(\'open\')">'+tmLbl+'</span>';
  }
  var ppTitle = document.getElementById('pp-title');
  if(ppTitle) ppTitle.textContent = {en:'Privacy Policy',ar:'سياسة الخصوصية',de:'Datenschutzrichtlinie'}[lang]||'Privacy Policy';
  var ppList = document.getElementById('pp-list');
  if(ppList) ppList.innerHTML = {
    en:'<li>All data is stored locally on your device only.</li><li>No data is sent to any server.</li><li>You are responsible for your own data backup.</li><li>The app does not collect personal information externally.</li>',
    ar:'<li>يتم تخزين جميع البيانات محلياً على جهازك فقط.</li><li>لا يتم إرسال أي بيانات إلى أي خادم.</li><li>أنت مسؤول عن نسخ بياناتك الاحتياطية.</li><li>التطبيق لا يجمع معلومات شخصية خارجياً.</li>',
    de:'<li>Alle Daten werden nur lokal auf Ihrem Gerät gespeichert.</li><li>Es werden keine Daten an Server gesendet.</li><li>Sie sind für die Sicherung Ihrer Daten verantwortlich.</li><li>Die App sammelt keine persönlichen Daten extern.</li>',
  }[lang]||'';
  var tmTitle = document.getElementById('tm-title');
  if(tmTitle) tmTitle.textContent = {en:'Terms of Use',ar:'شروط الاستخدام',de:'Nutzungsbedingungen'}[lang]||'Terms of Use';
  var tmList = document.getElementById('tm-list');
  if(tmList) tmList.innerHTML = {
    en:'<li>App is provided as-is for business tracking purposes.</li><li>You are responsible for tax compliance in your country.</li><li>Trabis / Smartordi OG is not liable for financial decisions.</li>',
    ar:'<li>يُقدَّم التطبيق كما هو لأغراض تتبع الأعمال.</li><li>أنت مسؤول عن الامتثال الضريبي في بلدك.</li><li>Trabis / Smartordi OG غير مسؤول عن القرارات المالية.</li>',
    de:'<li>Die App wird für Geschäftsverfolgungszwecke bereitgestellt.</li><li>Sie sind für die Steuerkonformität in Ihrem Land verantwortlich.</li><li>Trabis / Smartordi OG haftet nicht für finanzielle Entscheidungen.</li>',
  }[lang]||'';
  var ppClose = document.getElementById('pp-close');
  if(ppClose) ppClose.textContent = {en:'Close',ar:'إغلاق',de:'Schließen'}[lang]||'Close';
  var tmClose = document.getElementById('tm-close');
  if(tmClose) tmClose.textContent = {en:'Close',ar:'إغلاق',de:'Schließen'}[lang]||'Close';
}

// ═══════════════ BUSINESS NAME DISPLAY ═══════════════
function updateBusinessNameDisplay() {
  var biz = state.businessName || '';
  setTimeout(artSyncTopbar, 0);
  var snavBiz = document.getElementById('snav-biz-name');
  if(snavBiz) snavBiz.textContent = biz;
  var hdrBiz = document.getElementById('hdr-biz-name');
  if(hdrBiz) { hdrBiz.textContent = biz; hdrBiz.style.display = biz ? '' : 'none'; }
  var hdrMobileUser = document.getElementById('hdr-mobile-user');
  if(hdrMobileUser) {
    var sUser = localStorage.getItem('smartac_user') || '';
    hdrMobileUser.textContent = biz || sUser;
  }
  // Dashboard greeting
  var greet = document.getElementById('dashboard-greeting');
  if(greet) {
    var lang = state.lang;
    var prefix = lang==='ar' ? 'مرحباً، ' : lang==='de' ? 'Willkommen, ' : 'Welcome, ';
    if(biz) {
      var logoImg = state.businessLogo ? '<img src="' + state.businessLogo + '" style="width:32px;height:32px;border-radius:50%;object-fit:cover">' : '';
      greet.innerHTML = logoImg + '<span>' + escHtml(prefix + biz) + '</span>';
      greet.style.display = 'flex';
      greet.style.alignItems = 'center';
      greet.style.gap = '8px';
    } else {
      greet.innerHTML = '';
      greet.style.display = 'none';
    }
  }
}

// ═══════════════ CLIENT PROFILE ═══════════════



// ═══════════════ SAVED REPORTS ═══════════════

// ═══════════════ SUPPLIERS ═══════════════
var _editingSupplierId = null;








// ═══════════════ PDF GENERATION ═══════════════
function _pdfFmt(n) {
  var cur = state.currency || '€';
  if(n === undefined || n === null || isNaN(n)) n = 0;
  return cur + ' ' + parseFloat(n).toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2});
}

function generateReportPDF(r) {
  var jsPDF = (window.jspdf && window.jspdf.jsPDF) ? window.jspdf.jsPDF : (window.jsPDF || null);
  if(!jsPDF) { showToast('PDF library not loaded', 'error'); return; }

  var doc = new jsPDF({ orientation:'p', unit:'mm', format:'a4' });
  var pageW = doc.internal.pageSize.getWidth();
  var margin = 14;
  var col2 = pageW - margin;
  var y = 0;

  // ── HEADER ──
  doc.setFillColor(26, 122, 82);
  doc.rect(0, 0, pageW, 32, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text('Trabis', margin, 13);
  var biz = (r.businessName || r.username || '').replace(/[^\x20-\x7E]/g, '');
  if(!biz) biz = 'Business Report';
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(biz.substring(0, 50), margin, 21);
  var periodLabels = {day:'Daily', week:'Weekly', month:'Monthly', quarter:'Quarterly', year:'Yearly'};
  var pLbl = periodLabels[r.period] || r.period || 'Report';
  doc.setFontSize(9);
  doc.setTextColor(200, 240, 210);
  doc.text(pLbl + '  ·  ' + (r.date || ''), margin, 28);
  doc.setTextColor(200, 240, 210);
  doc.text('Generated: ' + (r.generatedAt ? r.generatedAt.substring(0,10) : r.date || ''), col2, 28, {align:'right'});

  y = 40;

  // ── DIVIDER ──
  function hRule(yy, r, g, b) {
    doc.setDrawColor(r||200, g||230, b||200);
    doc.setLineWidth(0.4);
    doc.line(margin, yy, col2, yy);
    return yy + 4;
  }

  // ── SECTION TITLE ──
  function sectionTitle(text, yy) {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(26, 122, 82);
    doc.text(text, margin, yy);
    return hRule(yy + 3, 180, 220, 180);
  }

  // ── TWO-COLUMN ROW ──
  function row2(lbl, val, yy, valColor) {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(90, 100, 90);
    doc.text(lbl, margin, yy);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    if(valColor) doc.setTextColor(valColor[0], valColor[1], valColor[2]);
    else doc.setTextColor(30, 40, 30);
    doc.text(val, col2, yy, {align:'right'});
    doc.setTextColor(30, 40, 30);
    return yy + 7;
  }

  // ── SUMMARY ──
  y = sectionTitle('• Summary', y);
  var s = r.summary || {};
  var net = s.netProfit || 0;
  var netColor = net >= 0 ? [26,122,82] : [180,30,30];
  y = row2('Total Income',       _pdfFmt(s.income || 0),    y, [26,122,82]);
  y = row2('Total Expenses',     _pdfFmt(s.expenses || 0),  y, [180,30,30]);
  y = row2('Net Profit',         _pdfFmt(net),               y, netColor);
  y = row2('Profit Margin',      s.profitMargin || '0%',     y);
  y = row2('Transactions',       String(s.transactions || 0),y);
  y = row2('Currency',           state.currency || '€', y);

  y += 4;

  // ── DISCLAIMER ──
  y += 2;
  doc.setDrawColor(220, 220, 200);
  doc.setLineWidth(0.3);
  doc.line(margin, y, col2, y);
  y += 5;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(140, 140, 120);
  var discl = 'This report reflects the data entered in Trabis. Smartordi OG is not liable for decisions made based on it.';
  var splitDiscl = doc.splitTextToSize(discl, col2 - margin);
  doc.text(splitDiscl, margin, y);
  y += splitDiscl.length * 4 + 2;

  // ── FOOTER ──
  var pageH = doc.internal.pageSize.getHeight();
  doc.setFillColor(240, 248, 240);
  doc.rect(0, pageH - 12, pageW, 12, 'F');
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(100, 140, 100);
  doc.text('Generated by Trabis  ·  ' + (r.generatedAt ? r.generatedAt.substring(0,10) : r.date || ''), margin, pageH - 5);
  doc.text(r.username || '', col2, pageH - 5, {align:'right'});

  // ── SAVE ──
  var bizSlug = (r.businessName || r.username || 'trabis').replace(/[^a-zA-Z0-9_-]/g, '-').substring(0,30);
  var fname = 'trabis-report-' + bizSlug + '-' + (r.date||'') + '-' + (r.period||'report') + '.pdf';
  doc.save(fname);
}

// Called from export dialog "PDF" button



// ── GENERIC CONFIRM DIALOG ──
var DELETE_CONFIRM_TITLE = {en:'Delete', ar:'حذف', de:'Löschen'};
function confirmAsync(title, msg, okLabel, cancelLabel) {
  return new Promise(function(resolve) {
    showConfirm(title, msg, function(){ resolve(true); }, okLabel, cancelLabel, function(){ resolve(false); });
  });
}
function showConfirm(title, msg, onOk, okLabel, cancelLabel, onCancel) {
  var lang = state.lang;
  var titleEl = document.getElementById('confirmTitle');
  var msgEl   = document.getElementById('confirmMsg');
  var okBtn   = document.getElementById('confirmOk');
  var cancelBtn = document.getElementById('confirmCancel');
  if(titleEl) titleEl.textContent = title;
  if(msgEl)   msgEl.textContent = msg;
  if(okBtn)   okBtn.textContent = okLabel || {en:'Confirm',ar:'تأكيد',de:'Bestätigen'}[lang]||'Confirm';
  if(cancelBtn) cancelBtn.textContent = cancelLabel || {en:'Cancel',ar:'إلغاء',de:'Abbrechen'}[lang]||'Cancel';
  var overlay = document.getElementById('confirmOverlay');
  if(overlay) overlay.classList.add('open');
  if(okBtn) okBtn.onclick = function(){
    overlay.classList.remove('open');
    if(onOk) onOk();
  };
  if(cancelBtn) cancelBtn.onclick = function(){
    overlay.classList.remove('open');
    if(onCancel) onCancel();
  };
}



// ── CLEAR DATA SECURE ──
function clearData() {
  var lang = state.lang;
  var titles = {en:'Clear All Data',ar:'مسح كل البيانات',de:'Alle Daten löschen'};
  var msgs = {
    en:'This will permanently delete ALL your transactions, debts, clients, reports, and settings. This action CANNOT be undone.',
    ar:'سيتم حذف جميع معاملاتك والديون والعملاء والتقارير والإعدادات بشكل نهائي. هذا الإجراء لا يمكن التراجع عنه.',
    de:'Alle Ihre Transaktionen, Schulden, Kunden, Berichte und Einstellungen werden dauerhaft gelöscht. Diese Aktion kann NICHT rückgängig gemacht werden.'
  };
  var t1El = document.getElementById('cd-title1');
  var m1El = document.getElementById('cd-msg1');
  var yesEl = document.getElementById('cd-btn-yes');
  var c1El  = document.getElementById('cd-btn-cancel1');
  var c2El  = document.getElementById('cd-btn-cancel2');
  var t2El  = document.getElementById('cd-title2');
  var m2El  = document.getElementById('cd-msg2');
  var confEl = document.getElementById('cd-confirm-btn');
  var pwErr  = document.getElementById('cd-pw-error');
  var pwInp  = document.getElementById('cd-pw-input');
  if(t1El) t1El.textContent = titles[lang]||titles.en;
  if(m1El) m1El.textContent = msgs[lang]||msgs.en;
  if(yesEl) yesEl.textContent = {en:'Yes, Continue',ar:'نعم، متابعة',de:'Ja, weiter'}[lang]||'Yes, Continue';
  if(c1El) c1El.textContent = {en:'Cancel',ar:'إلغاء',de:'Abbrechen'}[lang]||'Cancel';
  if(c2El) c2El.textContent = {en:'Cancel',ar:'إلغاء',de:'Abbrechen'}[lang]||'Cancel';
  if(t2El) t2El.textContent = {en:'Confirm with Password',ar:'تأكيد بكلمة المرور',de:'Mit Passwort bestätigen'}[lang]||'Confirm with Password';
  if(m2El) m2El.textContent = {en:'Enter your password to confirm deletion',ar:'أدخل كلمة المرور للتأكيد',de:'Passwort zur Bestätigung eingeben'}[lang]||'Enter your password to confirm deletion';
  if(confEl) confEl.textContent = {en:'Confirm Delete',ar:'تأكيد الحذف',de:'Löschen bestätigen'}[lang]||'Confirm Delete';
  if(pwErr)  { pwErr.style.display='none'; pwErr.textContent=''; }
  if(pwInp)  { pwInp.value=''; pwInp.type='password'; }
  if(confEl) { confEl.disabled=true; confEl.style.opacity='0.5'; }
  // Reset to step 1
  var s1 = document.getElementById('cd-step1');
  var s2 = document.getElementById('cd-step2');
  if(s1) s1.style.display='';
  if(s2) s2.style.display='none';
  document.getElementById('clearDataOverlay').classList.add('open');
  // Wire password input
  if(pwInp) pwInp.oninput = function(){
    var ok = pwInp.value.length > 0;
    if(confEl){ confEl.disabled=!ok; confEl.style.opacity=ok?'1':'0.5'; }
  };
}
function cdStep2() {
  document.getElementById('cd-step1').style.display='none';
  document.getElementById('cd-step2').style.display='';
}
function cdTogglePw(btn) {
  var inp = document.getElementById('cd-pw-input');
  if(!inp) return;
  inp.type = inp.type==='password' ? 'text' : 'password';
  btn.innerHTML = svgIcon(inp.type==='password' ? 'eye' : 'eyeOff', 16);
}
function cdConfirmDelete() {
  var lang = state.lang;
  var user = localStorage.getItem('smartac_user')||'';
  var accounts = JSON.parse(localStorage.getItem('smartac_accounts')||'{}');
  var acc = accounts[user];
  var inp = document.getElementById('cd-pw-input');
  var errEl = document.getElementById('cd-pw-error');
  var pw = inp ? inp.value : '';
  var stored = acc ? acc.password : '';
  var correct = stored ? (btoa(unescape(encodeURIComponent(pw))) === stored) : (pw.length > 0);
  if(!correct) {
    var errMsg = {en:'Incorrect password. Data was NOT deleted.',ar:'كلمة المرور غير صحيحة. لم يتم حذف البيانات.',de:'Falsches Passwort. Daten wurden NICHT gelöscht.'}[lang]||'Incorrect password.';
    if(errEl){ errEl.innerHTML = svgIcon('xCircle', 13) + ' ' + errMsg; errEl.style.display=''; }
    return;
  }
  // Correct — clear all data
  state.transactions=[]; state.debts=[]; state.clients=[]; state.suppliers=[]; state.employees=[]; state.fleet=[]; state.assets=[]; state.inventory=[];
  state.recurring=[]; state.budgets={}; state.fixedIncome=[]; state.vatPayments=[]; state.pendingInvoice=null; state.pendingInvoiceName=null;
  state.issuedInvoices=[]; state.receipts=[]; state.receivedInvoices=[]; state.businessLogo=null;
  state.businessAddress=''; state.businessTaxId=''; state.businessPhone=''; state.businessEmail='';
  state.bankName=''; state.bankIban=''; state.bankBic=''; state.bankAccountHolder=''; state.businessType='';
  ['tx','debts','currency','clients','suppliers','employees','recurring','budgets','lang','tax','theme','fixed_income','issued_inv','receipts','received_inv','logo','bizAddress','bizTaxId','bizPhone','bizEmail','bankName','bankIban','bankBic','bankHolder','businessType'].forEach(function(k){
    localStorage.removeItem(uk(k));
  });
  save();
  document.getElementById('clearDataOverlay').classList.remove('open');
  var okMsg = {en:'All data cleared.',ar:'تم مسح كل البيانات.',de:'Alle Daten gelöscht.'}[lang]||'All data cleared.';
  showToast(okMsg, 'success');
  renderHome(); showNav('home');
}

// ── DEBT EDIT & DELETE ──
function openEditDebt(id) {
  var lang = state.lang;
  var d = state.debts.find(function(x){return x.id===id;});
  if(!d) return;
  document.getElementById('ed-person').value  = d.person||'';
  document.getElementById('ed-amount').value  = d.amount||'';
  document.getElementById('ed-date').value    = d.date||'';
  document.getElementById('ed-type').value    = d.type||'owes-me';
  document.getElementById('ed-notes').value   = d.notes||'';
  document.getElementById('ed-debt-id').value = id;
  // Translate labels
  var titleEl = document.getElementById('edit-debt-title');
  if(titleEl) titleEl.textContent = {en:'Edit Debt',ar:'تعديل الدين',de:'Schuld bearbeiten'}[lang]||'Edit Debt';
  var owesOpt = document.getElementById('ed-opt-owes');
  var ioweOpt = document.getElementById('ed-opt-iowe');
  if(owesOpt) owesOpt.textContent = {en:'Owes Me',ar:'دائن لي',de:'Schuldet mir'}[lang]||'Owes Me';
  if(ioweOpt) ioweOpt.textContent = {en:'I Owe',ar:'أنا مدين',de:'Ich schulde'}[lang]||'I Owe';
  var saveEl = document.getElementById('ed-save-btn');
  if(saveEl) saveEl.textContent = {en:'Save',ar:'حفظ',de:'Speichern'}[lang]||'Save';
  document.getElementById('editDebtOverlay').classList.add('open');
}
function saveEditDebt() {
  var id = parseInt(document.getElementById('ed-debt-id').value)||0;
  if(!id) return;
  var d = state.debts.find(function(x){return x.id===id;});
  if(!d) return;
  d.person = document.getElementById('ed-person').value.trim()||d.person;
  d.amount = parseFloat(document.getElementById('ed-amount').value)||d.amount;
  d.date   = document.getElementById('ed-date').value||d.date;
  d.type   = document.getElementById('ed-type').value||d.type;
  d.notes  = document.getElementById('ed-notes').value.trim();
  save();
  document.getElementById('editDebtOverlay').classList.remove('open');
  renderDebtsPage();
}
function deleteDebt(id) {
  var lang = state.lang;
  var d = state.debts.find(function(x){return x.id===id;});
  if(!d) return;
  var msgs = {
    en:'Delete debt for '+d.person+' ('+fmt(d.amount)+')? This cannot be undone.',
    ar:'حذف دين '+d.person+' ('+fmt(d.amount)+')؟ لا يمكن التراجع.',
    de:'Schuld für '+d.person+' ('+fmt(d.amount)+') löschen? Nicht rückgängig machbar.'
  };
  var titles = {en:'Delete Debt',ar:'حذف الدين',de:'Schuld löschen'};
  showConfirm(titles[lang]||titles.en, msgs[lang]||msgs.en, function(){
    state.debts = state.debts.filter(function(x){return x.id!==id;});
    save(); renderDebtsPage();
  }, {en:'Delete',ar:'حذف',de:'Löschen'}[lang]||'Delete');
}

// ── DEBT MARK AS PAID (enhanced) ──
function markDebtPaid(id) {
  var lang = state.lang;
  var d = state.debts.find(function(x){return x.id===id;});
  if(!d) return;
  var msgs = {
    en:"Mark "+d.person+"'s debt of "+fmt(d.amount)+" as paid?",
    ar:"تحديد دين "+d.person+" بمبلغ "+fmt(d.amount)+" كمدفوع؟",
    de:d.person+"s Schuld von "+fmt(d.amount)+" als bezahlt markieren?"
  };
  var titles = {en:'Mark as Paid',ar:'تحديد كمدفوع',de:'Als bezahlt markieren'};
  showConfirm(titles[lang]||titles.en, msgs[lang]||msgs.en, function(){
    d.status = 'paid';
    // Record payment as transaction
    var isOwesMe = d.type !== 'i-owe';
    var txType = isOwesMe ? 'income' : 'expense';
    var descPfx = isOwesMe
      ? {en:'Payment from ',ar:'دفعة من ',de:'Zahlung von '}[lang]||'Payment from '
      : {en:'Payment to ',ar:'دفعة إلى ',de:'Zahlung an '}[lang]||'Payment to ';
    state.transactions.push({
      id: Date.now(),
      name: descPfx + d.person,
      amount: d.amount,
      type: txType,
      category: 'Other',
      date: today(),
      invoice: null, invoiceName: null
    });
    save();
    var successMsg = {
      en:'Debt marked as paid and recorded in transactions',
      ar:'تم تحديد الدين كمدفوع وتسجيله في المعاملات',
      de:'Schuld als bezahlt markiert und in Transaktionen erfasst'
    }[lang]||'Debt marked as paid';
    renderDebtsPage();
    renderHome();
    setTimeout(function(){ showToast(successMsg, 'success'); }, 100);
  }, {en:'Confirm',ar:'تأكيد',de:'Bestätigen'}[lang]||'Confirm');
}




// -- SIDEBAR HOVER (desktop) / TOGGLE (mobile) --
function openSidebar() {
  document.getElementById('sidebarNav').classList.add('open');
  if(window.innerWidth < 1024) document.getElementById('sidebarOverlay').classList.add('open');
}
function closeSidebar() {
  document.getElementById('sidebarNav').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('open');
}

(function initSidebar(){
  var nav     = document.getElementById('sidebarNav');
  var zone    = document.getElementById('sidebarHoverZone');
  var overlay = document.getElementById('sidebarOverlay');
  function isDesktop(){ return window.innerWidth >= 1024; }
  if(zone) zone.addEventListener('mouseenter', function(){ if(isDesktop()) openSidebar(); });
  if(nav)  nav.addEventListener('mouseleave',  function(){ if(isDesktop()) closeSidebar(); });
  if(overlay) overlay.addEventListener('click', closeSidebar);
  window.addEventListener('resize', function(){
    if(isDesktop()) overlay.classList.remove('open');
  });
})();
