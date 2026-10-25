// ════════════════════════════════════════
// ── LANDING PAGE ──
// ════════════════════════════════════════
var lpLang = localStorage.getItem('smartac_lang') || 'en';

var LP_TEXT = {
  en:{
    sub:'Business Tracking System',
    tagline:'Business Tracking System',
    headline:'Business Tracking System',
    desc:'Track income & expenses, manage debts, and make data-driven decisions with beautiful reports.',
    trusted:'Trusted by small businesses worldwide',
    learnMore:'Learn more ▼', showLess:'Show less ▲',
    f1:'Real-time income & expense tracking',
    f2:'Smart debt management',
    f3:'Visual reports & trends',
    f4:'Multi-language: English, العربية, Deutsch',
    defaultH:'Sign in or create account', defaultS:'Sign in or create your account',
    signIn:'Sign In', createAcc:'Create Account',
    loginH:'Welcome Back', loginS:'Sign in to your account',
    regH:'Create Account', regS:'Join thousands of businesses',
    langselH:'Choose Language', langselS:'You can change this anytime',
    back:'Back', continueBtn:'Continue <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-1px"><polyline points="9 18 15 12 9 6"/></svg>',
    or:'or', username:'Username', password:'Password',
    errUser:'Please enter a username', errPass:'Password must be at least 4 characters',
    errWrong:'Incorrect username or password', errExists:'Username already taken',
    version:'Trabis v1.5 · Business Tracking System',
    gotoLogin:'Sign In', gotoRegister:'Create Account',
    demoBtn:'Try the demo — no sign-up', demoNote:'Sample data on this device only. Nothing is sent anywhere.',
    fullName:'Full Name', email:'Email', phone:'Phone Number', country:'Country',
    confirmPass:'Confirm Password',
    showPw:'Show', hidePw:'Hide',
    pwReqLen:'At least 14 characters', pwReqUpper:'At least one uppercase letter (A-Z)',
    pwReqLower:'At least one lowercase letter (a-z)', pwReqNum:'At least one number (0-9)',
    pwReqSpecial:'At least one special character (!@#$%^&*)',
    pwWeak:'Weak', pwFair:'Fair', pwGood:'Good', pwStrong:'Strong',
  },
  ar:{
    sub:'نظام تتبع الأعمال',
    tagline:'نظام تتبع الأعمال',
    headline:'نظام تتبع الأعمال',
    desc:'تتبع الدخل والمصاريف، وأدر الديون، واتخذ قراراتك بناءً على تقارير جميلة.',
    trusted:'موثوق من قِبل الشركات الصغيرة حول العالم',
    learnMore:'اعرف أكثر ▼', showLess:'إخفاء ▲',
    f1:'تتبع الدخل والمصاريف فورياً',
    f2:'إدارة ذكية للديون',
    f3:'تقارير مرئية واتجاهات',
    f4:'متعدد اللغات: English, العربية, Deutsch',
    defaultH:'سجّل دخولك أو أنشئ حساباً', defaultS:'سجّل دخولك أو أنشئ حساباً جديداً',
    signIn:'تسجيل الدخول', createAcc:'إنشاء حساب',
    loginH:'مرحباً بعودتك', loginS:'سجّل دخولك',
    regH:'إنشاء حساب', regS:'انضم لآلاف الشركات',
    langselH:'اختر اللغة', langselS:'يمكنك تغييرها في أي وقت',
    back:'رجوع', continueBtn:'متابعة <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-1px"><polyline points="9 18 15 12 9 6"/></svg>',
    or:'أو', username:'اسم المستخدم', password:'كلمة المرور',
    errUser:'أدخل اسم المستخدم', errPass:'كلمة المرور 4 أحرف على الأقل',
    errWrong:'اسم المستخدم أو كلمة المرور غير صحيحة', errExists:'اسم المستخدم مستخدم بالفعل',
    version:'Trabis v1.5 · نظام تتبع الأعمال',
    gotoLogin:'تسجيل الدخول', gotoRegister:'إنشاء حساب',
    demoBtn:'جرّب الديمو — بدون تسجيل', demoNote:'بيانات تجريبية على هذا الجهاز فقط. ما بينبعت إشي لحدا.',
    fullName:'الاسم الكامل', email:'البريد الإلكتروني', phone:'رقم الهاتف', country:'الدولة',
    confirmPass:'تأكيد كلمة المرور',
    showPw:'إظهار', hidePw:'إخفاء',
    pwReqLen:'على الأقل 14 حرفاً', pwReqUpper:'حرف كبير واحد على الأقل (A-Z)',
    pwReqLower:'حرف صغير واحد على الأقل (a-z)', pwReqNum:'رقم واحد على الأقل (0-9)',
    pwReqSpecial:'رمز خاص واحد على الأقل (!@#$%^&*)',
    pwWeak:'ضعيفة', pwFair:'متوسطة', pwGood:'جيدة', pwStrong:'قوية',
  },
  de:{
    sub:'Geschäfts-Tracking-System',
    tagline:'Geschäfts-Tracking-System',
    headline:'Geschäfts-Tracking-System',
    desc:'Einnahmen & Ausgaben verfolgen, Schulden verwalten und datenbasierte Entscheidungen treffen.',
    trusted:'Von Kleinunternehmen weltweit vertraut',
    learnMore:'Mehr erfahren ▼', showLess:'Weniger anzeigen ▲',
    f1:'Echtzeit-Einnahmen & Ausgaben',
    f2:'Intelligentes Schuldenmanagement',
    f3:'Visuelle Berichte & Trends',
    f4:'Mehrsprachig: English, العربية, Deutsch',
    defaultH:'Anmelden oder Konto erstellen', defaultS:'Anmelden oder Konto erstellen',
    signIn:'Anmelden', createAcc:'Konto erstellen',
    loginH:'Willkommen zurück', loginS:'In Ihr Konto einloggen',
    regH:'Konto erstellen', regS:'Tausenden Unternehmen beitreten',
    langselH:'Sprache wählen', langselS:'Jederzeit änderbar',
    back:'Zurück', continueBtn:'Weiter <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-1px"><polyline points="9 18 15 12 9 6"/></svg>',
    or:'oder', username:'Benutzername', password:'Passwort',
    errUser:'Bitte Benutzernamen eingeben', errPass:'Passwort mind. 4 Zeichen',
    errWrong:'Falscher Benutzername oder Passwort', errExists:'Benutzername bereits vergeben',
    version:'Trabis v1.5 · Geschäfts-Tracking-System',
    gotoLogin:'Anmelden', gotoRegister:'Konto erstellen',
    demoBtn:'Demo ansehen — ohne Anmeldung', demoNote:'Beispieldaten nur auf diesem Gerät. Es wird nichts übertragen.',
    fullName:'Vollständiger Name', email:'E-Mail', phone:'Telefonnummer', country:'Land',
    confirmPass:'Passwort bestätigen',
    showPw:'Zeigen', hidePw:'Verbergen',
    pwReqLen:'Mindestens 14 Zeichen', pwReqUpper:'Mindestens ein Großbuchstabe (A-Z)',
    pwReqLower:'Mindestens ein Kleinbuchstabe (a-z)', pwReqNum:'Mindestens eine Zahl (0-9)',
    pwReqSpecial:'Mindestens ein Sonderzeichen (!@#$%^&*)',
    pwWeak:'Schwach', pwFair:'Mittel', pwGood:'Gut', pwStrong:'Stark',
  },
};

function lpUpdateText() {
  var l = LP_TEXT[lpLang] || LP_TEXT.en;
  var ids = {
    'lp-tagline':l.tagline,'lp-headline':l.headline,'lp-desc':l.desc,
    'lp-trusted':l.trusted,'lp-f1':l.f1,'lp-f2':l.f2,'lp-f3':l.f3,'lp-f4':l.f4,
    'lp-toggle-lbl': (document.getElementById('lp-left-panel')&&document.getElementById('lp-left-panel').classList.contains('lp-expanded')) ? l.showLess : l.learnMore,
    'lp-heading-default':l.defaultH,'lp-sub-default':l.defaultS,
    'lp-btn-signin':l.signIn,'lp-btn-create':l.createAcc,
    'lp-login-heading':l.loginH,'lp-login-sub':l.loginS,
    'lp-signin-btn':l.signIn,'lp-goto-register':l.gotoRegister,
    'lp-demo-btn':l.demoBtn,'lp-demo-note':l.demoNote,
    'lp-or1':l.or,'lp-back-lbl1':l.back,
    'lp-reg-heading':l.regH,'lp-reg-sub':l.regS,
    'lp-goto-login':l.gotoLogin,
    'lp-or2':l.or,'lp-back-lbl2':l.back,
    'lp-langsel-heading':l.langselH,'lp-langsel-sub':l.langselS,
    'lp-langsel-continue':l.continueBtn,
    'lp-version':l.version,
  };
  Object.keys(ids).forEach(function(id){ var el=document.getElementById(id); if(el) el.innerHTML=ids[id]; });
  // Login fields
  var uEl=document.getElementById('lp-username'); if(uEl) uEl.placeholder=l.username;
  var pEl=document.getElementById('lp-password'); if(pEl) pEl.placeholder=l.password;
  var pwToggleEl=document.getElementById('lp-pw-toggle-login');
  if(pwToggleEl) pwToggleEl.textContent = (pEl && pEl.type==='text') ? l.hidePw : l.showPw;
  // Register button (only update text, don't override disabled state)
  var regBtn = document.getElementById('lp-register-btn');
  if(regBtn) regBtn.textContent = l.createAcc;
  // Register field placeholders
  var rf = {
    'lp-reg-fullname': l.fullName||'Full Name',
    'lp-reg-username': l.username,
    'lp-reg-email':    l.email||'Email',
    'lp-reg-phone':    l.phone||'Phone Number',
    'lp-reg-password': l.password||'Password',
    'lp-reg-confirm':  l.confirmPass||'Confirm Password',
  };
  Object.keys(rf).forEach(function(id){ var el=document.getElementById(id); if(el) el.placeholder=rf[id]; });
  // Password requirement labels
  var pwReqTxt = {
    'lp-pw-req-len-txt': l.pwReqLen,
    'lp-pw-req-upper-txt': l.pwReqUpper,
    'lp-pw-req-lower-txt': l.pwReqLower,
    'lp-pw-req-num-txt': l.pwReqNum,
    'lp-pw-req-special-txt': l.pwReqSpecial,
  };
  Object.keys(pwReqTxt).forEach(function(id){ var el=document.getElementById(id); if(el) el.textContent=pwReqTxt[id]; });
  var cSel2=document.getElementById('lp-reg-country-sel');
  if(cSel2&&cSel2.options[0]) cSel2.options[0].text=l.country||'Select Country';
}

