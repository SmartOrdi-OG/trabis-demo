// ────────────────────────────────────────
// ── KONTAKTE: general address book (separate from invoicing clients/suppliers) ──
// ────────────────────────────────────────
var CONTACTS_L = {
  title:        {en:'Contacts', ar:'جهات الاتصال', de:'Kontakte'},
  add:          {en:'+ Add Contact', ar:'+ إضافة جهة اتصال', de:'+ Kontakt hinzufügen'},
  newContact:   {en:'New Contact', ar:'جهة اتصال جديدة', de:'Neuer Kontakt'},
  editContact:  {en:'Edit Contact', ar:'تعديل جهة الاتصال', de:'Kontakt bearbeiten'},
  name:         {en:'Name *', ar:'الاسم *', de:'Name *'},
  phone:        {en:'Phone', ar:'الهاتف', de:'Telefon'},
  email:        {en:'Email', ar:'البريد الإلكتروني', de:'E-Mail'},
  type:         {en:'Type', ar:'النوع', de:'Typ'},
  typeGovernment: {en:'Government', ar:'حكومي', de:'Behörde'},
  typeCompany:  {en:'Company', ar:'شركة', de:'Firma'},
  typePerson:   {en:'Person', ar:'شخص', de:'Person'},
  typeOther:    {en:'Other', ar:'غير ذلك', de:'Sonstiges'},
  notes:        {en:'Notes', ar:'ملاحظات', de:'Notizen'},
  save:         {en:'Save', ar:'حفظ', de:'Speichern'},
  cancel:       {en:'Cancel', ar:'إلغاء', de:'Abbrechen'},
  del:          {en:'Delete', ar:'حذف', de:'Löschen'},
  view:         {en:'View', ar:'عرض', de:'Ansehen'},
  edit:         {en:'Edit', ar:'تعديل', de:'Bearbeiten'},
  empty:        {en:'No contacts yet. Tap "+ Add Contact" to get started.', ar:'لا توجد جهات اتصال بعد. اضغط على "+ إضافة جهة اتصال".', de:'Noch keine Kontakte. Tippe auf "+ Kontakt hinzufügen".'},
  searchPh:     {en:'Search contacts...', ar:'بحث في جهات الاتصال...', de:'Kontakte suchen...'},
  back:         {en:'Back', ar:'رجوع', de:'Zurück'},
  documents:    {en:'Documents', ar:'المستندات', de:'Dokumente'},
  camera:       {en:'Camera', ar:'كاميرا', de:'Kamera'},
  upload:       {en:'Upload', ar:'رفع ملف', de:'Hochladen'},
  emptyDocs:    {en:'No documents yet', ar:'لا توجد مستندات بعد', de:'Noch keine Dokumente'},
  docNamePh:    {en:'Document name', ar:'اسم المستند', de:'Dokumentname'},
  notePh:       {en:'Note / comment (optional)', ar:'ملاحظة / تعليق (اختياري)', de:'Notiz / Kommentar (optional)'},
  editDocTitle: {en:'Edit Document', ar:'تعديل المستند', de:'Dokument bearbeiten'},
  confirmDeleteDoc: {en:'Delete this document?', ar:'حذف هذا المستند؟', de:'Dieses Dokument löschen?'},
};
function cttx(k) { return (CONTACTS_L[k] && CONTACTS_L[k][state.lang]) || (CONTACTS_L[k] && CONTACTS_L[k].en) || k; }
var CONTACT_TYPE_KEYS = ['government','company','person','other'];
function contactTypeLabel(type) {
  var key = 'type' + (type ? type.charAt(0).toUpperCase() + type.slice(1) : 'Other');
  return cttx(CONTACT_TYPE_KEYS.indexOf(type) !== -1 ? key : 'typeOther');
}

