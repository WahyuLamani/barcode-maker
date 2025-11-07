class Autocomplete {
  constructor(container, options = {}) {
    this.container =
      typeof container === "string"
        ? document.querySelector(container)
        : container;
    this.options = {
      placeholder: "Ketik untuk mencari...",
      minChars: 2,
      dataKey: null,
      delay: 300,
      apiUrl: "",
      searchKey: "name",
      displayKeys: ["name"],
      subtitleKey: null,
      onSelect: null,
      multiSelect: false,
      selectedContainer: null,
      ...options,
    };

    this.selectedItems = [];
    this.searchTimeout = null;
    this.currentFocus = -1;
    this.allData = [];
    this.isLoading = false;

    this.init();
  }

  init() {
    this.createElements();
    this.bindEvents();
  }

  createElements() {
    this.wrapper = document.createElement("div");
    this.wrapper.className = "autocomplete-wrapper";

    this.input = document.createElement("input");
    this.input.type = "text";
    this.input.className = "autocomplete-input form-control";
    this.input.placeholder = this.options.placeholder;
    this.input.autocomplete = "off";

    this.icon = document.createElement("span");
    this.icon.className = "autocomplete-icon";
    this.icon.innerHTML = "🔍";

    this.dropdown = document.createElement("div");
    this.dropdown.className = "autocomplete-dropdown";

    this.wrapper.appendChild(this.input);
    this.wrapper.appendChild(this.icon);
    this.wrapper.appendChild(this.dropdown);

    this.container.appendChild(this.wrapper);

    if (this.options.selectedContainer) {
      this.selectedContainer =
        typeof this.options.selectedContainer === "string"
          ? document.querySelector(this.options.selectedContainer)
          : this.options.selectedContainer;
    }
  }

  bindEvents() {
    this.input.addEventListener("input", (e) => {
      const value = e.target.value.trim();

      clearTimeout(this.searchTimeout);

      if (value.length >= this.options.minChars) {
        this.searchTimeout = setTimeout(() => {
          this.fetchData(value);
        }, this.options.delay);
      } else {
        this.hideDropdown();
      }
    });

    this.input.addEventListener("keydown", (e) => {
      const items = this.dropdown.querySelectorAll(".autocomplete-item");

      if (e.key === "ArrowDown") {
        e.preventDefault();
        this.currentFocus++;
        this.setActive(items);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        this.currentFocus--;
        this.setActive(items);
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (this.currentFocus > -1 && items[this.currentFocus]) {
          items[this.currentFocus].click();
        }
      } else if (e.key === "Escape") {
        this.hideDropdown();
      }
    });

    this.dropdown.addEventListener("click", (e) => {
      const item = e.target.closest(".autocomplete-item");
      if (item) {
        const index = parseInt(item.dataset.index);
        this.selectItem(this.allData[index]);
      }
    });

    document.addEventListener("click", (e) => {
      if (!this.wrapper.contains(e.target)) {
        this.hideDropdown();
      }
    });
  }

  async fetchData(query) {
    if (!this.options.apiUrl) {
      console.error("API URL tidak ditentukan");
      return;
    }

    this.showLoading();

    try {
      const response = await fetch(this.options.apiUrl);
      const result = await response.json();

      const data = this.options.dataKey ? result[this.options.dataKey] : result;

      this.allData = Array.isArray(data)
        ? data.filter((item) => {
            const searchValue = item[this.options.searchKey];
            return (
              searchValue &&
              searchValue.toLowerCase().includes(query.toLowerCase())
            );
          })
        : [];

      this.renderResults(query);
    } catch (error) {
      console.error("Error fetching data:", error);
      this.showError("Gagal memuat data");
    } finally {
      this.hideLoading();
    }
  }

  renderResults(query) {
    this.dropdown.innerHTML = "";
    this.currentFocus = -1;

    if (this.allData.length === 0) {
      this.dropdown.innerHTML =
        '<div class="autocomplete-no-results">Tidak ada hasil ditemukan</div>';
      this.showDropdown();
      return;
    }

    this.allData.forEach((item, index) => {
      const div = document.createElement("div");
      div.className = "autocomplete-item";
      div.dataset.index = index;

      const title = document.createElement("div");
      title.className = "autocomplete-item-title";
      title.innerHTML = this.highlightMatch(
        item[this.options.displayKeys[0]],
        query
      );

      div.appendChild(title);

      if (this.options.subtitleKey && item[this.options.subtitleKey]) {
        const subtitle = document.createElement("div");
        subtitle.className = "autocomplete-item-subtitle";
        subtitle.textContent = item[this.options.subtitleKey];
        div.appendChild(subtitle);
      }

      this.dropdown.appendChild(div);
    });

    this.showDropdown();
  }

  highlightMatch(text, query) {
    if (!text) return "";
    const regex = new RegExp(`(${query})`, "gi");
    return text.replace(regex, "<mark>$1</mark>");
  }

  setActive(items) {
    if (!items || items.length === 0) return;

    if (this.currentFocus >= items.length) this.currentFocus = 0;
    if (this.currentFocus < 0) this.currentFocus = items.length - 1;

    items.forEach((item) => item.classList.remove("active"));
    items[this.currentFocus].classList.add("active");
    items[this.currentFocus].scrollIntoView({ block: "nearest" });
  }

  selectItem(item) {
    if (this.options.multiSelect) {
      // Buat unique key dari searchKey atau index
      const uniqueKey = item.id || item[this.options.searchKey];

      if (
        !this.selectedItems.find((i) => {
          const key = i.id || i[this.options.searchKey];
          return key === uniqueKey;
        })
      ) {
        this.selectedItems.push(item);
        this.renderSelectedItems();
      }
      this.input.value = "";
      this.input.focus();
      this.hideDropdown();
    } else {
      this.input.value = item[this.options.displayKeys[0]];
      this.hideDropdown();
    }

    if (this.options.onSelect) {
      this.options.onSelect(item);
    }
  }

  removeItem(itemKey) {
    this.selectedItems = this.selectedItems.filter((i) => {
      const key = i.id || i[this.options.searchKey];
      return key !== itemKey;
    });
    this.renderSelectedItems();
  }

  renderSelectedItems() {
    if (!this.selectedContainer) return;

    this.selectedContainer.innerHTML = "";

    this.selectedItems.forEach((item) => {
      const div = document.createElement("div");
      div.className = "selected-item";

      const text = document.createElement("span");
      text.textContent = item[this.options.displayKeys[0]];

      const removeBtn = document.createElement("button");
      removeBtn.className = "selected-item-remove";
      removeBtn.innerHTML = "×";

      // Gunakan id atau searchKey sebagai unique identifier
      const uniqueKey = item.id || item[this.options.searchKey];
      removeBtn.onclick = () => this.removeItem(uniqueKey);

      div.appendChild(text);
      div.appendChild(removeBtn);
      this.selectedContainer.appendChild(div);
    });
  }

  showLoading() {
    this.isLoading = true;
    this.input.classList.add("loading");
    this.dropdown.innerHTML =
      '<div class="autocomplete-loading">Memuat data...</div>';
    this.showDropdown();
  }

  hideLoading() {
    this.isLoading = false;
    this.input.classList.remove("loading");
  }

  showError(message) {
    this.dropdown.innerHTML = `<div class="autocomplete-no-results">${message}</div>`;
    this.showDropdown();
  }

  showDropdown() {
    this.dropdown.classList.add("show");
  }

  hideDropdown() {
    this.dropdown.classList.remove("show");
    this.currentFocus = -1;
  }

  getSelectedItems() {
    return this.selectedItems;
  }

  clear() {
    this.input.value = "";
    this.selectedItems = [];
    this.renderSelectedItems();
    this.hideDropdown();
  }
}
