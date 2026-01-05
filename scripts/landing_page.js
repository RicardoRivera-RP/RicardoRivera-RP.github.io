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

  function resetSession() {
    sessionStorage.removeItem(VERIFIED_KEY);
    sessionStorage.removeItem(UNDERAGE_KEY);
    sessionStorage.removeItem(DEST_KEY);
  }

  function lockSite() {
    // hide only the page sections — DO NOT touch nav
    if (Puff_Puff_Application) Puff_Puff_Application.style.display = "none";
    if (Dispensary_Menu) Dispensary_Menu.style.display = "none";

    document.body.classList.add("ppp-locked");
    document.body.style.overflow = "hidden";
  }

  function unlockSite() {
    document.body.classList.remove("ppp-locked");
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

  function showMenu() {
    hide(ageGate);
    hide(underageGate);
    hide(verifiedGate);

    // If we're on index.html, there is NO #Dispensary_Menu section,
    // so trying to "showMenu()" would lead to a blank page.
    // Instead, go to menu.html.
    if (!Dispensary_Menu) {
      sessionStorage.setItem(DEST_KEY, "menu");
      window.location.href = "./menu.html";
      return;
    }

    Dispensary_Menu.style.display = "flex";
    if (Puff_Puff_Application) Puff_Puff_Application.style.display = "none";
    unlockSite();
  }

  function showApplication() {
    hide(ageGate);
    hide(underageGate);
    hide(verifiedGate);

    // If this page doesn't have the app section, send them home.
    if (!Puff_Puff_Application) {
      sessionStorage.setItem(DEST_KEY, "application");
      window.location.href = "./index.html";
      return;
    }

    if (Dispensary_Menu) Dispensary_Menu.style.display = "none";
    Puff_Puff_Application.style.display = "flex";
    unlockSite();
  }

  // --------- Hook Return Home buttons/links to reset session ---------
  // 1) The button inside your form shell: <button id="app-shell">Return Home</button> :contentReference[oaicite:4]{index=4}
  document.getElementById("app-shell")?.addEventListener("click", (e) => {
    e.preventDefault();
    resetSession();
    window.location.href = "https://ricardorivera-rp.github.io";
  });

  // 2) Your nav link: <a class="nav-link" href="...">Return Home</a> :contentReference[oaicite:5]{index=5}
  document.querySelector(".ppp-nav .nav-link")?.addEventListener("click", (e) => {
    // allow normal navigation, just clear first
    resetSession();
  });

  // ---------- initial state ----------
  const verified = sessionStorage.getItem(VERIFIED_KEY);
  const denied = sessionStorage.getItem(UNDERAGE_KEY);
  const dest = sessionStorage.getItem(DEST_KEY);

  if (verified) {
    if (dest === "menu") showMenu();
    else if (dest === "application") showApplication();
    else showVerifiedChooser();
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
        sessionStorage.removeItem(DEST_KEY);
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