function contactDb() {
  return new Promise(function(resolve, reject) {
    if(window._contactDbInst) { resolve(window._contactDbInst); return; }
    var req = indexedDB.open('smartac_contactdocs', 1);
    req.onupgradeneeded = function(e) {
      var db = e.target.result;
      if(!db.objectStoreNames.contains('docs')) db.createObjectStore('docs', {keyPath:'id'});
    };
    req.onsuccess = function(e) { window._contactDbInst = e.target.result; resolve(window._contactDbInst); };
    req.onerror = function() { reject(req.error); };
  });
}
function contactDocPut(rec) {
  return contactDb().then(function(db) {
    return new Promise(function(res, rej) {
      var t = db.transaction('docs', 'readwrite');
      t.objectStore('docs').put(rec);
      t.oncomplete = res; t.onerror = function(){ rej(t.error); };
    });
  });
}
function contactDocGet(id) {
  return contactDb().then(function(db) {
    return new Promise(function(res, rej) {
      var r = db.transaction('docs').objectStore('docs').get(id);
      r.onsuccess = function(){ res(r.result); }; r.onerror = function(){ rej(r.error); };
    });
  });
}
function contactDocDeleteRec(id) {
  return contactDb().then(function(db) {
    return new Promise(function(res) {
      var t = db.transaction('docs', 'readwrite');
      t.objectStore('docs').delete(id);
      t.oncomplete = res; t.onerror = res;
    });
  }).catch(function(){});
}

function contactSearchBlob(c) {
  return [c.name || '', c.phone || '', c.email || '', contactTypeLabel(c.type) || '', c.notes || ''].join(' ').toLowerCase();
}

var _editingContactId = null;

function renderContactsPage() {
  var page = document.getElementById('contactsPage');
  if(!page) return;
  var lang = state.lang;
  var isRTL = lang === 'ar';
  var dir = isRTL ? 'rtl' : 'ltr';
  var inputStyle = 'width:100%;box-sizing:border-box;padding:10px;border-radius:10px;border:1.5px solid var(--border);background:var(--bg);color:var(--text);font-size:14px;margin-bottom:8px';
  var h = '';
  h += '<div style="padding:16px 16px 0;display:flex;align-items:center;justify-content:space-between;direction:' + dir + '">';
  h += '<div style="display:flex;align-items:center;gap:8px">' + moreBackBtnHtml() + '<div style="font-size:20px;font-weight:700">' + cttx('title') + '</div></div>';
  h += '<button id="addContactBtn" style="background:#0061a4;color:#fff;border:none;border-radius:10px;padding:8px 14px;font-size:14px;font-weight:600;cursor:pointer">' + cttx('add') + '</button>';
  h += '</div>';
  h += '<div id="contactForm" style="display:none;background:var(--card);border-radius:14px;margin:12px 16px;padding:16px;box-shadow:var(--shadow);direction:' + dir + '">';
  h += '<div id="contactFormTitle" style="font-size:14px;font-weight:600;margin-bottom:10px">' + cttx('newContact') + '</div>';
  h += '<input id="cf-name" placeholder="' + cttx('name') + '" style="' + inputStyle + '">';
  h += '<input id="cf-phone" placeholder="' + cttx('phone') + '" style="' + inputStyle + '">';
  h += '<input id="cf-email" placeholder="' + cttx('email') + '" style="' + inputStyle + '">';
  h += '<select id="cf-type" style="' + inputStyle + '">';
  CONTACT_TYPE_KEYS.forEach(function(k) { h += '<option value="' + k + '">' + contactTypeLabel(k) + '</option>'; });
  h += '</select>';
  h += '<textarea id="cf-notes" placeholder="' + cttx('notes') + '" rows="3" style="' + inputStyle + ';resize:vertical"></textarea>';
  h += '<div style="display:flex;gap:8px">';
  h += '<button id="saveContactBtn" style="flex:1;background:#0061a4;color:#fff;border:none;border-radius:10px;padding:10px;font-size:14px;font-weight:600;cursor:pointer">' + cttx('save') + '</button>';
  h += '<button id="cancelContactBtn" style="flex:1;background:var(--card);color:var(--text);border:1.5px solid var(--border);border-radius:10px;padding:10px;font-size:14px;font-weight:600;cursor:pointer">' + cttx('cancel') + '</button>';
  h += '</div></div>';
  h += '<div style="padding:12px 16px 0;direction:' + dir + '">';
  h += '<input type="text" id="contactSearchInput" placeholder="' + cttx('searchPh') + '" oninput="filterContacts(this.value)" style="width:100%;padding:12px 16px;border-radius:14px;border:1.5px solid var(--border);background:var(--card);color:var(--text);font-size:14px;box-sizing:border-box;outline:none">';
  h += '</div>';
  h += '<div id="contactListWrap" style="padding:12px 16px;direction:' + dir + '"></div>';
  page.innerHTML = h;

  renderContactsList(state.contacts || []);

  var addBtn = document.getElementById('addContactBtn');
  if(addBtn) addBtn.onclick = function() {
    resetContactForm();
    var form = document.getElementById('contactForm');
    if(form) form.style.display = form.style.display === 'none' ? 'block' : 'none';
  };
  var cancelBtn = document.getElementById('cancelContactBtn');
  if(cancelBtn) cancelBtn.onclick = function() {
    resetContactForm();
    document.getElementById('contactForm').style.display = 'none';
  };
  var saveBtn = document.getElementById('saveContactBtn');
  if(saveBtn) saveBtn.onclick = saveContact;
}

