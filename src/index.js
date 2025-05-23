import data from "./database/data.json";

const app = document.getElementById("app");
const logo = document.querySelector(".header-logo");
const themeToggleButton = document.querySelector(".theme-toggle");
const themeIcon = themeToggleButton.querySelector("img");
const container = document.querySelector("main");
const filterButtons = document.querySelectorAll(".filter-button");
const savedState = JSON.parse(localStorage.getItem("extensionsState"));
const modal = document.getElementById("confirm-modal");
const confirmBtn = document.getElementById("confirm-remove");
const cancelBtn = document.getElementById("cancel-remove");

let extensionToRemove = null;

const setTheme = (isDark) => {
  document.documentElement.classList.toggle("dark", isDark);
  localStorage.setItem("theme", isDark ? "dark" : "light");

  logo.src = isDark ? "/images/logo_dark.svg" : "/images/logo.svg";
  logo.alt = isDark ? "Light Mode Icon" : "Dark Mode Icon";

  themeIcon.src = isDark ? "/images/icon-sun.svg" : "/images/icon-moon.svg";
  themeIcon.alt = isDark ? "Light Mode Icon" : "Dark Mode Icon";
};

const initTheme = () => {
  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const isDark = savedTheme === "dark" || (!savedTheme && prefersDark);
  setTheme(isDark);
};

themeToggleButton.addEventListener("click", () => {
  const isDark = document.documentElement.classList.contains("dark");
  setTheme(!isDark);
});

// prettier-ignore
const extensions = savedState ? data.map((ext) => {
  const saved = savedState.find((e) => e.name === ext.name);
  return saved ? { ...ext, isActive: saved.isActive } : ext;
}) : [...data];

const saveToLocalStorage = () => {
  localStorage.setItem("extensionsState", JSON.stringify(extensions));
};

const renderExtensions = (filter = "All") => {
  container.innerHTML = "";

  extensions
    .filter((ext) =>
      filter === "All"
        ? true
        : filter === "Active"
        ? ext.isActive
        : !ext.isActive
    )
    .forEach((extension) => {
      const extensionBox = document.createElement("div");
      extensionBox.classList.add("extension-box");
      extensionBox.dataset.active = extension.isActive;
      extensionBox.innerHTML = `
        <div class="extension-header">
          <img src="${extension.logo}" alt="${extension.name} Logo">
          <div>
            <h2>${extension.name}</h2>
            <p>${extension.description}</p>
          </div>
        </div>
        <div class="extension-footer">
          <button class="remove-button">Remove</button>
          <label class="switch">
            <input type="checkbox" data-name="${extension.name}" ${
        extension.isActive ? "checked" : ""
      }>
            <span class="slider"></span>
          </label>
        </div>
      `;
      container.appendChild(extensionBox);
    });

  attachToggleEvents();
};

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((b) => b.classList.remove("active"));
    button.classList.add("active");
    renderExtensions(button.dataset.filter);
  });
});

const attachRemoveEvents = () => {
  document.querySelectorAll(".remove-button").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const box = e.target.closest(".extension-box");
      const name = box.querySelector('input[type="checkbox"]').dataset.name;
      extensionToRemove = name;

      modal.classList.remove("hidden");
      app.classList.add("blur");
    });
  });
};

const attachToggleEvents = () => {
  document.querySelectorAll('input[type="checkbox"]').forEach((toggle) => {
    toggle.addEventListener("change", (e) => {
      const name = e.target.dataset.name;
      const extension = extensions.find((item) => item.name === name);

      if (extension) {
        extension.isActive = e.target.checked;
        const box = e.target.closest(".extension-box");
        box.dataset.active = extension.isActive;

        saveToLocalStorage();
      }
    });
  });

  attachRemoveEvents();
};

confirmBtn.addEventListener("click", () => {
  if (extensionToRemove) {
    const index = extensions.findIndex((ext) => ext.name === extensionToRemove);
    if (index !== -1) {
      extensions.splice(index, 1);
      saveToLocalStorage();
      renderExtensions(
        document.querySelector(".filter-button.active").textContent.trim()
      );
    }
    extensionToRemove = null;
    modal.classList.add("hidden");
    app.classList.remove("blur");
  }
});

cancelBtn.addEventListener("click", () => {
  extensionToRemove = null;
  modal.classList.add("hidden");
  app.classList.remove("blur");
});

initTheme();
renderExtensions();
