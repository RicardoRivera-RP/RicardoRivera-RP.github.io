const Puff_Puff_Application = document.getElementById("Puff_Puff_Application");
const Dispensary_Menu = document.getElementById("Dispensary_Menu");

(function () {
  const VERIFIED_KEY = "ageVerified_session";
  const UNDERAGE_KEY = "ageDenied_session";
  const DEST_KEY = "ppp_destination"; // "menu" | "application"

  const ageGate = document.getElementById("age-gate");
  const underageGate = document.getElementById("underage-gate");
  const verifiedGate = document.getElementById("verified-gate");

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
    if (Dispensary_Menu) Dispensary_Menu.style.display = "none";
    document.body.style.overflow = "hidden";
  }

  function unlockSite() {
    document.body.style.overflow = "";
  }

  function showAgeGate() {
    hide(underageGate);
    hide(verifiedGate);
    if (!show(ageGate)) console.error("Missing #age-gate in HTML");
    lockSite();
    document.getElementById("age-yes")?.focus();
  }

  function showUnderageGate() {
    hide(ageGate);
    hide(verifiedGate);
    if (!show(underageGate)) {
      console.error("Missing #underage-gate in HTML");
      lockSite();
      return;
    }
    lockSite();
    document.getElementById("underage-leave")?.focus();
  }

  function showVerifiedChooser() {
    hide(ageGate);
    hide(underageGate);
    if (!show(verifiedGate)) console.error("Missing #verified-gate in HTML");
    lockSite();
    document.getElementById("go-menu")?.focus();
  }

 

  function showApplication() {
    hide(ageGate);
    hide(underageGate);
    hide(verifiedGate);

    if (Dispensary_Menu) Dispensary_Menu.style.display = "none";
    if (Puff_Puff_Application) Puff_Puff_Application.style.display = "flex";

    unlockSite();
  }

  // ---------- initial state ----------
  const verified = sessionStorage.getItem(VERIFIED_KEY);
  const denied = sessionStorage.getItem(UNDERAGE_KEY);
  const dest = sessionStorage.getItem(DEST_KEY);

  if (verified) {
    if (dest === "menu") showMenu();
    else if (dest === "application") showApplication();
    else showVerifiedChooser(); // verified but no choice yet
  } else if (denied) {
    showUnderageGate();
  } else {
    showAgeGate();
  }

  // ---------- click handling (Safari-safe) ----------
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    switch (btn.id) {
      // age gate
      case "age-yes":
        sessionStorage.setItem(VERIFIED_KEY, "true");
        sessionStorage.removeItem(UNDERAGE_KEY);
        sessionStorage.removeItem(DEST_KEY); // reset choice each session if you want
        showVerifiedChooser();
        break;

      case "age-no":
        sessionStorage.setItem(UNDERAGE_KEY, "true");
        sessionStorage.removeItem(VERIFIED_KEY);
        sessionStorage.removeItem(DEST_KEY);
        showUnderageGate();
        break;

      // verified chooser
      case "go-menu":
        sessionStorage.setItem(DEST_KEY, "menu");
        showMenu();
        break;

      case "go-application":
        sessionStorage.setItem(DEST_KEY, "application");
        showApplication();
        break;

      case "verified-back":
        // back to the age gate (and un-verify for this session)
        sessionStorage.removeItem(VERIFIED_KEY);
        sessionStorage.removeItem(DEST_KEY);
        showAgeGate();
        break;

      // underage gate
      case "underage-back":
        sessionStorage.removeItem(UNDERAGE_KEY);
        showAgeGate();
        break;

      case "underage-leave":
        window.location.replace("https://www.google.com");
        break;
    }
  });
})();
