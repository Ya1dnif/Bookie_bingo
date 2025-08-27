document.addEventListener("DOMContentLoaded", () => {
  const grid = document.getElementById("bingoGrid");
  const refreshBtn = document.getElementById("refreshBoard");
  const darkToggle = document.getElementById("changeTheme");
  const themeImage = document.querySelector(".header-logo");
  const themeToggleIcon = document.getElementById("themeToggleIcon");

  // SVG paths
  const moonSVG = `<path stroke-linecap="round" stroke-linejoin="round"
    d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75
    0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635
    7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z" />`;

  const sunSVG = `<path stroke-linecap="round" stroke-linejoin="round"
    d="M12 3v1.5m6.364 1.136-1.06 1.06M21 12h-1.5m-1.136
    6.364-1.06-1.06M12 21v-1.5m-6.364-1.136
    1.06-1.06M3 12h1.5m1.136-6.364 1.06
    1.06M12 8.25a3.75 3.75 0 1 1 0
    7.5 3.75 3.75 0 0 1 0-7.5Z" />`;

  // Load saved theme or default to dark
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "light") {
    document.body.classList.remove("dark-mode");
    themeImage.src = "images/glitch_white_blue.png";
    themeToggleIcon.innerHTML = sunSVG;
  } else {
    // Default to dark if no saved value
    document.body.classList.add("dark-mode");
    themeImage.src = "images/glitch_dark_blue.png";
    themeToggleIcon.innerHTML = moonSVG;
  }

  // Toggle dark mode
  darkToggle.addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
    const isDark = document.body.classList.contains("dark-mode");

    localStorage.setItem("theme", isDark ? "dark" : "light");
    themeImage.src = isDark ? "images/glitch_dark_blue.png" : "images/glitch_white_blue.png";
    themeToggleIcon.innerHTML = isDark ? moonSVG : sunSVG;
  });

  function saveActiveButtons() {
    const activeIndices = [];
    grid.querySelectorAll("button.active").forEach(button => {
      activeIndices.push(button.dataset.index);
    });
    localStorage.setItem("bingoActive", JSON.stringify(activeIndices));
  }

  function applyActiveButtons() {
    const savedActive = JSON.parse(localStorage.getItem("bingoActive") || "[]");
    savedActive.forEach(index => {
      const btn = grid.querySelector(`button[data-index='${index}']`);
      if (btn) btn.classList.add("active");
    });
  }

  function buildBoard(data) {
    grid.innerHTML = ""; // clear previous buttons

    data.forEach((text, index) => {
      const btn = document.createElement("button");
      btn.textContent = text;
      btn.dataset.index = index; // assign index to identify the button

      btn.addEventListener("click", () => {
        btn.classList.toggle("active");
        saveActiveButtons();  // save active buttons state on every toggle
      });

      grid.appendChild(btn);
    });

    applyActiveButtons(); // restore toggled buttons state
  }

  function loadBoard() {
    const savedBoard = localStorage.getItem("bingoBoard");
    if (savedBoard) {
      const data = JSON.parse(savedBoard);
      buildBoard(data);
    } else {
      fetch("bingo_goals.json")
        .then(response => response.json())
        .then(data => {
          buildBoard(data);
          localStorage.setItem("bingoBoard", JSON.stringify(data));
        })
        .catch(error => {
          console.error("Failed to load JSON:", error);
        });
    }
  }

  loadBoard();

  refreshBtn.addEventListener("click", () => {
    localStorage.removeItem("bingoBoard");
    localStorage.removeItem("bingoActive");  // also clear toggled state on refresh
    loadBoard();
  });
});