function renderContactsList(list) {
  var wrap = document.getElementById('contactListWrap');
  if(!wrap) return;
  if(!list.length) {
    wrap.innerHTML = '<div style="text-align:center;padding:40px 16px;color:var(--text3)">' + cttx('empty') + '</div>';
    return;
  }
  var isRTL = state.lang === 'ar';
  var h = '';
  list.forEach(function(c) {
    h += '<div style="background:var(--card);border-radius:14px;padding:12px 14px;margin-bottom:10px;box-shadow:var(--shadow);display:flex;align-items:center;gap:12px">';
    h += '<div style="width:44px;height:44px;border-radius:50%;background:#0061a4;color:#fff;display:flex;align-items:center;justify-content:center;font-size:18px;font-weight:700;flex-shrink:0">' + (c.name ? c.name.charAt(0).toUpperCase() : '?') + '</div>';
    h += '<div style="flex:1;min-width:0">';
    h += '<div style="font-size:14px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">' + escHtml(c.name) + '</div>';
    h += '<div style="font-size:12px;color:var(--text3);margin-top:1px">' + contactTypeLabel(c.type) + '</div>';
    if(c.phone) h += '<div style="font-size:12px;color:var(--text2)">' + svgIcon('phone',12) + ' ' + escHtml(c.phone) + '</div>';
    if(c.email) h += '<div style="font-size:12px;color:var(--text2)">' + svgIcon('mail',12) + ' ' + escHtml(c.email) + '</div>';
    h += '</div>';
    h += '<div style="display:flex;flex-direction:column;gap:6px;flex-shrink:0">';
    h += '<button class="cnt-view-btn" data-id="' + c.id + '" style="background:var(--primary);color:#fff;border:none;border-radius:8px;padding:6px 10px;font-size:12px;font-weight:600;cursor:pointer">' + cttx('view') + '</button>';
    h += '<button class="cnt-edit-btn" data-id="' + c.id + '" style="background:var(--bg);color:var(--text2);border:1.5px solid var(--border);border-radius:8px;padding:6px 10px;font-size:12px;font-weight:600;cursor:pointer">' + cttx('edit') + '</button>';
    h += '<button class="cnt-del-btn" data-id="' + c.id + '" style="background:rgba(239,68,68,0.1);color:#ef4444;border:none;border-radius:8px;padding:6px 10px;font-size:12px;font-weight:600;cursor:pointer">' + cttx('del') + '</button>';
    h += '</div></div>';
  });
  wrap.innerHTML = h;

  var viewBtns = wrap.querySelectorAll('.cnt-view-btn');
  for(var vi = 0; vi < viewBtns.length; vi++) {
    (function(id) { viewBtns[vi].onclick = function() { openContactProfile(id); }; })(parseInt(viewBtns[vi].getAttribute('data-id'), 10));
  }
  var editBtns = wrap.querySelectorAll('.cnt-edit-btn');
  for(var ei = 0; ei < editBtns.length; ei++) {
    (function(id) { editBtns[ei].onclick = function() { openContactEditForm(id); }; })(parseInt(editBtns[ei].getAttribute('data-id'), 10));
  }
  var delBtns = wrap.querySelectorAll('.cnt-del-btn');
  for(var di = 0; di < delBtns.length; di++) {
    (function(id) { delBtns[di].onclick = function() { contactDelete(id); }; })(parseInt(delBtns[di].getAttribute('data-id'), 10));
  }
}

function filterContacts(query) {
  var q = (query || '').trim().toLowerCase();
  var list = !q ? (state.contacts || []) : (state.contacts || []).filter(function(c) { return contactSearchBlob(c).indexOf(q) !== -1; });
  renderContactsList(list);
}

