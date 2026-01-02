const Puff_Puff_Application = document.getElementById("Puff_Puff_Application");

(function () {
  const STORAGE_KEY = "ageVerified_session";

  function showGate() {
    const gate = document.getElementById("age-gate");
    if (!gate) return;

    gate.style.display = "flex"; // ✅ must be flex for centering
    document.getElementById("age-yes")?.focus();

    Puff_Puff_Application.style.display = "none";
    document.body.style.overflow = "hidden";
  }

  function hideGate() {
    const gate = document.getElementById("age-gate");
    if (!gate) return;

    gate.style.display = "none";
    Puff_Puff_Application.style.display = "flex";
    document.body.style.overflow = ""; // ✅ restore scrolling
  }

  const verified = sessionStorage.getItem(STORAGE_KEY);
  if (!verified) showGate();

  document.addEventListener("click", (e) => {
    const id = e.target?.id;

    if (id === "age-yes") {
      sessionStorage.setItem(STORAGE_KEY, "true");
      hideGate();
    } else if (id === "age-no") {
      sessionStorage.removeItem(STORAGE_KEY);
      window.location.href = "/underage.html";
    }
  });
})();