function lpToggleLangDropdown() {
  var list = document.getElementById('lp-lang-list');
  if(list) list.style.display = list.style.display === 'none' ? 'block' : 'none';
}

function lpDropdownSelectLang(lang) {
  var list = document.getElementById('lp-lang-list');
  if(list) list.style.display = 'none';
  lpSetLang(lang);
}

function lpSetLang(lang) {
  lpLang = lang;
  obSelectedLang = lang;
  state.lang = lang;
  ['en','ar','de'].forEach(function(l){
    var pill=document.getElementById('lp-pill-'+l);
    if(pill) pill.className='lp-pill'+(l===lang?' active':'');
    var card=document.getElementById('lp-lc-'+l);
    if(card) card.className='lp-lang-card'+(l===lang?' sel':'');
  });
  var isRTL = lang==='ar';
  if(isRTL) { document.body.classList.add('lang-ar'); } else { document.body.classList.remove('lang-ar'); }
  // Only apply RTL to auth card text, NOT the whole split-screen layout
  var authCard = document.querySelector('.lp-auth-card');
  if(authCard) authCard.style.direction = isRTL?'rtl':'ltr';
  var leftContent = document.getElementById('lp-left-content');
  if(leftContent) leftContent.style.direction = isRTL?'rtl':'ltr';
  var lpDropBtn = document.getElementById('lp-lang-btn');
  if(lpDropBtn) {
    var lpFlagMap = {en:'🇬🇧 EN', ar:'🇸🇦 AR', de:'🇩🇪 DE'};
    lpDropBtn.innerHTML = (lpFlagMap[lang] || '🇬🇧 EN') + ' <span style="font-size:10px;opacity:0.6;margin-left:2px">&#9662;</span>';
  }
  lpUpdateText();
}

function lpSelectLang(lang) {
  lpLang = lang;
  ['en','ar','de'].forEach(function(l){
    var card=document.getElementById('lp-lc-'+l);
    if(card) card.className='lp-lang-card'+(l===lang?' sel':'');
    var pill=document.getElementById('lp-pill-'+l);
    if(pill) pill.className='lp-pill'+(l===lang?' active':'');
  });
  var isRTL = lang==='ar';
  if(isRTL) { document.body.classList.add('lang-ar'); } else { document.body.classList.remove('lang-ar'); }
  // Only apply RTL to auth card text, not the whole layout
  var authCard = document.querySelector('.lp-auth-card');
  if(authCard) authCard.style.direction = isRTL?'rtl':'ltr';
}

function lpOnCountryChange(val) {
  var prefix = val ? (val.split('|')[1] || '') : '';
  var prefixEl = document.getElementById('lp-reg-phone-prefix');
  var wrapEl = document.getElementById('lp-reg-phone-prefix-wrap');
  var phoneEl = document.getElementById('lp-reg-phone');
  if(prefixEl) prefixEl.textContent = prefix || '+--';
  if(wrapEl) wrapEl.style.borderColor = prefix ? 'var(--primary)' : '';
  if(phoneEl && prefix) phoneEl.focus();
}



function lpResetRegisterForm() {
  var fieldIds = ['lp-reg-bizname','lp-reg-fullname','lp-reg-username','lp-reg-email','lp-reg-phone','lp-reg-password','lp-reg-confirm'];
  for (var i = 0; i < fieldIds.length; i++) {
    var f = document.getElementById(fieldIds[i]);
    if (f) f.value = '';
  }
  var countrySel = document.getElementById('lp-reg-country-sel');
  if (countrySel) countrySel.value = '';
  var prefixEl = document.getElementById('lp-reg-phone-prefix');
  if (prefixEl) prefixEl.textContent = '+--';
  var prefixWrapEl = document.getElementById('lp-reg-phone-prefix-wrap');
  if (prefixWrapEl) prefixWrapEl.style.borderColor = '';
  var privacyEl = document.getElementById('lp-reg-privacy');
  if (privacyEl) privacyEl.checked = false;
  var errEl = document.getElementById('lp-reg-error');
  if (errEl) { errEl.textContent = ''; errEl.style.display = 'none'; }
  var pwFill = document.getElementById('lp-pw-fill');
  if (pwFill) { pwFill.style.width = '0%'; pwFill.style.background = ''; }
  var pwStrengthLbl = document.getElementById('lp-pw-strength-lbl');
  if (pwStrengthLbl) { pwStrengthLbl.textContent = ''; pwStrengthLbl.style.color = ''; }
  var pwReqKeys = ['len','upper','lower','num','special'];
  for (var pr = 0; pr < pwReqKeys.length; pr++) {
    var prDot = document.getElementById('lp-pw-req-'+pwReqKeys[pr]+'-dot');
    var prRow = document.getElementById('lp-pw-req-'+pwReqKeys[pr]);
    if (prDot) prDot.style.background = '#94a3b8';
    if (prRow) prRow.style.color = '#94a3b8';
  }
  var pwMatchLbl = document.getElementById('lp-pw-match-lbl');
  if (pwMatchLbl) pwMatchLbl.textContent = '';
  var regBtn = document.getElementById('lp-register-btn');
  if (regBtn) { regBtn.disabled = true; regBtn.style.opacity = '0.55'; }
}

function lpShowDefault() {
  document.getElementById('lp-view-default').style.display='block';
  document.getElementById('lp-view-login').style.display='none';
  document.getElementById('lp-view-register').style.display='none';
  document.getElementById('lp-view-langsel').style.display='none';
  lpResetRegisterForm();
}

function lpShowLoginForm() {
  document.getElementById('lp-view-default').style.display='none';
  document.getElementById('lp-view-login').style.display='block';
  document.getElementById('lp-view-register').style.display='none';
  document.getElementById('lp-view-langsel').style.display='none';
  var errEl=document.getElementById('lp-login-error');
  if(errEl) errEl.style.display='none';
  lpResetRegisterForm();
  setTimeout(function(){ var u=document.getElementById('lp-username'); if(u) u.focus(); },150);
}

function lpShowRegisterForm() {
  document.getElementById('lp-view-default').style.display='none';
  document.getElementById('lp-view-login').style.display='none';
  document.getElementById('lp-view-register').style.display='block';
  document.getElementById('lp-view-langsel').style.display='none';
  var errEl=document.getElementById('lp-reg-error');
  if(errEl) errEl.style.display='none';
  setTimeout(function(){ var u=document.getElementById('lp-reg-username'); if(u) u.focus(); },150);
}

function lpLogin() {
  var user=(document.getElementById('lp-username').value||'').trim();
  var pass=document.getElementById('lp-password').value||'';
  var errEl=document.getElementById('lp-login-error');
  var l=LP_TEXT[lpLang]||LP_TEXT.en;
  if(errEl){errEl.textContent='';errEl.style.display='none';}
  if(!user){if(errEl){errEl.textContent=l.errUser;errEl.style.display='block';}return;}
  if(pass.length<4){if(errEl){errEl.textContent=l.errPass;errEl.style.display='block';}return;}
  var accounts=JSON.parse(localStorage.getItem('smartac_accounts')||'{}');
  if(!accounts[user]||accounts[user].password!==btoa(unescape(encodeURIComponent(pass)))){
    if(errEl){errEl.textContent=l.errWrong;errEl.style.display='block';}return;
  }
  obSelectedLang=lpLang; state.lang=lpLang;
  document.getElementById('landingPage').style.display='none';
  obFinishLogin(user);
}

