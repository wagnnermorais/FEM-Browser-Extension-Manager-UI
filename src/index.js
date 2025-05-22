import data from "./database/data.json";

const container = document.querySelector("main");
const filterButtons = document.querySelectorAll(".filter-button");
const savedState = JSON.parse(localStorage.getItem("extensionsState"));

const extensions = savedState
  ? data.map((ext) => {
      const saved = savedState.find((e) => e.name === ext.name);
      return saved ? { ...ext, isActive: saved.isActive } : ext;
    })
  : [...data];

const saveToLocalStorage = () => {
  localStorage.setItem("extensionsState", JSON.stringify(extensions));
};

const renderExtensions = () => {
  container.innerHTML = "";

  extensions.forEach((extension) => {
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

    const filter = button.textContent.trim();

    document.querySelectorAll(".extension-box").forEach((box) => {
      const isActive = box.dataset.active === "true";

      if (filter === "All") {
        box.style.display = "block";
      } else if (filter === "Active") {
        box.style.display = isActive ? "block" : "none";
      } else if (filter === "Inactive") {
        box.style.display = !isActive ? "block" : "none";
      }
    });
  });
});

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
};

renderExtensions();
