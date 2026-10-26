// ── INVOICE DESIGN (Settings → invoice template) ──
// Lets each business give its invoices its own look on top of the two templates:
// accent colour, logo position + size, a line under the company details and the
// footer text. Defaults reproduce the templates exactly as they were.
// state.invoiceDesign: {accent, logoPos:'left'|'center'|'right', logoSize:'s'|'m'|'l', headerText, footerText}

var INVD_DEFAULTS = {
  classic: {accent: '#006e1c', logoSize: 'l'},
  modern:  {accent: '#0061a4', logoSize: 's'}
};
var INVD_SWATCHES = ['#006e1c', '#0061a4', '#1e293b', '#7c3aed', '#c2410c', '#be123c'];
var INVD_LOGO_PX = {classic: {s: 64, m: 120, l: 192}, modern: {s: 64, m: 88, l: 120}};

var INVD_L = {
  title:   {en:'Invoice design', ar:'تصميم الفاتورة', de:'Rechnungsdesign'},
  note:    {en:'Applies to every invoice you create. The preview updates as you change things.', ar:'بيتطبق على كل فاتورة بتعملها، والمعاينة بتتغير وانت بتعدّل.', de:'Gilt für alle Rechnungen. Die Vorschau ändert sich sofort mit.'},
  color:   {en:'Main colour', ar:'اللون الأساسي', de:'Hauptfarbe'},
  own:     {en:'Own colour', ar:'لون خاص', de:'Eigene Farbe'},
  logoPos: {en:'Logo position', ar:'مكان اللوجو', de:'Logo-Position'},
  left:    {en:'Left', ar:'شمال', de:'Links'},
  center:  {en:'Centre', ar:'في النص', de:'Mitte'},
  right:   {en:'Right', ar:'يمين', de:'Rechts'},
  logoSize:{en:'Logo size', ar:'حجم اللوجو', de:'Logo-Größe'},
  s:       {en:'Small', ar:'صغير', de:'Klein'},
  m:       {en:'Medium', ar:'متوسط', de:'Mittel'},
  l:       {en:'Large', ar:'كبير', de:'Groß'},
  noLogo:  {en:'No logo uploaded yet — add it under Business profile above.', ar:'لسه مفيش لوجو — ضيفه من بيانات الشركة فوق.', de:'Noch kein Logo — oben im Unternehmensprofil hochladen.'},
  header:  {en:'Line under your company details (optional)', ar:'سطر تحت بيانات الشركة (اختياري)', de:'Zeile unter den Firmendaten (optional)'},
  headerPh:{en:'e.g. Transport & logistics since 2015', ar:'مثلاً نقل ولوجستيات من 2015', de:'z. B. Transporte & Logistik seit 2015'},
  footer:  {en:'Footer text (optional)', ar:'النص اللي تحت (اختياري)', de:'Fußzeile (optional)'},
  footerPh:{en:'Empty = "Thank you" + your company name, address and UID', ar:'لو فاضي: «شكراً» + اسم الشركة والعنوان والـ UID', de:'Leer = „Vielen Dank“ + Firmenname, Adresse und UID'},
  preview: {en:'Preview', ar:'معاينة', de:'Vorschau'},
  reset:   {en:'Reset design', ar:'رجّع التصميم الأصلي', de:'Design zurücksetzen'}
};
function invdtx(k) { return (INVD_L[k] && (INVD_L[k][state.lang] || INVD_L[k].en)) || k; }

function invDesign(tpl) {
  var d = state.invoiceDesign || {}, def = INVD_DEFAULTS[tpl] || INVD_DEFAULTS.classic;
  var acc = /^#[0-9a-fA-F]{6}$/.test(d.accent || '') ? d.accent : def.accent;
  return {
    tpl: tpl, accent: acc,
    logoPos: ['left', 'center', 'right'].indexOf(d.logoPos) >= 0 ? d.logoPos : 'left',
    logoSize: ['s', 'm', 'l'].indexOf(d.logoSize) >= 0 ? d.logoSize : def.logoSize,
    headerText: (d.headerText || '').trim(), footerText: (d.footerText || '').trim()
  };
}
function invTint(hex, a) {
  var n = parseInt(String(hex).slice(1), 16);
  return 'rgba(' + ((n >> 16) & 255) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')';
}
function invEsc(t) { return escHtml(t).replace(/\n/g, '<br>'); }
function invLogoHtml(D, tpl) {
  if(!state.businessLogo) return '';
  var h = (INVD_LOGO_PX[tpl] || INVD_LOGO_PX.classic)[D.logoSize];
  var extra = tpl === 'modern' ? ';background:#fff;border-radius:8px;padding:4px' : '';
  return '<img src="' + state.businessLogo + '" style="height:' + h + 'px;max-width:' + Math.round(h * 2.2) + 'px;object-fit:contain' + extra + '">';
}
function invHeaderTextHtml(D, color) {
  return D.headerText ? '<div style="font-size:12.5px;font-weight:600;color:' + color + ';margin-top:6px">' + invEsc(D.headerText) + '</div>' : '';
}
function invFooterHtml(D) {
  if(D.footerText) return invEsc(D.footerText);
  var parts = [ptx('thanks'), state.businessName, state.businessAddress, state.businessTaxId ? 'UID: ' + state.businessTaxId : ''];
  return parts.filter(Boolean).map(escHtml).join(' &middot; ');
}