function lpRegister() {
  var bizname = (document.getElementById('lp-reg-bizname')?document.getElementById('lp-reg-bizname').value:'').trim();
  var fullname = (document.getElementById('lp-reg-fullname')?document.getElementById('lp-reg-fullname').value:'').trim();
  var user = (document.getElementById('lp-reg-username').value||'').trim();
  var email = (document.getElementById('lp-reg-email')?document.getElementById('lp-reg-email').value:'').trim();
  var cSel = document.getElementById('lp-reg-country-sel');
  var countryRaw = cSel ? cSel.value : '';
  var cc = countryRaw.split('|')[1] || '';
  var phone = (document.getElementById('lp-reg-phone')?document.getElementById('lp-reg-phone').value:'').trim();
  var country = '';
  if(cSel && cSel.selectedIndex > 0) {
    var optTxt = cSel.options[cSel.selectedIndex].text;
    country = optTxt.replace(/^[^\s]+\s/,'').replace(/\s*\(.*\)$/,'').trim();
  }
  var pass = document.getElementById('lp-reg-password').value||'';
  var confirm = (document.getElementById('lp-reg-confirm')?document.getElementById('lp-reg-confirm').value:'');
  var errEl = document.getElementById('lp-reg-error');
  if(errEl){errEl.textContent='';errEl.style.display='none';}
  var E = {
    errFullname: {en:'Please enter your full name', ar:'أدخل الاسم الكامل',                    de:'Vollständigen Namen eingeben'},
    errUser:  {en:'Please enter a username',       ar:'أدخل اسم المستخدم',                    de:'Benutzernamen eingeben'},
    errEmail: {en:'Please enter your email',       ar:'أدخل بريدك الإلكتروني',                 de:'E-Mail-Adresse eingeben'},
    errCountry: {en:'Please select your country',  ar:'اختر بلدك',                             de:'Land auswählen'},
    errPhone: {en:'Please enter your phone number', ar:'أدخل رقم هاتفك',                       de:'Telefonnummer eingeben'},
    errPass:  {en:'Password does not meet all requirements', ar:'كلمة المرور لا تستوفي جميع المتطلبات', de:'Passwort erfüllt nicht alle Anforderungen'},
    errMatch: {en:'Passwords do not match',        ar:'كلمتا المرور غير متطابقتين',            de:'Passwörter stimmen nicht überein'},
    errExist: {en:'Username already taken',        ar:'اسم المستخدم مستخدم بالفعل',           de:'Benutzername bereits vergeben'},
    errPrivacy: {en:'You must agree to the Privacy Policy and Terms of Use', ar:'يجب الموافقة على سياسة الخصوصية وشروط الاستخدام', de:'Sie müssen der Datenschutzerklärung und den Nutzungsbedingungen zustimmen'},
  };
  function em(k){return (E[k]&&E[k][lpLang])||(E[k]&&E[k].en)||k;}
  function showErr(m){if(errEl){errEl.textContent=m;errEl.style.display='block';}}
  if(!fullname){showErr(em('errFullname'));return;}
  if(!user){showErr(em('errUser'));return;}
  if(!email){showErr(em('errEmail'));return;}
  if(!countryRaw){showErr(em('errCountry'));return;}
  if(lpPwScore(lpPwCriteria(pass))<5){showErr(em('errPass'));return;}
  if(confirm&&pass!==confirm){showErr(em('errMatch'));return;}
  var privacyChecked = document.getElementById('lp-reg-privacy') ? document.getElementById('lp-reg-privacy').checked : false;
  if(!privacyChecked){showErr(em('errPrivacy'));return;}
  var accounts=JSON.parse(localStorage.getItem('smartac_accounts')||'{}');
  if(accounts[user]){showErr(em('errExist'));return;}
  accounts[user]={
    password:btoa(unescape(encodeURIComponent(pass))),
    fullname:fullname, email:email,
    phone:(cc&&phone?(cc+' '+phone):phone),
    country:country, businessName:bizname, createdAt:new Date().toISOString(), isNew:true
  };
  localStorage.setItem('smartac_accounts',JSON.stringify(accounts));
  localStorage.setItem('smartac_session',user);
  document.getElementById('lp-view-register').style.display='none';
  document.getElementById('lp-view-langsel').style.display='block';
  lpSelectLang(lpLang);
}


// ── DEMO ACCESS ──
// One tap into a working app: no email, no password, no form. The account is
// local to this browser like every other one, and is seeded once so the demo
// actually has something to show.
var DEMO_USER = 'demo';

function lpDemoLogin() {
  var accounts = JSON.parse(localStorage.getItem('smartac_accounts') || '{}');
  if(!accounts[DEMO_USER]) {
    accounts[DEMO_USER] = {
      password: btoa(unescape(encodeURIComponent('demo'))),
      fullname: 'Demo', email: '', phone: '', country: '',
      businessName: 'Alpen Transporte (Demo)',
      createdAt: new Date().toISOString(), isNew: false, isDemo: true
    };
    localStorage.setItem('smartac_accounts', JSON.stringify(accounts));
  }
  localStorage.setItem('smartac_session', DEMO_USER);
  loadUserData();
  if(!state.transactions.length) seedDemoData(); else seedDemoInvoiceCases();
  obSelectedLang = lpLang; state.lang = lpLang;
  var lp = document.getElementById('landingPage');
  if(lp) lp.style.display = 'none';
  obFinishLogin(DEMO_USER);
}

// Enough of a business to exercise every part of the screen: three months of
// trading, fixed rules in three different categories, staff, an open debt.
// Who issued each demo expense invoice (name starts with → supplier).
var DEMO_SUPPLIERS = [
  ['Diesel', 'OMV Tankstellen GmbH'], ['GO-Maut', 'ASFINAG Maut Service GmbH'], ['Werkstatt', 'Kfz-Werkstatt Huber GmbH'],
  ['Reifen', 'Reifen Pichler KG'], ['Büromaterial', 'Office Discount e.U.'], ['Fachliteratur', 'Verlag Österreich GmbH'],
  ['Versicherung', 'Wiener Städtische Versicherung'], ['KFZ-Versicherung', 'Wiener Städtische Versicherung'],
  ['Telefon', 'A1 Telekom Austria AG'], ['AdBlue', 'OMV Tankstellen GmbH'], ['Reifenservice', 'Reifen Pichler KG'],
  ['Leasing', 'Raiffeisen-Leasing GmbH'], ['SVS', 'SVS Sozialversicherung'], ['Büromiete', 'Immo Wien Verwaltung GmbH'],
  ['Parkgebühren', 'Wiener Parkraum GmbH']
];