function openContactEditForm(id) {
  var c = (state.contacts || []).find(function(x){ return x.id === id; });
  if(!c) return;
  _editingContactId = c.id;
  document.getElementById('contactFormTitle').textContent = cttx('editContact');
  document.getElementById('cf-name').value = c.name || '';
  document.getElementById('cf-phone').value = c.phone || '';
  document.getElementById('cf-email').value = c.email || '';
  document.getElementById('cf-type').value = c.type || 'other';
  document.getElementById('cf-notes').value = c.notes || '';
  var form = document.getElementById('contactForm');
  form.style.display = 'block';
  form.scrollIntoView();
}

function resetContactForm() {
  _editingContactId = null;
  var titleEl = document.getElementById('contactFormTitle');
  if(titleEl) titleEl.textContent = cttx('newContact');
  ['cf-name','cf-phone','cf-email','cf-notes'].forEach(function(id) {
    var el = document.getElementById(id);
    if(el) el.value = '';
  });
  var typeEl = document.getElementById('cf-type');
  if(typeEl) typeEl.value = 'other';
}

function saveContact() {
  var nameEl = document.getElementById('cf-name');
  var name = nameEl.value.trim();
  if(!name) { showToast(cttx('name'), 'error'); return; }
  var getVal = function(id) { var el = document.getElementById(id); return el ? el.value.trim() : ''; };
  if(_editingContactId) {
    var c = (state.contacts || []).find(function(x){ return x.id === _editingContactId; });
    if(c) {
      c.name = name; c.phone = getVal('cf-phone'); c.email = getVal('cf-email');
      c.type = getVal('cf-type') || 'other'; c.notes = getVal('cf-notes');
    }
  } else {
    state.contacts.push({
      id: Date.now(), name: name, phone: getVal('cf-phone'), email: getVal('cf-email'),
      type: getVal('cf-type') || 'other', notes: getVal('cf-notes'), createdAt: Date.now()
    });
  }
  save();
  resetContactForm();
  document.getElementById('contactForm').style.display = 'none';
  renderContactsList(state.contacts || []);
}

async function contactDelete(id) {
  var c = (state.contacts || []).find(function(x){ return x.id === id; });
  if(!c) return;
  if(!(await confirmAsync(DELETE_CONFIRM_TITLE[state.lang]||DELETE_CONFIRM_TITLE.en, cttx('del') + ' "' + c.name + '"?'))) return;
  var docs = (state.contactDocs || []).filter(function(d){ return d.contactId === id; });
  docs.forEach(function(d) { contactDocDeleteRec(d.id); });
  state.contactDocs = (state.contactDocs || []).filter(function(d){ return d.contactId !== id; });
  state.contacts = (state.contacts || []).filter(function(x){ return x.id !== id; });
  save();
  renderContactsList(state.contacts || []);
}