// ── Settings UI ──
function invdSet(k, v) {
  state.invoiceDesign = state.invoiceDesign || {};
  state.invoiceDesign[k] = v;
  clearTimeout(invdSet._t); invdSet._t = setTimeout(save, 300);
  renderInvoiceDesign(k === 'headerText' || k === 'footerText');
}
function invdReset() { state.invoiceDesign = {}; save(); renderInvoiceDesign(); }

function invdSampleInvoice() {
  var last = (state.issuedInvoices || []).slice(-1)[0];
  if(last && (last.items || []).length) return last;
  return {id: 'preview', number: 'RE-2026-001', issueDate: today(), dueDate: '', clientName: 'Muster GmbH',
          items: [{desc: 'Transport Wien – Linz', qty: 1, price: 850, sub: 850}, {desc: 'Wartezeit (Std.)', qty: 2, price: 45, sub: 90}],
          subtotal: 940, vatRate: 20, vatAmount: 188, total: 1128, currency: state.currency, notes: ''};
}

function renderInvoiceDesign(keepInputs) {
  var box = document.getElementById('invDesignBox');
  if(!box) return;
  var tpl = state.invoiceTemplate === 'modern' ? 'modern' : 'classic', D = invDesign(tpl);
  if(!keepInputs) {
    function seg(key, vals) {
      return '<div class="invd-seg">' + vals.map(function(v) {
        return '<button type="button" class="' + (D[key] === v ? 'on' : '') + '" onclick="invdSet(\'' + key + '\',\'' + v + '\')">' + escHtml(invdtx(v)) + '</button>';
      }).join('') + '</div>';
    }
    var sw = INVD_SWATCHES.map(function(c) {
      return '<button type="button" class="invd-sw' + (c.toLowerCase() === D.accent.toLowerCase() ? ' on' : '') + '" style="background:' + c + '" onclick="invdSet(\'accent\',\'' + c + '\')" aria-label="' + c + '"></button>';
    }).join('');
    box.innerHTML = '<div class="invd">'
      + '<div class="invd-ttl">' + escHtml(invdtx('title')) + '</div><div class="invd-note">' + escHtml(invdtx('note')) + '</div>'
      + '<div class="invd-lbl">' + escHtml(invdtx('color')) + '</div><div class="invd-sws">' + sw
      + '<label class="invd-own">' + escHtml(invdtx('own')) + ' <input type="color" value="' + D.accent + '" onchange="invdSet(\'accent\',this.value)"></label></div>'
      + '<div class="invd-lbl">' + escHtml(invdtx('logoPos')) + '</div>' + seg('logoPos', ['left', 'center', 'right'])
      + '<div class="invd-lbl">' + escHtml(invdtx('logoSize')) + '</div>' + seg('logoSize', ['s', 'm', 'l'])
      + (state.businessLogo ? '' : '<div class="invd-note" style="margin-top:6px">' + escHtml(invdtx('noLogo')) + '</div>')
      + '<div class="invd-lbl">' + escHtml(invdtx('header')) + '</div>'
      + '<input class="wt-input" type="text" maxlength="90" value="' + escHtml((state.invoiceDesign || {}).headerText || '') + '" placeholder="' + escHtml(invdtx('headerPh')) + '" oninput="invdSet(\'headerText\',this.value)">'
      + '<div class="invd-lbl">' + escHtml(invdtx('footer')) + '</div>'
      + '<textarea class="wt-input" rows="2" maxlength="240" placeholder="' + escHtml(invdtx('footerPh')) + '" oninput="invdSet(\'footerText\',this.value)">' + escHtml((state.invoiceDesign || {}).footerText || '') + '</textarea>'
      + '<div class="invd-lbl">' + escHtml(invdtx('preview')) + '</div><div class="invd-prev"><iframe id="invdFrame" title="preview" tabindex="-1"></iframe></div>'
      + '<button type="button" class="invd-reset" onclick="invdReset()">' + escHtml(invdtx('reset')) + '</button>'
      + '</div>';
  }
  var fr = document.getElementById('invdFrame');
  if(fr) {
    var html = buildInvoiceHTML(invdSampleInvoice(), 'issued')
      .replace('</head>', '<style>.no-print{display:none!important}body{overflow:hidden}</style></head>');
    fr.srcdoc = html;
  }
}