function demoInvoicePdf(tx) {
  var JsPdf = (window.jspdf && window.jspdf.jsPDF) ? window.jspdf.jsPDF : (window.jsPDF || null);
  if(!JsPdf) return null;
  try {
    var isInc = tx.type === 'income', me = 'Alpen Transporte (Demo)', other = tx.clientName || 'Kunde';
    if(!isInc) { DEMO_SUPPLIERS.some(function(p) { if(tx.name.indexOf(p[0]) === 0) { other = p[1]; return true; } }); if(other === 'Kunde') other = 'Lieferant'; }
    var from = isInc ? me : other, to = isInc ? other : me;
    var v = vatBreakdown(tx.amount, tx.vatRate || 0);
    var d = tx.date.substring(8, 10) + '.' + tx.date.substring(5, 7) + '.' + tx.date.substring(0, 4);
    var no = (isInc ? 'AR-' : 'ER-') + tx.date.substring(0, 4) + '-' + String(tx.id % 10000).padStart(4, '0');
    function f(n) { return 'EUR ' + n.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
    var doc = new JsPdf({unit: 'mm', format: 'a4'});
    var acc = isInc ? [30, 136, 229] : [84, 110, 122];
    doc.setFillColor(acc[0], acc[1], acc[2]); doc.rect(0, 0, 210, 6, 'F');
    doc.setTextColor(20); doc.setFont('helvetica', 'bold'); doc.setFontSize(16); doc.text(from, 20, 24);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(9); doc.setTextColor(110);
    doc.text(isInc ? 'Handelskai 94, 1200 Wien · UID ATU12345678' : 'Österreich', 20, 30);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(20); doc.setTextColor(acc[0], acc[1], acc[2]); doc.text('RECHNUNG', 190, 24, {align: 'right'});
    doc.setFontSize(8); doc.setTextColor(130); doc.setFont('helvetica', 'normal');
    doc.text('RECHNUNG AN', 20, 52); doc.text('RECHNUNGSNR. / DATUM', 190, 52, {align: 'right'});
    doc.setFontSize(11); doc.setTextColor(20); doc.setFont('helvetica', 'bold'); doc.text(to, 20, 59);
    doc.setFont('helvetica', 'normal'); doc.text(no + '  ·  ' + d, 190, 59, {align: 'right'});
    doc.setDrawColor(210); doc.line(20, 72, 190, 72);
    doc.setFontSize(8); doc.setTextColor(130); doc.setFont('helvetica', 'bold');
    doc.text('BESCHREIBUNG', 20, 79); doc.text('MENGE', 120, 79, {align: 'right'}); doc.text('NETTO', 190, 79, {align: 'right'});
    doc.setFontSize(11); doc.setTextColor(20); doc.setFont('helvetica', 'normal');
    doc.text(tx.name, 20, 88); doc.text('1', 120, 88, {align: 'right'}); doc.text(f(v.netto), 190, 88, {align: 'right'});
    doc.line(20, 96, 190, 96);
    doc.setTextColor(90); doc.text('Netto', 130, 108); doc.text('USt ' + (tx.vatRate || 0) + ' %', 130, 115);
    doc.setTextColor(20); doc.text(f(v.netto), 190, 108, {align: 'right'}); doc.text(f(v.steuer), 190, 115, {align: 'right'});
    doc.line(130, 120, 190, 120);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(12); doc.text('Gesamt', 130, 128); doc.text(f(v.brutto), 190, 128, {align: 'right'});
    doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(140);
    doc.text('Zahlbar innerhalb von 14 Tagen ohne Abzug.  Demo-Beleg.', 20, 280);
    return 'data:application/pdf;base64,' + doc.output('datauristring').split('base64,')[1];
  } catch(e) { return null; }
}

function demoInvoiceSvg(tx) {
  function esc(x) { return String(x).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
  function f(n) { return n.toFixed(2).replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.'); }
  var me = 'Alpen Transporte (Demo)', meAddr = 'Handelskai 94, 1200 Wien';
  var isInc = tx.type === 'income', other = tx.clientName || 'Kunde';
  if(!isInc) { DEMO_SUPPLIERS.some(function(p) { if(tx.name.indexOf(p[0]) === 0) { other = p[1]; return true; } }); if(!tx.clientName && other === 'Kunde') other = 'Lieferant'; }
  var from = isInc ? me : other, to = isInc ? other : me;
  var v = vatBreakdown(tx.amount, tx.vatRate || 0);
  var d = tx.date.substring(8, 10) + '.' + tx.date.substring(5, 7) + '.' + tx.date.substring(0, 4);
  var no = (isInc ? 'AR-' : 'ER-') + tx.date.substring(0, 4) + '-' + String(tx.id % 10000).padStart(4, '0');
  var accent = isInc ? '#1e88e5' : '#546e7a';
  var svg = '<svg xmlns="http://www.w3.org/2000/svg" width="420" height="560" viewBox="0 0 420 560" font-family="Helvetica,Arial,sans-serif">'
    + '<rect width="420" height="560" fill="#fff"/><rect width="420" height="8" fill="' + accent + '"/>'
    + '<text x="28" y="48" font-size="17" font-weight="700" fill="#111">' + esc(from) + '</text>'
    + '<text x="28" y="66" font-size="10" fill="#666">' + esc(isInc ? meAddr : 'Österreich') + '</text>'
    + '<text x="392" y="48" font-size="20" font-weight="700" fill="' + accent + '" text-anchor="end">RECHNUNG</text>'
    + '<text x="28" y="118" font-size="9" fill="#888">RECHNUNG AN</text><text x="28" y="134" font-size="12" font-weight="600" fill="#111">' + esc(to) + '</text>'
    + '<text x="392" y="118" font-size="9" fill="#888" text-anchor="end">NR. / DATUM</text>'
    + '<text x="392" y="134" font-size="12" fill="#111" text-anchor="end">' + no + ' · ' + d + '</text>'
    + '<line x1="28" y1="168" x2="392" y2="168" stroke="#ddd"/>'
    + '<text x="28" y="188" font-size="9" font-weight="700" fill="#888">BESCHREIBUNG</text><text x="392" y="188" font-size="9" font-weight="700" fill="#888" text-anchor="end">BETRAG NETTO</text>'
    + '<text x="28" y="214" font-size="12" fill="#111">' + esc(tx.name) + '</text><text x="392" y="214" font-size="12" fill="#111" text-anchor="end">€ ' + f(v.netto) + '</text>'
    + '<line x1="28" y1="240" x2="392" y2="240" stroke="#ddd"/>'
    + '<text x="250" y="270" font-size="11" fill="#555">Netto</text><text x="392" y="270" font-size="11" fill="#111" text-anchor="end">€ ' + f(v.netto) + '</text>'
    + '<text x="250" y="292" font-size="11" fill="#555">USt ' + (tx.vatRate || 0) + ' %</text><text x="392" y="292" font-size="11" fill="#111" text-anchor="end">€ ' + f(v.steuer) + '</text>'
    + '<line x1="250" y1="306" x2="392" y2="306" stroke="#111"/>'
    + '<text x="250" y="328" font-size="13" font-weight="700" fill="#111">Gesamt</text><text x="392" y="328" font-size="13" font-weight="700" fill="#111" text-anchor="end">€ ' + f(v.brutto) + '</text>'
    + '<text x="28" y="520" font-size="9" fill="#999">Zahlbar innerhalb von 14 Tagen · Demo-Beleg</text></svg>';
  return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
}

// Demo data: a transport firm's invoices — mixed VAT rates, cents, several per month,
// every one with its scanned-style document attached. Idempotent, and also tops up
// demo accounts created before these existed.
function seedDemoInvoiceCases() {
  var n = new Date(), Y = n.getFullYear(), M = n.getMonth(), id = Date.now() + 5000;
  function iso(back, day) { var d = new Date(Y, M - back, 1); return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + day; }
  function add(type, name, amt, vat, cat, date, client) {
    var t = {id: id++, type: type, name: name, amount: amt, vatRate: vat, category: cat, date: date, demoCase: true};
    if(client) t.clientName = client;
    state.transactions.push(t);
  }
  if(!state.transactions.some(function(t){ return t.demoCase && t.date === iso(0, '08') && t.name.indexOf('Personenbef') === 0; })
     && !state.transactions.some(function(t){ return t.demoCase; })) {
    add('income',  'Personenbeförderung 10%', 1100.00, 10, 'Sales',   iso(0,'08'), 'Reisebüro Sonnenhof');
    add('income',  'Kurierdienst 20%',         999.99, 20, 'Sales',   iso(0,'14'), 'Hofer Logistik');
    add('income',  'Beherbergung 13%',         565.00, 13, 'Sales',   iso(0,'21'), 'Hotel Alpenblick');
    add('expense', 'Reifen LKW 20%',          1234.56, 20, 'Vehicle', iso(0,'05'));
    add('expense', 'Büromaterial 10%',         110.00, 10, 'Other',   iso(0,'11'));
    add('expense', 'Fachliteratur 13%',        226.00, 13, 'Other',   iso(0,'16'));
    add('expense', 'Versicherung 0%',          350.00,  0, 'Insurance',iso(0,'20'));
  }
  if(!state.transactions.some(function(t){ return t.demoExtra; })) {
    [0, 1, 2].forEach(function(back) {
      var k = 1 - back * 0.06, r = function(x) { return Math.round(x * k * 100) / 100; };
      add('income',  'Containertransport Hafen Wien', r(2880), 20, 'Sales', iso(back,'24'), 'Hafen Wien Logistik');
      add('income',  'Expressfahrt Salzburg',          r(1450), 20, 'Sales', iso(back,'27'), 'Alpenmilch eGen');
      add('expense', 'Reifenservice',                  r(540),  20, 'Vehicle', iso(back,'22'));
      add('expense', 'KFZ-Versicherung',               r(410),   0, 'Insurance', iso(back,'25'));
      add('expense', 'Telefon A1',                      r(89.9), 20, 'Other', iso(back,'28'));
      add('expense', 'AdBlue',                          r(212),  20, 'Fuel', iso(back,'15'));
      state.transactions[state.transactions.length - 1].demoExtra = true;
    });
  }
  state.transactions.forEach(function(t) {
    if(t.invoice && String(t.invoice).indexOf('data:image/svg') !== 0) return;
    if(t.receiptId || !(t.demoCase || t.demoExtra || t.recurringId === undefined && !t.fixed && /^(Frachtauftrag|Innergem|Diesel|GO-Maut|Werkstatt)/.test(t.name))) return;
    var pdf = demoInvoicePdf(t);
    t.invoice = pdf || demoInvoiceSvg(t);
    t.invoiceName = (t.type === 'income' ? 'Ausgangsrechnung ' : 'Eingangsrechnung ') + t.name + (pdf ? '.pdf' : '.svg');
  });
  save();
}

// ── ACCOUNTANT PACKAGE (PDF with invoices + Excel/CSV) ──
function openAccPackage() {
  var ov = document.getElementById('accPkgOverlay');
  if(!ov) {
    ov = document.createElement('div');
    ov.id = 'accPkgOverlay';
    ov.style.cssText = 'position:fixed;inset:0;background:rgba(15,30,50,.45);z-index:9000;display:flex;align-items:flex-end;justify-content:center';
    ov.onclick = function(e) { if(e.target === ov) closeAccPackage(); };
    document.body.appendChild(ov);
  }
  var inp = 'box-sizing:border-box;width:100%;margin-top:4px;padding:10px;border-radius:10px;border:1.5px solid var(--border);background:var(--card2);color:var(--text);font-size:14px';
  ov.innerHTML = '<div style="background:var(--card);width:100%;max-width:480px;border-radius:20px 20px 0 0;padding:20px 18px 26px;box-shadow:0 -8px 30px rgba(0,0,0,.18)">'
    + '<div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:4px"><div style="font-weight:800;font-size:17px">' + escHtml(stx('accTitle')) + '</div>'
    + '<button type="button" onclick="closeAccPackage()" style="border:none;background:var(--card2);width:34px;height:34px;border-radius:50%;font-size:18px;color:var(--text2);cursor:pointer">&times;</button></div>'
    + '<div style="font-size:12px;color:var(--text3);margin-bottom:14px">' + escHtml(stx('accSub')) + '</div>'
    + '<div style="display:flex;gap:8px;margin-bottom:10px">'
    + '<label style="flex:1;font-size:11px;color:var(--text3)">' + escHtml(stx('accFrom')) + '<input type="month" id="accFrom" style="' + inp + '"/></label>'
    + '<label style="flex:1;font-size:11px;color:var(--text3)">' + escHtml(stx('accTo')) + '<input type="month" id="accTo" style="' + inp + '"/></label></div>'
    + '<div style="display:flex;gap:6px;margin-bottom:14px;flex-wrap:wrap">'
    + ['month:accPMonth', 'quarter:accPQuarter', 'year:accPYear'].map(function(p) { p = p.split(':'); return '<button type="button" class="gov-chip" onclick="accPreset(\'' + p[0] + '\')">' + escHtml(stx(p[1])) + '</button>'; }).join('') + '</div>'
    + '<div style="display:flex;flex-direction:column;gap:8px">'
    + '<button type="button" onclick="accPack(\'pdf\')" style="box-sizing:border-box;width:100%;padding:13px;border-radius:12px;border:none;background:var(--primary);color:#fff;font-size:14px;font-weight:700;cursor:pointer">' + escHtml(stx('accPdf')) + '</button>'
    + '<button type="button" onclick="accPack(\'xlsx\')" style="box-sizing:border-box;width:100%;padding:13px;border-radius:12px;border:1.5px solid var(--primary);background:var(--card2);color:var(--primary);font-size:14px;font-weight:700;cursor:pointer">' + escHtml(stx('accXlsx')) + '</button>'
    + '<button type="button" onclick="accPack(\'csv\')" style="box-sizing:border-box;width:100%;padding:10px;border-radius:12px;border:1.5px solid var(--border);background:none;color:var(--text2);font-size:13px;font-weight:600;cursor:pointer">' + escHtml(stx('accCsv')) + '</button></div>'
    + '<div id="accStatus" style="font-size:12px;color:var(--text3);margin-top:12px;min-height:16px"></div>'
    + '<div style="border-top:1px solid var(--border);margin:14px 0 12px"></div>'
    + '<div style="font-weight:800;font-size:15px;margin-bottom:4px">' + escHtml(stx('shTitle')) + '</div>'
    + '<div style="font-size:12px;color:var(--text3);margin-bottom:10px">' + escHtml(stx('shSub')) + '</div>'
    + '<input type="text" id="shNote" placeholder="' + escHtml(stx('shNote')) + '" style="' + inp + ';margin-bottom:10px"/>'
    + '<div style="display:flex;flex-direction:column;gap:6px;font-size:13px;margin-bottom:10px">'
    + '<label><input type="checkbox" checked disabled/> ' + escHtml(stx('shDocs')) + '</label>'
    + '<label><input type="checkbox" id="shEmp" checked/> ' + escHtml(stx('shEmp')) + '</label>'
    + '<label><input type="checkbox" id="shGov" checked/> ' + escHtml(stx('shGov')) + '</label></div>'
    + '<button type="button" onclick="accShareSend()" style="box-sizing:border-box;width:100%;padding:13px;border-radius:12px;border:none;background:var(--primary);color:#fff;font-size:14px;font-weight:700;cursor:pointer">' + escHtml(stx('shSend')) + '</button>'
    + '<div id="shStatus" style="font-size:12px;color:var(--text3);margin-top:10px;min-height:16px"></div>'
    + '<div id="shList"></div></div>';
  ov.style.display = 'flex';
  accPreset('month');
  accShareRender();
}

// ── SHARING WITH THE ACCOUNTANT ──
// A share is a reference (period + what may be seen), not a copy: the accountant portal reads the
// live data for that period. Local prototype: stored under uk('shares'); with the server this becomes
// POST/GET/DELETE /shares (see ACCOUNTANT_SHARING.md) and the portal reads it through BuApi.
function accSharesGet() { try { return JSON.parse(localStorage.getItem(uk('shares')) || '[]'); } catch(e) { return []; } }
function accSharesSet(list) { localStorage.setItem(uk('shares'), JSON.stringify(list)); }
function accShareSend() {
  var from = document.getElementById('accFrom').value, to = document.getElementById('accTo').value;
  var st = document.getElementById('shStatus');
  if(!from || !to) return;
  if(from > to) { var sw = from; from = to; to = sw; }
  var list = accSharesGet();
  list.push({id: Date.now(), note: (document.getElementById('shNote').value || '').trim(), from: from, to: to,
             scopes: {docs: true, employees: document.getElementById('shEmp').checked, government: document.getElementById('shGov').checked},
             createdAt: new Date().toISOString(), revokedAt: null});
  accSharesSet(list);
  document.getElementById('shNote').value = '';
  st.textContent = stx('shSent');
  accShareRender();
}
function accShareRevoke(id) {
  var list = accSharesGet();
  list.forEach(function(x) { if(x.id === id && !x.revokedAt) x.revokedAt = new Date().toISOString(); });
  accSharesSet(list);
  accShareRender();
}
function accShareRender() {
  var host = document.getElementById('shList'); if(!host) return;
  var list = accSharesGet().sort(function(a, b) { return b.id - a.id; });
  if(!list.length) { host.innerHTML = ''; return; }
  var h = '<div style="font-size:12px;font-weight:700;color:var(--text3);margin:14px 0 6px">' + escHtml(stx('shSentHd')) + '</div>';
  list.forEach(function(x) {
    var per = x.from === x.to ? x.from : x.from + ' – ' + x.to, off = !!x.revokedAt;
    h += '<div style="display:flex;align-items:center;gap:8px;padding:9px 0;border-top:1px solid var(--border)' + (off ? ';opacity:.55' : '') + '">'
      + '<div style="flex:1;min-width:0"><div style="font-size:13px;font-weight:700;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + escHtml(per) + '</div>'
      + '<div style="font-size:11.5px;color:var(--text3)">' + escHtml(x.createdAt.substring(0, 10)) + (x.note ? ' · ' + escHtml(x.note) : '') + (off ? ' · ' + escHtml(stx('shRevoked')) : '') + '</div></div>'
      + (off ? '' : '<button type="button" onclick="accShareRevoke(' + x.id + ')" style="border:1.5px solid var(--border);background:var(--card);border-radius:9px;padding:6px 10px;font-size:12px;font-weight:700;color:var(--expense);cursor:pointer">' + escHtml(stx('shRevoke')) + '</button>') + '</div>';
  });
  host.innerHTML = h;
}
function closeAccPackage() {
  var ov = document.getElementById('accPkgOverlay');
  if(ov) ov.style.display = 'none';
}
function accPreset(kind) {
  var n = new Date(), y = n.getFullYear(), m = n.getMonth() + 1, a, b;
  if(kind === 'quarter') { var q = Math.floor((m - 1) / 3); a = y + '-' + pad2(q * 3 + 1); b = y + '-' + pad2(q * 3 + 3); }
  else if(kind === 'year') { a = y + '-01'; b = y + '-12'; }
  else { a = b = y + '-' + pad2(m); }
  document.getElementById('accFrom').value = a; document.getElementById('accTo').value = b;
}
function accAttachment(tx) {
  function fromUrl(u) {
    var m = /^data:([^;,]+)[^,]*;base64,(.*)$/.exec(u || '');
    if(!m) return null;
    var bin = atob(m[2]), bytes = new Uint8Array(bin.length);
    for(var i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return {bytes: bytes, type: m[1]};
  }
  if(tx.invoice) return Promise.resolve(fromUrl(tx.invoice));
  if(tx.receiptId) {
    return receiptGet(tx.receiptId).then(function(rec) {
      if(!rec || !rec.blob) return null;
      return rec.blob.arrayBuffer().then(function(ab) { return {bytes: new Uint8Array(ab), type: rec.type || rec.blob.type || ''}; });
    });
  }
  return Promise.resolve(null);
}
function accEmployeeRows(from, to) {
  var rows = [];
  (state.employees || []).forEach(function(emp) {
    TrabisPackage.monthRange(from, to).forEach(function(mk) {
      var st = wtMonthStats(emp, mk), vac = wtVacation(emp, mk);
      if(!(st.hours > 0 || st.urlaub || st.krank || st.karenz)) return;
      rows.push({name: wtEmpName(emp), month: mk, hours: st.hours, workDays: st.workDays, urlaub: st.urlaub, krank: st.krank,
                 karenz: st.karenz, feiertag: st.feiertag, entitled: vac.entitled || 0, rest: vac.rest || 0});
    });
  });
  return rows;
}
function accPack(kind) {
  var from = document.getElementById('accFrom').value, to = document.getElementById('accTo').value;
  var st = document.getElementById('accStatus');
  if(!from || !to) return;
  if(from > to) { var sw = from; from = to; to = sw; }
  st.textContent = stx('accBusy');
  var txs = (state.transactions || []).map(function(t) {
    return {id: t.id, type: t.type, name: t.name, amount: t.amount, vatRate: t.vatRate || 0, date: t.date, invoice: t.invoice, receiptId: t.receiptId,
            category: t.category ? tc(t.category) : '', party: t.clientName || t.supplierName || ''};
  });
  TrabisPackage.build({
    company: {name: state.businessName, address: state.businessAddress, taxId: state.businessTaxId},
    from: from, to: to, transactions: txs, employees: accEmployeeRows(from, to), getAttachment: accAttachment,
    want: {pdf: kind === 'pdf', xlsx: kind === 'xlsx', csv: kind === 'csv'}
  }).then(function(r) {
    if(!r.counts.income && !r.counts.expense) { st.textContent = stx('accNone'); return; }
    if(kind === 'pdf') TrabisPackage.download(r.pdf, r.base + '.pdf', 'application/pdf');
    if(kind === 'xlsx') TrabisPackage.download(r.xlsx, r.base + '.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    if(kind === 'csv') TrabisPackage.download(r.csv, r.base + '.csv', 'text/csv;charset=utf-8');
    st.textContent = stx('accDone');
  }).catch(function(e) { st.textContent = 'Error: ' + (e && e.message || e); });
}

function sampleLoaded() {
  return (state.transactions || []).some(function(t) { return t.demoCase || t.demoExtra; });
}
function sampleToggle() {
  if(sampleLoaded()) {
    if(!confirm(stx('sampleRmAsk'))) return;
    state.transactions = state.transactions.filter(function(t) { return !(t.demoCase || t.demoExtra); });
    save();
  } else {
    if(!confirm(stx('sampleAsk'))) return;
    seedDemoInvoiceCases();
  }
  renderDangerSection();
  if(typeof renderHome === 'function') renderHome();
}

function seedDemoData() {
  var now = new Date(), Y = now.getFullYear(), M = now.getMonth();
  function iso(monthsBack, day) {
    var d = new Date(Y, M - monthsBack, day);
    return d.getFullYear() + '-' + pad2(d.getMonth() + 1) + '-' + pad2(day);
  }
  var id = Date.now();
  function tx(o) { o.id = id++; state.transactions.push(o); }

  state.businessType = 'transport';
  state.currency = '€';
  state.businessName = 'Alpen Transporte (Demo)';
  state.businessAddress = 'Handelskai 94, 1200 Wien';
  state.businessTaxId = 'ATU12345678';

  [0, 1, 2].forEach(function(back) {
    var f = 1 - back * 0.08;
    tx({type:'income', name:'Frachtauftrag Wien–Linz', amount:Math.round(6420*f), vatRate:20,
        category:'Sales', date:iso(back, 4), clientName:'Spedition Kern'});
    tx({type:'income', name:'Frachtauftrag Graz',      amount:Math.round(3180*f), vatRate:20,
        category:'Sales', date:iso(back, 12), clientName:'Hofer Logistik'});
    tx({type:'income', name:'Innergem. Lieferung DE',  amount:Math.round(2640*f), vatRate:0,
        category:'Sales', date:iso(back, 19), clientName:'Mayer & Söhne GmbH'});
    tx({type:'expense', name:'Diesel',        amount:Math.round(1860*f), vatRate:20, category:'Fuel',    date:iso(back, 6)});
    tx({type:'expense', name:'GO-Maut',       amount:Math.round(438*f),  vatRate:20, category:'Vehicle', date:iso(back, 9)});
    tx({type:'expense', name:'Werkstatt LKW', amount:Math.round(620*f),  vatRate:20, category:'Vehicle', date:iso(back, 17)});
  });
  seedDemoInvoiceCases();

  state.recurring = [
    {id:id++, name:'Leasing Mercedes Sprinter', amount:894,  category:'Vehicle',    vatRate:20, day:10, lastRecorded:null},
    {id:id++, name:'Leasing VW Crafter',        amount:812,  category:'Vehicle',    vatRate:20, day:10, lastRecorded:null},
    {id:id++, name:'ÖGK',                       amount:1892, category:'Government', vatRate:0,  day:15, lastRecorded:null},
    {id:id++, name:'SVS',                       amount:2146, category:'Government', vatRate:0,  day:1,  lastRecorded:null},
    {id:id++, name:'Büromiete',                 amount:780,  category:'Rent',       vatRate:0,  day:1,  lastRecorded:null}
  ];
  state.employees = [
    {id:id++, name:'Stefan Moser',  fullName:'Stefan Moser',  salary:2640, position:'Fahrer', lastRecorded:null},
    {id:id++, name:'Ahmad Haddad',  fullName:'Ahmad Haddad',  salary:2480, position:'Fahrer', lastRecorded:null}
  ];
  state.debts = [
    {id:id++, person:'Bau Nord GmbH', amount:1180, category:'Customer',
     date:iso(1, 20), status:'pending', type:'owes-me'}
  ];
  state.clients = [
    {id:id++, name:'Spedition Kern'}, {id:id++, name:'Hofer Logistik'}, {id:id++, name:'Mayer & Söhne GmbH'}
  ];
  state.year = Y; state.month = M;
  save();
}

function lpPwCriteria(pass) {
  pass = pass || '';
  return {
    len: pass.length >= 14,
    upper: /[A-Z]/.test(pass),
    lower: /[a-z]/.test(pass),
    num: /[0-9]/.test(pass),
    special: /[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>\/?~`]/.test(pass)
  };
}

function lpPwScore(c) {
  var n = 0;
  if(c.len) n++;
  if(c.upper) n++;
  if(c.lower) n++;
  if(c.num) n++;
  if(c.special) n++;
  return n;
}

function checkPasswordStrength(val) {
  var pass = val || '';
  var l = LP_TEXT[lpLang] || LP_TEXT.en;
  var c = lpPwCriteria(pass);
  var keys = ['len','upper','lower','num','special'];
  for (var i = 0; i < keys.length; i++) {
    var k = keys[i];
    var met = c[k];
    var color = met ? 'var(--green)' : '#94a3b8';
    var dot = document.getElementById('lp-pw-req-'+k+'-dot');
    var row = document.getElementById('lp-pw-req-'+k);
    if(dot) dot.style.background = color;
    if(row) row.style.color = color;
  }
  var score = lpPwScore(c);
  var fill = document.getElementById('lp-pw-fill');
  var lbl = document.getElementById('lp-pw-strength-lbl');
  var colors = ['#ef4444','#ef4444','#f97316','#f97316','#3b82f6','#006e1c'];
  var widths = ['0%','20%','40%','60%','80%','100%'];
  var labels = [l.pwWeak,l.pwWeak,l.pwFair,l.pwFair,l.pwGood,l.pwStrong];
  if(fill){
    if(!pass){ fill.style.width='0%'; fill.style.background=''; }
    else { fill.style.width=widths[score]; fill.style.background=colors[score]; }
  }
  if(lbl){
    if(!pass){ lbl.textContent=''; lbl.style.color=''; }
    else { lbl.textContent=labels[score]||''; lbl.style.color=colors[score]; }
  }
  return c;
}

function lpCheckPwMatch() {
  var pass = document.getElementById('lp-reg-password')?document.getElementById('lp-reg-password').value:'';
  var confirm = document.getElementById('lp-reg-confirm')?document.getElementById('lp-reg-confirm').value:'';
  var lbl = document.getElementById('lp-pw-match-lbl');
  if(!lbl) return;
  if(!confirm){lbl.textContent='';return;}
  var match = pass===confirm;
  var msgs = {
    en:['Passwords do not match','Passwords match'],
    ar:['كلمتا المرور غير متطابقتين','كلمتا المرور متطابقتان'],
    de:['Passwörter stimmen nicht überein','Passwörter stimmen überein'],
  };
  var m = msgs[lpLang]||msgs.en;
  lbl.innerHTML = (match?svgIcon('check',12):svgIcon('x',12)) + ' ' + escHtml(match?m[1]:m[0]);
  lbl.style.color = match?'#006e1c':'#ef4444';
}

function lpValidateReg() {
  var fullname = (document.getElementById('lp-reg-fullname')?document.getElementById('lp-reg-fullname').value:'').trim();
  var user = (document.getElementById('lp-reg-username')?document.getElementById('lp-reg-username').value:'').trim();
  var email = (document.getElementById('lp-reg-email')?document.getElementById('lp-reg-email').value:'').trim();
  var country = document.getElementById('lp-reg-country-sel') ? document.getElementById('lp-reg-country-sel').value : '';
  var pass = document.getElementById('lp-reg-password')?document.getElementById('lp-reg-password').value:'';
  var confirm = document.getElementById('lp-reg-confirm')?document.getElementById('lp-reg-confirm').value:'';
  var btn = document.getElementById('lp-register-btn');
  if(!btn) return;
  var privacyOk = document.getElementById('lp-reg-privacy') ? document.getElementById('lp-reg-privacy').checked : true;
  var passOk = lpPwScore(lpPwCriteria(pass))===5;
  var valid = fullname.length>0 && user.length>0 && email.length>0 && country.length>0 && passOk && (!confirm||pass===confirm) && privacyOk;
  btn.disabled = !valid;
  btn.style.opacity = valid?'1':'0.55';
}

function lpFinishRegister() {
  // Set lang and proceed to onboarding wizard (currency step)
  obSelectedLang = lpLang;
  state.lang = lpLang;
  localStorage.setItem('smartac_lang', lpLang);
  document.getElementById('landingPage').style.display='none';
  var overlay=document.getElementById('onboardingOverlay');
  if(overlay) overlay.style.display='flex';
  obNext(2); // go directly to currency step
  updateObText();
}

// Keep for back-compat (called from onboarding register path)


// ── ONBOARDING ──
var obSelectedLang = localStorage.getItem('smartac_lang') || 'en';
var obSelectedCur = localStorage.getItem('smartac_currency') || '€';
var obSelectedCurCode = 'EUR';
var obSelectedBizType = '';

var OB_TEXT = {
  en: {
    tagline:'Business Tracking System',
    splashTagline:'Business Tracking System',
    langTitle:'Choose Language', langSub:'Select your preferred language',
    authTitle:'Welcome Back', authSub:'Sign in or create your account',
    userPlaceholder:'Username', passPlaceholder:'Password',
    login:'Sign In', or:'or', register:'Create Account',
    curTitle:'Choose Currency', curSub:'Select your main currency',
    finish:'Get Started', cont:'Continue <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-1px"><polyline points="9 18 15 12 9 6"/></svg>', skip:'Skip',
    bizTitle:'What type of business do you have?', bizSub:'This helps us show the right features for your business',
    bizGeneral:'General / Freelancer', bizTransport:'Transport / Logistics', bizRetail:'Retail / Shop',
    bizRestaurant:'Restaurant / Café', bizConstruction:'Construction', bizMedical:'Medical / Clinic',
    errUser:'Please enter a username', email:'Email', phone:'Phone Number', country:'Country', confirmPass:'Confirm Password',
    errPass:'Password must be at least 4 characters',
    errWrong:'Incorrect username or password',
    errExists:'Username already exists',
    helloUser:'Hello,', logout:'Logout',
  },
  ar: {
    tagline:'نظام تتبع الأعمال',
    splashTagline:'نظام تتبع الأعمال',
    langTitle:'اختر اللغة', langSub:'اختر لغتك المفضلة',
    authTitle:'أهلاً بك', authSub:'سجل دخول أو أنشئ حساباً جديداً',
    userPlaceholder:'اسم المستخدم', passPlaceholder:'كلمة المرور',
    login:'تسجيل الدخول', or:'أو', register:'إنشاء حساب',
    curTitle:'اختر العملة', curSub:'اختر عملتك الرئيسية',
    finish:'ابدأ الآن', cont:'التالي <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-1px"><polyline points="9 18 15 12 9 6"/></svg>', skip:'تخطي',
    bizTitle:'ما نوع نشاطك التجاري؟', bizSub:'هذا يساعدنا في عرض الميزات المناسبة لنشاطك',
    bizGeneral:'عام / فريلانسر', bizTransport:'نقل وخدمات', bizRetail:'محل / تجزئة',
    bizRestaurant:'مطعم / كافيه', bizConstruction:'مقاولات', bizMedical:'طبي / عيادة',
    errUser:'الرجاء إدخال اسم المستخدم', email:'البريد الإلكتروني', phone:'رقم الهاتف', country:'الدولة', confirmPass:'تأكيد كلمة المرور',
    errPass:'كلمة المرور يجب أن تكون 4 أحرف على الأقل',
    errWrong:'اسم المستخدم أو كلمة المرور غير صحيحة',
    errExists:'اسم المستخدم موجود بالفعل',
    helloUser:'مرحباً،', logout:'تسجيل الخروج',
  },
  de: {
    tagline:'Geschäfts-Tracking-System',
    splashTagline:'Geschäfts-Tracking-System',
    langTitle:'Sprache wählen', langSub:'Wählen Sie Ihre Sprache',
    authTitle:'Willkommen', authSub:'Anmelden oder neues Konto erstellen',
    userPlaceholder:'Benutzername', passPlaceholder:'Passwort',
    login:'Anmelden', or:'oder', register:'Konto erstellen',
    curTitle:'Währung wählen', curSub:'Wählen Sie Ihre Hauptwährung',
    finish:'Loslegen', cont:'Weiter <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-1px"><polyline points="9 18 15 12 9 6"/></svg>', skip:'Überspringen',
    bizTitle:'Was für ein Unternehmen haben Sie?', bizSub:'Dies hilft uns, die richtigen Funktionen anzuzeigen',
    bizGeneral:'Allgemein / Freelancer', bizTransport:'Transport / Logistik', bizRetail:'Einzelhandel / Shop',
    bizRestaurant:'Restaurant / Café', bizConstruction:'Bau / Handwerk', bizMedical:'Medizin / Klinik',
    errUser:'Bitte Benutzernamen eingeben', email:'E-Mail', phone:'Telefonnummer', country:'Land', confirmPass:'Passwort bestätigen',
    errPass:'Passwort mind. 4 Zeichen',
    errWrong:'Falscher Benutzername oder Passwort',
    errExists:'Benutzername bereits vergeben',
    helloUser:'Hallo,', logout:'Abmelden',
  }
};

function t_ob(key) {
  var tx = OB_TEXT[obSelectedLang] || OB_TEXT.en;
  return tx[key] || key;
}

function selectObLang(lang) {
  obSelectedLang = lang;
  ['en','ar','de'].forEach(function(l){
    var el = document.getElementById('oblang-'+l);
    if(el) el.className = 'ob-lang-btn' + (l===lang?' sel':'');
  });
  // Also update app language immediately
  state.lang = lang;
  updateObText();
}

function updateObText() {
  var isRTL = obSelectedLang === 'ar';
  var card = document.querySelector('.ob-card');
  if(card) card.style.direction = isRTL ? 'rtl' : 'ltr';
  var splash = document.getElementById('splash-tagline');
  if(splash) splash.textContent = t_ob('splashTagline');
  var map = {
    'ob-tagline':'tagline',
    'ob-lang-title':'langTitle','ob-lang-sub':'langSub','ob-lang-next':'cont',
    'ob-auth-title':'authTitle','ob-auth-sub':'authSub',
    'ob-login-btn':'login','ob-register-btn':'register','ob-or-text':'or',
    'ob-cur-title':'curTitle','ob-cur-sub':'curSub','ob-cur-next':'cont',
    'ob-biz-title':'bizTitle','ob-biz-sub':'bizSub','ob-biz-next':'finish',
    'obbiz-general-lbl':'bizGeneral','obbiz-transport-lbl':'bizTransport','obbiz-retail-lbl':'bizRetail',
    'obbiz-restaurant-lbl':'bizRestaurant','obbiz-construction-lbl':'bizConstruction','obbiz-medical-lbl':'bizMedical',
    'ob-cur-lbl':'curLbl',
  };

  // Register field labels
  var regLabels = {
    en: {user:'Username', email:'Email', phone:'Phone Number', pass:'Password (min 6 chars)', confirm:'Confirm Password', country:'Select Country'},
    ar: {user:'اسم المستخدم', email:'البريد الإلكتروني', phone:'رقم الهاتف', pass:'كلمة المرور (6 أحرف على الأقل)', confirm:'تأكيد كلمة المرور', country:'اختر الدولة'},
    de: {user:'Benutzername', email:'E-Mail', phone:'Telefonnummer', pass:'Passwort (mind. 6 Zeichen)', confirm:'Passwort bestätigen', country:'Land auswählen'},
  };
  var rl = regLabels[obSelectedLang] || regLabels.en;
  var regFields = {
    'ob-reg-username': rl.user, 'ob-reg-email': rl.email,
    'ob-reg-phone': rl.phone, 'ob-reg-password': rl.pass,
    'ob-reg-confirm': rl.confirm,
  };
  Object.keys(regFields).forEach(function(id){
    var el = document.getElementById(id);
    if(el) el.placeholder = regFields[id];
  });
  var countryEl = document.getElementById('ob-reg-country');
  if(countryEl && countryEl.options[0]) countryEl.options[0].text = rl.country;

  // Register/login titles
  var regTitles = {en:['Create Account','Fill in your details'], ar:['إنشاء حساب','أدخل بياناتك'], de:['Konto erstellen','Ihre Daten eingeben']};
  var rt = regTitles[obSelectedLang]||regTitles.en;
  var rtEl = document.getElementById('ob-reg-title');
  var rsEl = document.getElementById('ob-reg-sub');
  if(rtEl) rtEl.textContent = rt[0];
  if(rsEl) rsEl.textContent = rt[1];

  var loginTitles = {en:['Welcome Back','Sign in to your account'], ar:['مرحباً بعودتك','سجل دخولك'], de:['Willkommen zurück','In Ihr Konto einloggen']};
  var lt = loginTitles[obSelectedLang]||loginTitles.en;
  var ltEl = document.getElementById('ob-login-title');
  var lsEl = document.getElementById('ob-login-sub');
  if(ltEl) ltEl.textContent = lt[0];
  if(lsEl) lsEl.textContent = lt[1];

  var gotoReg = document.getElementById('ob-goto-register');
  var createLbl = {en:'Create Account', ar:'إنشاء حساب', de:'Konto erstellen'};
  if(gotoReg) gotoReg.textContent = createLbl[obSelectedLang]||createLbl.en;
  Object.keys(map).forEach(function(id){
    var el = document.getElementById(id);
    if(el) el.innerHTML = t_ob(map[id]);
  });
  var uEl = document.getElementById('ob-username');
  var pEl = document.getElementById('ob-password');
  if(uEl) uEl.placeholder = t_ob('userPlaceholder');
  if(pEl) pEl.placeholder = t_ob('passPlaceholder');
}

function obNext(step) {
  for(var i=0;i<4;i++){
    var s = document.getElementById('ob-step'+i);
    if(s) s.className = 'ob-step'+(i===step?' active':'');
    var d = document.getElementById('dot'+i);
    if(d) d.className = 'ob-dot'+(i===step?' active':'');
  }
  updateObText();
  if(step===0) {
    setTimeout(function(){
      var u = document.getElementById('ob-username');
      if(u) u.focus();
    }, 300);
  }
}

function selectObBizType(value) {
  obSelectedBizType = value;
  ['general','transport','retail','restaurant','construction','medical'].forEach(function(v){
    var el = document.getElementById('obbiz-'+v);
    if(el) el.className = 'ob-biz-card' + (v===value?' sel':'');
  });
  var nextBtn = document.getElementById('ob-biz-next');
  if(nextBtn) nextBtn.disabled = false;
}

function obBizNext() {
  if(!obSelectedBizType) return;
  state.businessType = obSelectedBizType;
  save();
  obFinish();
}

function selectObCur(code, symbol) {
  obSelectedCurCode = code;
  obSelectedCur = symbol;
  ['EUR','USD','GBP','EGP','SAR','AED'].forEach(function(c){
    var el = document.getElementById('obcur-'+c);
    if(el) el.className = 'ob-cur-btn'+(c===code?' sel':'');
  });
}

function toggleObPw(inputId, eyeId) {
  var input = document.getElementById(inputId || 'ob-password');
  if(!input) return;
  var showing = input.type !== 'password';
  input.type = showing ? 'password' : 'text';
  var lbl = document.getElementById('ob-pw-eye-lbl');
  var regLbl = document.getElementById('ob-reg-pw-eye-lbl');
  var lang = obSelectedLang;
  var showTxt = {en:'Show password', ar:'إظهار كلمة المرور', de:'Passwort anzeigen'};
  var hideTxt = {en:'Hide password', ar:'إخفاء كلمة المرور', de:'Passwort ausblenden'};
  var txt = showing ? (showTxt[lang]||showTxt.en) : (hideTxt[lang]||hideTxt.en);
  if(lbl && inputId === 'ob-password') lbl.textContent = txt;
  if(regLbl && inputId === 'ob-reg-password') regLbl.textContent = txt;
}

function obShowError(msg) {
  var el = document.getElementById('ob-auth-error');
  if(el){ el.textContent = msg; el.style.display = 'block'; }
}

function obClearError() {
  var el = document.getElementById('ob-auth-error');
  if(el) el.style.display = 'none';
}

function obLogin() {
  obClearError();
  var user = (document.getElementById('ob-username').value || '').trim();
  var pass = document.getElementById('ob-password').value || '';
  var regErr = document.getElementById('ob-reg-error');
  if(regErr) regErr.style.display = 'none';
  if(!user) { obShowError(t_ob('errUser')); return; }
  if(pass.length < 4) { obShowError(t_ob('errPass')); return; }
  var accounts = JSON.parse(localStorage.getItem('smartac_accounts') || '{}');
  if(!accounts[user] || accounts[user].password !== btoa(unescape(encodeURIComponent(pass)))) {
    obShowError(t_ob('errWrong')); return;
  }
  // Existing users always go directly to the app.
  // New users will have already completed the setup wizard after registration.
  obFinishLogin(user);
}

function obFinishLogin(user) {
  localStorage.setItem('smartac_loggedin', '1');
  localStorage.setItem('smartac_user', user);
  localStorage.setItem('smartac_session', user);
  loadUserData();
  updateNotifBadge();
  applyLang();
  updateBusinessNameDisplay();
  checkRecurringDue();
  checkInstallmentsDue();
  checkInvoicesDue();
  checkAppointmentReminders();
  checkLowStockAll();
  var overlay = document.getElementById('onboardingOverlay');
  if(overlay) overlay.style.display = 'none';
  renderHome();
  playHomeAnim();
  // Request browser notification permission on first login
  if('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission().catch(function(){});
  }
  // Show smart in-app notifications after a short delay
  setTimeout(showInAppNotifications, 800);
}

function obShowRegError(msg) {
  var el = document.getElementById('ob-reg-error');
  if(el){ el.textContent = msg; el.style.display = 'block'; el.style.background = 'rgba(239,68,68,0.08)'; el.style.borderColor = '#ef4444'; el.style.color = '#ef4444'; }
}

function obRegister() {
  var user = (document.getElementById('ob-reg-username').value || '').trim();
  var email = (document.getElementById('ob-reg-email').value || '').trim();
  var phone = (document.getElementById('ob-reg-phone').value || '').trim();
  var countryRaw = document.getElementById('ob-reg-country').value || '';
  var country = countryRaw.split('|')[0]; // just the country code
  var phonePrefix = countryRaw.split('|')[1] || '';
  var pass = document.getElementById('ob-reg-password').value || '';
  var confirm = document.getElementById('ob-reg-confirm').value || '';
  var lang = obSelectedLang;

  var msgs = {
    errUser:    {en:'Please enter a username', ar:'أدخل اسم المستخدم', de:'Benutzernamen eingeben'},
    errEmail:   {en:'Please enter a valid email', ar:'أدخل بريد إلكتروني صحيح', de:'Gültige E-Mail eingeben'},
    errPass:    {en:'Password must be at least 6 characters', ar:'كلمة المرور 6 أحرف على الأقل', de:'Passwort mind. 6 Zeichen'},
    errMatch:   {en:'Passwords do not match', ar:'كلمتا المرور غير متطابقتين', de:'Passwörter stimmen nicht überein'},
    errExists:  {en:'Username already taken', ar:'اسم المستخدم مستخدم بالفعل', de:'Benutzername bereits vergeben'},
    success:    {en:'Account created! Please sign in.', ar:'تم إنشاء الحساب! سجل دخولك الآن.', de:'Konto erstellt! Bitte anmelden.'},
  };
  function m(k){ return (msgs[k]&&msgs[k][lang])||(msgs[k]&&msgs[k].en)||k; }

  if(!user) { obShowRegError(m('errUser')); return; }
  if(email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { obShowRegError(m('errEmail')); return; }
  if(pass.length < 6) { obShowRegError(m('errPass')); return; }
  if(pass !== confirm) { obShowRegError(m('errMatch')); return; }

  var accounts = JSON.parse(localStorage.getItem('smartac_accounts') || '{}');
  if(accounts[user]) { obShowRegError(m('errExists')); return; }

  accounts[user] = {
    password: btoa(unescape(encodeURIComponent(pass))),
    email: email, phone: (phonePrefix && !phone.startsWith(phonePrefix) ? phonePrefix+phone : phone), country: country,
    createdAt: new Date().toISOString(),
    isNew: true
  };
  localStorage.setItem('smartac_accounts', JSON.stringify(accounts));

  // Set session so the setup wizard (obFinish) knows who the user is
  localStorage.setItem('smartac_session', user);

  // Clear register form
  ['ob-reg-username','ob-reg-email','ob-reg-phone','ob-reg-password','ob-reg-confirm'].forEach(function(id){
    var el = document.getElementById(id);
    if(el) el.value = '';
  });
  var countryEl = document.getElementById('ob-reg-country');
  if(countryEl) countryEl.value = '';

  // After signup → go to language selection (step 1)
  obNext(1);
}

function obFinish() {
  var user = localStorage.getItem('smartac_session') || '';
  // Mark setup complete so future logins skip the wizard
  var accounts = JSON.parse(localStorage.getItem('smartac_accounts') || '{}');
  if(accounts[user] && accounts[user].isNew) {
    accounts[user].isNew = false;
    localStorage.setItem('smartac_accounts', JSON.stringify(accounts));
  }
  localStorage.setItem('smartac_loggedin', '1');
  localStorage.setItem('smartac_user', user);    // persistent
  localStorage.setItem('smartac_session', user); // temp
  // Set new user data
  state.transactions = [];
  state.debts = [];
  state.clients = [];
  state.budgets = {};
  state.lang = obSelectedLang;
  state.currency = obSelectedCur;
  state.employees = [];
  state.recurring = [];
  state.businessName = (accounts[user] && accounts[user].businessName) || '';
  save(); // saves to uk() keys (smartac_username_tx etc)
  applyLang();
  updateBusinessNameDisplay();
  updateFleetNavVisibility();
  var overlay = document.getElementById('onboardingOverlay');
  if(overlay) overlay.style.display = 'none';
  renderHome();
}

function onCountryChange(val) {
  var prefix = '';
  if(val && val.indexOf('|') > 0) {
    prefix = val.split('|')[1];
  }
  var prefixEl = document.getElementById('ob-phone-prefix');
  var phoneEl = document.getElementById('ob-reg-phone');
  var wrapEl = document.getElementById('ob-phone-prefix-wrap');
  if(prefixEl) prefixEl.textContent = prefix || '+--';
  if(wrapEl) wrapEl.style.borderColor = prefix ? '#3b5bdb' : '';
  if(phoneEl) {
    phoneEl.placeholder = prefix ? prefix + ' ...' : 'Phone Number';
    if(prefix) phoneEl.focus();
  }
}

function showLogin() {
  var lv = document.getElementById('ob-login-view');
  var rv = document.getElementById('ob-register-view');
  if(lv) lv.style.display = 'block';
  if(rv) rv.style.display = 'none';
  // Clear login inputs
  var u = document.getElementById('ob-username');
  var p = document.getElementById('ob-password');
  if(p) { p.type = 'password'; }
  obClearError();
  var errEl = document.getElementById('ob-reg-error');
  if(errEl) errEl.style.display = 'none';
}

function showRegister() {
  var lv = document.getElementById('ob-login-view');
  var rv = document.getElementById('ob-register-view');
  if(lv) lv.style.display = 'none';
  if(rv) rv.style.display = 'block';
  var errEl = document.getElementById('ob-reg-error');
  if(errEl) errEl.style.display = 'none';
  setTimeout(function(){
    var u = document.getElementById('ob-reg-username');
    if(u) u.focus();
  }, 200);
}