function openContactProfile(contactId) {
  var contact = (state.contacts || []).find(function(c){ return c.id === contactId; });
  if(!contact) return;
  var lang = state.lang;
  var isRTL = lang === 'ar';
  var dir = isRTL ? 'rtl' : 'ltr';
  var backLbl = isRTL
    ? (svgIcon('chevronRight',14) + ' ' + cttx('back'))
    : (svgIcon('chevronLeft',14) + ' ' + cttx('back'));

  var existing = document.getElementById('contactProfileOverlay');
  if(existing) existing.parentNode.removeChild(existing);

  var overlay = document.createElement('div');
  overlay.id = 'contactProfileOverlay';
  overlay.style.cssText = 'position:fixed;inset:0;z-index:9998;background:var(--bg);overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch';

  var h = '';
  h += '<div style="position:sticky;top:0;z-index:1;background:#0061a4;color:#fff;padding:12px 16px;display:flex;align-items:center;gap:12px;direction:' + dir + '">';
  h += '<button id="cntBackBtn" style="background:rgba(255,255,255,0.2);color:#fff;border:none;border-radius:8px;padding:6px 12px;font-size:14px;font-weight:600;cursor:pointer">' + backLbl + '</button>';
  h += '<div style="font-size:17px;font-weight:700;flex:1;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + escHtml(contact.name) + '</div>';
  h += '<button id="cntEditBtn" style="background:rgba(255,255,255,0.2);color:#fff;border:none;border-radius:8px;padding:6px 10px;cursor:pointer;display:flex">' + svgIcon('pencil',15) + '</button>';
  h += '<button id="cntDelBtn" style="background:rgba(255,255,255,0.2);color:#fff;border:none;border-radius:8px;padding:6px 10px;cursor:pointer;display:flex">' + svgIcon('trash',15) + '</button>';
  h += '</div>';
  h += '<div style="background:var(--card);border-radius:16px;padding:20px;margin:16px;box-shadow:var(--shadow);direction:' + dir + '">';
  h += '<div style="text-align:center;margin-bottom:16px">';
  h += '<div style="width:56px;height:56px;border-radius:50%;background:#0061a4;color:#fff;display:inline-flex;align-items:center;justify-content:center;font-size:24px;font-weight:700">' + contact.name.charAt(0).toUpperCase() + '</div>';
  h += '<div style="font-size:18px;font-weight:700;margin-top:8px">' + escHtml(contact.name) + '</div>';
  h += '<div style="font-size:13px;color:var(--text3);margin-top:2px">' + contactTypeLabel(contact.type) + '</div>';
  h += '</div>';
  if(contact.phone) h += '<div style="display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid var(--border);font-size:14px">' + svgIcon('phone',15) + '<span>' + escHtml(contact.phone) + '</span></div>';
  if(contact.email) h += '<div style="display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid var(--border);font-size:14px">' + svgIcon('mail',15) + '<span>' + escHtml(contact.email) + '</span></div>';
  if(contact.notes) {
    h += '<div style="padding:10px 0">';
    h += '<div style="font-size:12px;color:var(--text3);margin-bottom:4px">' + cttx('notes') + '</div>';
    h += '<div style="font-size:14px;color:var(--text2);white-space:pre-wrap">' + escHtml(contact.notes) + '</div>';
    h += '</div>';
  }
  h += '</div>';
  h += '<div style="margin:0 16px 16px;direction:' + dir + '">';
  h += '<div style="font-size:16px;font-weight:700;margin-bottom:10px">' + cttx('documents') + '</div>';
  h += '<div style="display:flex;gap:8px;margin-bottom:14px">';
  h += '<button id="contactDocCameraBtn" style="flex:1;padding:10px;border-radius:10px;border:1.5px dashed var(--border);background:var(--bg);color:var(--text2);font-size:13px;font-weight:600;cursor:pointer">' + svgIcon('camera',14) + ' ' + cttx('camera') + '</button>';
  h += '<button id="contactDocUploadBtn" style="flex:1;padding:10px;border-radius:10px;border:1.5px dashed var(--border);background:var(--bg);color:var(--text2);font-size:13px;font-weight:600;cursor:pointer">' + svgIcon('upload',14) + ' ' + cttx('upload') + '</button>';
  h += '</div>';
  h += '<input type="file" id="contactDocCameraInput" accept="image/*" capture="environment" style="display:none">';
  h += '<input type="file" id="contactDocFileInput" accept="image/*,application/pdf" style="display:none">';
  h += '<div id="contactDocList"></div>';
  h += '</div>';

  overlay.innerHTML = h;
  document.body.appendChild(overlay);

  document.getElementById('cntBackBtn').onclick = function() { overlay.parentNode.removeChild(overlay); };
  document.getElementById('cntEditBtn').onclick = function() { overlay.parentNode.removeChild(overlay); openContactEditForm(contactId); };
  document.getElementById('cntDelBtn').onclick = function() { contactDelete(contactId).then(function(){ var ov = document.getElementById('contactProfileOverlay'); if(ov) ov.parentNode.removeChild(ov); }); };
  document.getElementById('contactDocCameraBtn').onclick = function() { document.getElementById('contactDocCameraInput').click(); };
  document.getElementById('contactDocUploadBtn').onclick = function() { document.getElementById('contactDocFileInput').click(); };
  document.getElementById('contactDocCameraInput').onchange = function() { contactDocFileChosen(this, contactId); };
  document.getElementById('contactDocFileInput').onchange = function() { contactDocFileChosen(this, contactId); };

  renderContactDocList(contactId);
}

