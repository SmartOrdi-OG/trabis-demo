// Runs once every other script has loaded (was the "INIT" block in the middle of the old single script).
// ── INIT ──
applyLang();
// Restore nightly notification if it was enabled
(function(){
  try {
    var notifEnabled = localStorage.getItem(uk('notif_daily')) || '0';
    if(notifEnabled === '1' && Notification && Notification.permission === 'granted') {
      scheduleNightlyNotif();
    }
  } catch(e) {}
})();
