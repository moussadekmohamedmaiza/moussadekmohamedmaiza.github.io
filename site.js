(() => {
    const root = document.documentElement;
    const themeButton = document.querySelector("[data-theme-toggle]");
    const themeStorageKey = "maiza-site-theme";

    let savedTheme = null;
    try { savedTheme = localStorage.getItem(themeStorageKey); } catch (_) {}
    if (savedTheme === "dark" || savedTheme === "light") root.dataset.theme = savedTheme;

    const updateThemeButton = () => {
        if (!themeButton) return;
        const dark = root.dataset.theme === "dark";
        themeButton.textContent = dark ? "☀ Light" : "☾ Dark";
        themeButton.setAttribute("aria-label", dark ? "Switch to light theme" : "Switch to dark theme");
        themeButton.setAttribute("aria-pressed", String(dark));
    };
    updateThemeButton();
    themeButton?.addEventListener("click", () => {
        root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
        try { localStorage.setItem(themeStorageKey, root.dataset.theme); } catch (_) {}
        updateThemeButton();
    });

    const menuButton = document.querySelector("[data-menu-toggle]");
    const menu = document.querySelector("[data-menu]");
    menuButton?.addEventListener("click", () => {
        const open = menuButton.getAttribute("aria-expanded") !== "true";
        menuButton.setAttribute("aria-expanded", String(open));
        menu?.classList.toggle("is-open", open);
        menuButton.textContent = open ? "Close" : "Menu";
    });
    menu?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
        menu.classList.remove("is-open");
        menuButton?.setAttribute("aria-expanded", "false");
        if (menuButton) menuButton.textContent = "Menu";
    }));

    const papers = [...document.querySelectorAll("[data-paper]")];
    const search = document.querySelector("[data-paper-search]");
    const filters = [...document.querySelectorAll("[data-filter]")];
    const emptyState = document.querySelector("[data-empty-state]");
    let activeFilter = "all";
    const applyPaperFilters = () => {
        if (!papers.length) return;
        const query = (search?.value || "").trim().toLowerCase();
        let visible = 0;
        papers.forEach((paper) => {
            const text = `${paper.dataset.search || ""} ${paper.textContent}`.toLowerCase();
            const tags = (paper.dataset.tags || "").split(/\s+/);
            const matches = (!query || text.includes(query)) && (activeFilter === "all" || tags.includes(activeFilter));
            paper.hidden = !matches;
            if (matches) visible += 1;
        });
        if (emptyState) emptyState.style.display = visible ? "none" : "block";
    };
    search?.addEventListener("input", applyPaperFilters);
    filters.forEach((button) => button.addEventListener("click", () => {
        activeFilter = button.dataset.filter || "all";
        filters.forEach((item) => item.setAttribute("aria-pressed", String(item === button)));
        applyPaperFilters();
    }));
    applyPaperFilters();

    document.querySelectorAll("[data-year]").forEach((node) => {
        node.textContent = String(new Date().getFullYear());
    });

    document.querySelector("[data-print]")?.addEventListener("click", () => window.print());
})();