function renderContactDocList(contactId) {
  var wrap = document.getElementById('contactDocList');
  if(!wrap) return;
  var docs = (state.contactDocs || []).filter(function(d){ return d.contactId === contactId; })
    .sort(function(a,b){ return (b.createdAt||0) - (a.createdAt||0); });
  if(!docs.length) {
    wrap.innerHTML = '<div style="text-align:center;padding:20px;color:var(--text3);font-size:13px">' + cttx('emptyDocs') + '</div>';
    return;
  }
  var h = '';
  docs.forEach(function(d) {
    var isPdf = d.type === 'application/pdf';
    h += '<div style="display:flex;align-items:flex-start;gap:10px;padding:12px 0;border-bottom:1px solid var(--border)">';
    h += '<span style="font-size:18px;flex-shrink:0;margin-top:2px;color:var(--text2);display:flex">' + (isPdf ? svgIcon('fileText', 20) : svgIcon('image', 20)) + '</span>';
    h += '<div style="flex:1;min-width:0;cursor:pointer" onclick="contactDocView(' + d.id + ')">';
    h += '<div style="font-size:14px;font-weight:600;color:var(--primary);overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + escHtml(d.name) + '</div>';
    if(d.note) h += '<div style="font-size:12px;color:var(--text3);margin-top:2px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + escHtml(d.note) + '</div>';
    h += '<div style="font-size:11px;color:var(--text3);margin-top:2px">' + formatDateDisplay(new Date(d.createdAt || Date.now()).toISOString()) + '</div>';
    h += '</div>';
    h += '<button onclick="openContactDocEditPrompt(' + d.id + ')" style="border:none;background:none;color:var(--text3);cursor:pointer;padding:6px;flex-shrink:0">' + svgIcon('pencil', 14) + '</button>';
    h += '<button onclick="contactDocDelete(' + d.id + ')" style="border:none;background:none;color:var(--text3);cursor:pointer;padding:6px;flex-shrink:0">' + svgIcon('trash', 14) + '</button>';
    h += '</div>';
  });
  wrap.innerHTML = h;
}

var _contactPendingFile = null;
function contactDocFileChosen(input, contactId) {
  var f = input.files && input.files[0];
  input.value = '';
  if(!f) return;
  var isPdf = f.type === 'application/pdf';
  receiptCompress(f).then(function(blob) {
    _contactPendingFile = {blob: blob, type: isPdf ? 'application/pdf' : 'image/jpeg'};
    openContactDocNamePrompt(contactId, f.name || '');
  });
}

function openContactDocNamePrompt(contactId, suggestedName) {
  var existing = document.getElementById('contactDocNameOverlay');
  if(existing) existing.parentNode.removeChild(existing);
  if(!_contactPendingFile) return;

  var ov = document.createElement('div');
  ov.id = 'contactDocNameOverlay';
  ov.className = 'modal-overlay open';
  ov.style.zIndex = '99999'; // above the full-screen contact profile overlay (z-index 9998)
  var defaultName = suggestedName.replace(/\.[^.]+$/, '');
  var html = '';
  html += '<div class="modal">';
  html += '<button class="modal-close-btn" id="cdn-closeBtn">' + svgIcon('x', 16) + '</button>';
  html += '<div class="modal-handle"></div>';
  html += '<div class="modal-title">' + cttx('save') + '</div>';
  html += '<input class="input-field" id="cdn-name" placeholder="' + cttx('docNamePh') + '" value="' + escHtml(defaultName) + '">';
  html += '<textarea class="input-field" id="cdn-note" placeholder="' + cttx('notePh') + '" style="height:70px;resize:vertical;padding-top:10px"></textarea>';
  html += '<div style="display:flex;gap:10px;margin-top:10px">';
  html += '<button id="cdn-saveBtn" style="flex:1;background:var(--primary);color:#fff;border:none;border-radius:12px;padding:13px;font-size:15px;font-weight:700;cursor:pointer">' + cttx('save') + '</button>';
  html += '<button id="cdn-cancelBtn" style="flex:1;background:var(--bg);color:var(--text2);border:1.5px solid var(--border);border-radius:12px;padding:13px;font-size:15px;font-weight:600;cursor:pointer">' + cttx('cancel') + '</button>';
  html += '</div></div>';
  ov.innerHTML = html;
  document.body.appendChild(ov);

  function close() { _contactPendingFile = null; var o = document.getElementById('contactDocNameOverlay'); if(o) o.parentNode.removeChild(o); }
  document.getElementById('cdn-closeBtn').onclick = close;
  document.getElementById('cdn-cancelBtn').onclick = close;
  ov.onclick = function(e) { if(e.target === ov) close(); };
  document.getElementById('cdn-saveBtn').onclick = function() {
    var nameEl = document.getElementById('cdn-name');
    var name = nameEl.value.trim();
    if(!name) { nameEl.focus(); return; }
    var note = document.getElementById('cdn-note').value.trim();
    contactDocSave(contactId, name, note);
    close();
  };
}

