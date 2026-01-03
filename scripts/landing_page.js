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
          window.location.replace("https://www.google.com"); // change if you want
          break;
      }
    });
  })();


  function createPopup(message) {
      const popup = document.createElement("div");
      let ageGate = document.getElementById("age-gate");
      ageGate.style.display = "none";
      popup.className = 'popup';
      popup.textContent = message;
      popup.style.position = "fixed";
      popup.style.top = "45%";
      popup.style.left = "50%";
      popup.style.transform = "translate(-50%, -50%)";
      popup.style.padding = "10px";
      popup.style.backgroundColor = "orangered";
      popup.style.border = "1px solid black";
      popup.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)";
      popup.style.zIndex = "9999";
      document.body.appendChild(popup);
      return popup;
      
  }

    function showPopup(message) {
        const popup = createPopup(message);
        setTimeout(function() {
            popup.remove();
        }, 
        3850);
    }



    function loginPage() {
    const employeePortal = document.getElementById("employee-portal");
    if (!employeePortal) {
      console.error("Missing #employee-portal");
      return;
    }

    // hide gates
    document.getElementById("age-gate")?.style.setProperty("display", "none");
    document.getElementById("underage-gate")?.style.setProperty("display", "none");

    // hide the app (optional, but usually what you want for a portal)
    document.getElementById("Puff_Puff_Application")?.style.setProperty("display", "none");

    // show portal + restore scrolling
    employeePortal.style.display = "block";
    document.body.style.overflow = "";
  }



document.addEventListener("DOMContentLoaded", () => {
  const GAS_URL = "https://script.google.com/macros/s/AKfycbydi5Eriwduhs6qzARFl6pAjy9VxF2_d33vNokSOuH0piiy1_9wnBYc4WaXVp8EbBqO/exec";

  const btn = document.getElementById("employee-section");
  if (!btn) return;

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    // optional popup delay
    showPopup("You will be prompted to login shortly, please standby!");
    setTimeout(() => window.location.href = GAS_URL, 4000);
    window.location.href = GAS_URL;
  });
});
