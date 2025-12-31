(function () {
    const STORAGE_KEY = "ageVerified_session"; 
  
    function showGate() {
      const gate = document.getElementById("age-gate");
      if (!gate) return;
      gate.style.display = "block";
      document.getElementById("age-yes")?.focus();
      document.body.style.overflow = "hidden";
    }
  
    function hideGate() {
      const gate = document.getElementById("age-gate");
      if (!gate) return;
      gate.style.display = "none";
      document.body.style.overflow = "";
    }
  
    const verified = sessionStorage.getItem(STORAGE_KEY);
    if (!verified) showGate();
  
    document.addEventListener("click", (e) => {
      if (e.target?.id === "age-yes") {
        sessionStorage.setItem(STORAGE_KEY, "true");
        hideGate();
      } else if (e.target?.id === "age-no") {
        sessionStorage.removeItem(STORAGE_KEY);
        window.location.href = "/underage.html";
      }
    });
  })();