function contactDocSave(contactId, name, note) {
  if(!_contactPendingFile) return;
  var docId = Date.now();
  var pending = _contactPendingFile;
  contactDocPut({
    id: docId,
    user: localStorage.getItem('smartac_user') || '',
    name: name,
    type: pending.type,
    blob: pending.blob,
    createdAt: new Date().toISOString()
  }).then(function() {
    state.contactDocs.push({id: docId, contactId: contactId, name: name, note: note || '', type: pending.type, createdAt: Date.now()});
    save();
    _contactPendingFile = null;
    renderContactDocList(contactId);
  });
}

function contactDocView(docId) {
  contactDocGet(docId).then(function(rec) { if(rec) openReceiptViewer(rec); });
}

function openContactDocEditPrompt(docId) {
  var doc = (state.contactDocs || []).find(function(d){ return d.id === docId; });
  if(!doc) return;
  var existing = document.getElementById('contactDocEditOverlay');
  if(existing) existing.parentNode.removeChild(existing);

  var ov = document.createElement('div');
  ov.id = 'contactDocEditOverlay';
  ov.className = 'modal-overlay open';
  ov.style.zIndex = '99999';
  var html = '';
  html += '<div class="modal">';
  html += '<button class="modal-close-btn" id="cde-closeBtn">' + svgIcon('x', 16) + '</button>';
  html += '<div class="modal-handle"></div>';
  html += '<div class="modal-title">' + cttx('editDocTitle') + '</div>';
  html += '<input class="input-field" id="cde-name" value="' + escHtml(doc.name) + '">';
  html += '<textarea class="input-field" id="cde-note" placeholder="' + cttx('notePh') + '" style="height:70px;resize:vertical;padding-top:10px">' + escHtml(doc.note || '') + '</textarea>';
  html += '<div style="display:flex;gap:10px;margin-top:10px">';
  html += '<button id="cde-saveBtn" style="flex:1;background:var(--primary);color:#fff;border:none;border-radius:12px;padding:13px;font-size:15px;font-weight:700;cursor:pointer">' + cttx('save') + '</button>';
  html += '<button id="cde-cancelBtn" style="flex:1;background:var(--bg);color:var(--text2);border:1.5px solid var(--border);border-radius:12px;padding:13px;font-size:15px;font-weight:600;cursor:pointer">' + cttx('cancel') + '</button>';
  html += '</div></div>';
  ov.innerHTML = html;
  document.body.appendChild(ov);

  function close() { var o = document.getElementById('contactDocEditOverlay'); if(o) o.parentNode.removeChild(o); }
  document.getElementById('cde-closeBtn').onclick = close;
  document.getElementById('cde-cancelBtn').onclick = close;
  ov.onclick = function(e) { if(e.target === ov) close(); };
  document.getElementById('cde-saveBtn').onclick = function() {
    var nameEl = document.getElementById('cde-name');
    var name = nameEl.value.trim();
    if(!name) { nameEl.focus(); return; }
    doc.name = name;
    doc.note = document.getElementById('cde-note').value.trim();
    save();
    close();
    renderContactDocList(doc.contactId);
  };
}

async function contactDocDelete(docId) {
  if(!(await confirmAsync(DELETE_CONFIRM_TITLE[state.lang]||DELETE_CONFIRM_TITLE.en, cttx('confirmDeleteDoc')))) return;
  var doc = (state.contactDocs || []).find(function(d){ return d.id === docId; });
  if(!doc) return;
  var contactId = doc.contactId;
  state.contactDocs = (state.contactDocs || []).filter(function(d){ return d.id !== docId; });
  save();
  contactDocDeleteRec(docId);
  renderContactDocList(contactId);
}
