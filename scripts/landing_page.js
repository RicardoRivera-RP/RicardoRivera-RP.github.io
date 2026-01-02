const Puff_Puff_Application = document.getElementById("Puff_Puff_Application");

(function () {
  const VERIFIED_KEY = "ageVerified_session";
  const UNDERAGE_KEY = "ageDenied_session";

  const ageGate = document.getElementById("age-gate");
  const underageGate = document.getElementById("underage-gate");

  function show(el) {
    if (!el) return false;
    el.style.display = "flex";
    return true;
  }

  function hide(el) {
    if (!el) return;
    el.style.display = "none";
  }

  function lockSite() {
    if (Puff_Puff_Application) Puff_Puff_Application.style.display = "none";
    document.body.style.overflow = "hidden";
  }

  function unlockSite() {
    if (Puff_Puff_Application) Puff_Puff_Application.style.display = "flex";
    document.body.style.overflow = "";
  }

  function showAgeGate() {
    hide(underageGate);
    if (!show(ageGate)) console.error("Missing #age-gate in HTML");
    lockSite();
    document.getElementById("age-yes")?.focus();
  }

  function showUnderageGate() {
    hide(ageGate);
    if (!show(underageGate)) {
      console.error("Missing #underage-gate in HTML");
      // fallback so user is still blocked
      lockSite();
      return;
    }
    lockSite();
    document.getElementById("underage-leave")?.focus();
  }

  function allowAccess() {
    hide(ageGate);
    hide(underageGate);
    unlockSite();
  }

  // ---------- initial state ----------
  const verified = sessionStorage.getItem(VERIFIED_KEY);
  const denied = sessionStorage.getItem(UNDERAGE_KEY);

  if (verified) allowAccess();
  else if (denied) showUnderageGate();
  else showAgeGate();

  // ---------- click handling (Safari-safe) ----------
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("button"); // ✅ important
    if (!btn) return;

    switch (btn.id) {
      case "age-yes":
        sessionStorage.setItem(VERIFIED_KEY, "true");
        sessionStorage.removeItem(UNDERAGE_KEY);
        allowAccess();
        break;

      case "age-no":
        sessionStorage.setItem(UNDERAGE_KEY, "true");
        sessionStorage.removeItem(VERIFIED_KEY);
        showUnderageGate();
        break;

      case "underage-back":
        sessionStorage.removeItem(UNDERAGE_KEY);
        showAgeGate();
        break;

      case "underage-leave":
        window.location.replace("about:blank"); // change if you want
        break;
    }
  });
})();
