const getStoredTheme = () => localStorage.getItem("theme");

const getPreferredTheme = () => {
    const storedTheme = getStoredTheme();
    if (["light", "dark"].includes(storedTheme)) {
        return storedTheme;
    }
    return "dark";
};

const setTheme = theme => {
        document.documentElement.setAttribute("data-bs-theme", theme);
};

(() => {
    "use strict";
    setTheme(getPreferredTheme());
})();
