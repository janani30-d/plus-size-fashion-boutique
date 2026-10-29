
/* =========================================
   CURVE & CO. - MAIN JAVASCRIPT
   File: js/main.js
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    const header = document.getElementById("curveHeader");
    const menuToggle = document.getElementById("curveMenuToggle");
    const mobilePanel = document.getElementById("curveMobilePanel");

    const desktopHome = document.querySelector(".curve-home-dropdown");
    const desktopHomeToggle = document.querySelector(".curve-home-toggle");

    const mobileHome = document.querySelector(".curve-mobile-home");
    const mobileHomeToggle = document.querySelector(
        ".curve-mobile-home-toggle"
    );

    const mobileHomeDropdown = document.getElementById(
        "curveMobileHomeDropdown"
    );

    if (!header || !menuToggle || !mobilePanel) {
        return;
    }

    const desktopBreakpoint = window.matchMedia("(min-width: 1200px)");

    /* =====================================
       HAMBURGER OPEN / CLOSE
    ====================================== */

    function openMobileMenu() {
        if (desktopBreakpoint.matches) return;

        mobilePanel.classList.add("is-open");
        mobilePanel.removeAttribute("inert");
        mobilePanel.setAttribute("aria-hidden", "false");

        menuToggle.setAttribute("aria-expanded", "true");
        menuToggle.setAttribute("aria-label", "Close navigation menu");

        document.body.classList.add("curve-menu-open");
    }

    function closeMobileMenu() {
        mobilePanel.classList.remove("is-open");
        mobilePanel.setAttribute("inert", "");
        mobilePanel.setAttribute("aria-hidden", "true");

        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");

        document.body.classList.remove("curve-menu-open");

        closeMobileHomeDropdown();
    }

    function toggleMobileMenu() {
        const isOpen =
            menuToggle.getAttribute("aria-expanded") === "true";

        if (isOpen) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    }

    menuToggle.addEventListener("click", toggleMobileMenu);


    /* =====================================
       MOBILE HOME DROPDOWN
    ====================================== */

    function openMobileHomeDropdown() {
        if (!mobileHomeToggle || !mobileHomeDropdown) return;

        mobileHomeDropdown.hidden = false;

        mobileHomeToggle.setAttribute("aria-expanded", "true");

        mobileHome?.classList.add("is-open");
    }

    function closeMobileHomeDropdown() {
        if (!mobileHomeToggle || !mobileHomeDropdown) return;

        mobileHomeDropdown.hidden = true;

        mobileHomeToggle.setAttribute("aria-expanded", "false");

        mobileHome?.classList.remove("is-open");
    }

    if (mobileHomeToggle && mobileHomeDropdown) {
        mobileHomeToggle.addEventListener("click", () => {
            const isExpanded =
                mobileHomeToggle.getAttribute("aria-expanded") === "true";

            if (isExpanded) {
                closeMobileHomeDropdown();
            } else {
                openMobileHomeDropdown();
            }
        });
    }


    /* =====================================
       DESKTOP HOME DROPDOWN
    ====================================== */

    function closeDesktopHomeDropdown() {
        if (!desktopHome || !desktopHomeToggle) return;

        desktopHome.classList.remove("is-open");
        desktopHomeToggle.setAttribute("aria-expanded", "false");
    }

    if (desktopHome && desktopHomeToggle) {
        desktopHomeToggle.addEventListener("click", (event) => {
            event.stopPropagation();

            const isExpanded =
                desktopHomeToggle.getAttribute("aria-expanded") === "true";

            closeDesktopHomeDropdown();

            if (!isExpanded) {
                desktopHome.classList.add("is-open");
                desktopHomeToggle.setAttribute("aria-expanded", "true");
            }
        });
    }


    /* =====================================
       CLOSE WHEN NAVIGATION LINK IS CLICKED
    ====================================== */

    mobilePanel.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            closeMobileMenu();
        });
    });


    /* =====================================
       CLOSE WHEN CLICKING OUTSIDE HEADER
    ====================================== */

    document.addEventListener("click", (event) => {
        if (!header.contains(event.target)) {
            closeMobileMenu();
            closeDesktopHomeDropdown();
        }
    });


    /* =====================================
       ESCAPE KEY
    ====================================== */

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            const menuWasOpen =
                menuToggle.getAttribute("aria-expanded") === "true";

            closeMobileMenu();
            closeDesktopHomeDropdown();

            if (menuWasOpen && !desktopBreakpoint.matches) {
                menuToggle.focus();
            }
        }
    });


    /* =====================================
       CLOSE MENU WHEN RETURNING TO DESKTOP
    ====================================== */

    function handleBreakpointChange(event) {
        if (event.matches) {
            closeMobileMenu();
            closeDesktopHomeDropdown();
        }
    }

    if (desktopBreakpoint.addEventListener) {
        desktopBreakpoint.addEventListener(
            "change",
            handleBreakpointChange
        );
    } else {
        desktopBreakpoint.addListener(handleBreakpointChange);
    }


    /* =====================================
       CLOSE MENU AFTER PAGE RESTORE
    ====================================== */

    window.addEventListener("pageshow", () => {
        closeMobileMenu();
    });
});







/* =========================================
   CURVE & CO. - RTL AND DARK MODE
   File: js/theme.js
========================================= */

document.addEventListener("DOMContentLoaded", () => {
    const root = document.documentElement;

    const rtlButtons = document.querySelectorAll("[data-curve-rtl]");
    const themeButtons = document.querySelectorAll("[data-curve-theme]");

    /* =====================================
       SAFE STORAGE HELPERS
    ====================================== */

    function readPreference(key) {
        try {
            return localStorage.getItem(key);
        } catch (error) {
            return null;
        }
    }

    function savePreference(key, value) {
        try {
            localStorage.setItem(key, value);
        } catch (error) {
            // The feature still works if storage is unavailable.
        }
    }


    /* =====================================
       RTL DIRECTION
    ====================================== */

    function applyDirection(isRTL) {
        root.setAttribute("dir", isRTL ? "rtl" : "ltr");

        root.setAttribute("lang", "en");

        rtlButtons.forEach((button) => {
            button.setAttribute(
                "aria-pressed",
                String(isRTL)
            );

            button.setAttribute(
                "title",
                isRTL ? "Switch to left-to-right" : "Switch to right-to-left"
            );

            button.setAttribute(
                "aria-label",
                isRTL ? "Switch to left-to-right layout" :
                    "Switch to right-to-left layout"
            );
        });

        savePreference("curve-co-direction", isRTL ? "rtl" : "ltr");
    }

    const savedDirection = readPreference("curve-co-direction");

    applyDirection(savedDirection === "rtl");

    rtlButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const currentlyRTL = root.getAttribute("dir") === "rtl";

            applyDirection(!currentlyRTL);
        });
    });


    /* =====================================
       DARK MODE
    ====================================== */

    function applyTheme(isDark) {
        root.setAttribute(
            "data-theme",
            isDark ? "dark" : "light"
        );

        themeButtons.forEach((button) => {
            button.setAttribute(
                "aria-pressed",
                String(isDark)
            );

            button.setAttribute(
                "title",
                isDark ? "Switch to light mode" : "Switch to dark mode"
            );

            button.setAttribute(
                "aria-label",
                isDark ? "Switch to light mode" : "Switch to dark mode"
            );
        });

        savePreference("curve-co-theme", isDark ? "dark" : "light");
    }

    const savedTheme = readPreference("curve-co-theme");

    applyTheme(savedTheme === "dark");

    themeButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const currentlyDark =
                root.getAttribute("data-theme") === "dark";

            applyTheme(!currentlyDark);
        });
    });

});












/********HOME-1****** */


/* =========================================
   CURVE & CO. - HOME 1 HERO SLIDER
========================================= */

document.addEventListener("DOMContentLoaded", function () {
    const hero = document.querySelector("#ccHome1Hero");

    if (!hero) return;

    const slides = Array.from(
        hero.querySelectorAll(".cc-home1-hero-slide")
    );

    const dots = Array.from(
        hero.querySelectorAll(".cc-home1-hero-dot")
    );

    if (slides.length === 0) return;

    let currentSlide = 0;
    let autoplayTimer = null;
    const slideInterval = 5000;

    function showSlide(index) {
        currentSlide = (index + slides.length) % slides.length;

        slides.forEach(function (slide, i) {
            const isActive = i === currentSlide;

            slide.classList.toggle("is-active", isActive);
            slide.setAttribute("aria-hidden", String(!isActive));
        });

        dots.forEach(function (dot, i) {
            const isActive = i === currentSlide;

            dot.classList.toggle("is-active", isActive);
            dot.setAttribute("aria-pressed", String(isActive));
        });
    }

    function nextSlide() {
        showSlide(currentSlide + 1);
    }

    function startAutoplay() {
        stopAutoplay();

        if (
            slides.length < 2 ||
            window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ) {
            return;
        }

        autoplayTimer = window.setInterval(nextSlide, slideInterval);
    }

    function stopAutoplay() {
        if (autoplayTimer !== null) {
            window.clearInterval(autoplayTimer);
            autoplayTimer = null;
        }
    }

    dots.forEach(function (dot, index) {
        dot.addEventListener("click", function () {
            showSlide(index);
            startAutoplay();
        });
    });

    /* Pause when the visitor hovers over the slider */
    hero.addEventListener("mouseenter", stopAutoplay);
    hero.addEventListener("mouseleave", startAutoplay);

    /* Pause while the visitor uses the keyboard inside the slider */
    hero.addEventListener("focusin", stopAutoplay);
    hero.addEventListener("focusout", function (event) {
        if (!hero.contains(event.relatedTarget)) {
            startAutoplay();
        }
    });

    /* Pause when the browser tab is hidden */
    document.addEventListener("visibilitychange", function () {
        if (document.hidden) {
            stopAutoplay();
        } else {
            startAutoplay();
        }
    });

    /* Initialize */
    showSlide(0);
    startAutoplay();
});












/* ==========================================
   CURVE & CO. — SHOP PRODUCTS
   File: js/shop-products.js
========================================== */

document.addEventListener("DOMContentLoaded", function () {
    const productGrid = document.getElementById("ccShopProductsGrid");
    const filterButtons = document.querySelectorAll(".cc-shop-filter-btn");
    const sortSelect = document.getElementById("ccShopSort");
    const productCount = document.getElementById("ccShopProductCount");
    const emptyMessage = document.getElementById("ccShopProductsEmpty");
    const viewAllButton = document.getElementById("ccShopViewAll");

    if (!productGrid) return;

    const products = Array.from(
        productGrid.querySelectorAll(".cc-shop-product-card")
    );

    let activeFilter = "all";

    /* FILTER AND SORT PRODUCTS */
    function updateProducts() {
        const sortValue = sortSelect ? sortSelect.value : "featured";

        const filteredProducts = products.filter(function (product) {
            const category = product.dataset.category;

            return activeFilter === "all" || category === activeFilter;
        });

        /* SORT PRODUCTS */
        filteredProducts.sort(function (a, b) {
            const priceA = Number(a.dataset.price) || 0;
            const priceB = Number(b.dataset.price) || 0;
            const nameA = (a.dataset.name || "").toLowerCase();
            const nameB = (b.dataset.name || "").toLowerCase();
            const orderA = Number(a.dataset.order) || 0;
            const orderB = Number(b.dataset.order) || 0;

            switch (sortValue) {
                case "price-low":
                    return priceA - priceB;

                case "price-high":
                    return priceB - priceA;

                case "name":
                    return nameA.localeCompare(nameB);

                case "featured":
                default:
                    return orderA - orderB;
            }
        });

        /* HIDE ALL PRODUCTS BEFORE REORDERING */
        products.forEach(function (product) {
            product.hidden = true;
        });

        /* SHOW MATCHING PRODUCTS IN SORTED ORDER */
        filteredProducts.forEach(function (product) {
            product.hidden = false;
            productGrid.appendChild(product);
        });

        /* UPDATE PRODUCT COUNT */
        if (productCount) {
            productCount.textContent = filteredProducts.length;
        }

        /* SHOW EMPTY STATE WHEN NEEDED */
        if (emptyMessage) {
            emptyMessage.hidden = filteredProducts.length !== 0;
        }
    }

    /* CATEGORY FILTER BUTTONS */
    filterButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            activeFilter = button.dataset.filter || "all";

            filterButtons.forEach(function (filterButton) {
                const isActive = filterButton === button;

                filterButton.classList.toggle("is-active", isActive);
                filterButton.setAttribute(
                    "aria-pressed",
                    String(isActive)
                );
            });

            updateProducts();
        });
    });

    /* SORT DROPDOWN */
    if (sortSelect) {
        sortSelect.addEventListener("change", updateProducts);
    }

    /* VIEW ALL PRODUCTS BUTTON */
    if (viewAllButton) {
        viewAllButton.addEventListener("click", function () {
            activeFilter = "all";

            filterButtons.forEach(function (button) {
                const isActive = button.dataset.filter === "all";

                button.classList.toggle("is-active", isActive);
                button.setAttribute(
                    "aria-pressed",
                    String(isActive)
                );
            });

            if (sortSelect) {
                sortSelect.value = "featured";
            }

            updateProducts();

            productGrid.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        });
    }

    /* INITIAL DISPLAY */
    updateProducts();

    /* QUICK ADD PLACEHOLDER
       Connect this event to your real shopping cart when available. */
    const quickAddButtons = document.querySelectorAll(
        ".cc-shop-product-add"
    );

    quickAddButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            const productName = button.dataset.product || "Product";

            /* Temporary feedback only — no cart is updated here. */
            button.setAttribute("aria-live", "polite");
            button.textContent = productName + " — Cart not connected";

            window.setTimeout(function () {
                button.innerHTML =
                    'Quick Add <span aria-hidden="true">+</span>';
            }, 1800);
        });
    });
});







/* =========================================
   CURVE & CO. — FIT GUIDE SIZE CHART
   File: js/fit-guide-size.js
========================================= */

document.addEventListener("DOMContentLoaded", function () {

    const sizeSections = document.querySelectorAll(".cc-fit-size");

    sizeSections.forEach(function (section) {

        const unitButtons = section.querySelectorAll(
            ".cc-fit-size-unit-btn"
        );

        const measurementCells = section.querySelectorAll(
            "td[data-inches][data-cm]"
        );

        if (!unitButtons.length || !measurementCells.length) {
            return;
        }

        function updateMeasurements(unit) {

            measurementCells.forEach(function (cell) {

                const value = cell.dataset[unit];

                if (value !== undefined) {
                    cell.textContent = value;
                }

            });

            unitButtons.forEach(function (button) {

                const isActive = button.dataset.unit === unit;

                button.classList.toggle("active", isActive);

                button.setAttribute(
                    "aria-pressed",
                    String(isActive)
                );

            });

        }

        unitButtons.forEach(function (button) {

            button.addEventListener("click", function () {

                const selectedUnit = button.dataset.unit;

                if (
                    selectedUnit === "inches" ||
                    selectedUnit === "cm"
                ) {
                    updateMeasurements(selectedUnit);
                }

            });

        });

        // Default unit: inches
        updateMeasurements("inches");

    });

});











/* =========================================
   SCROLL TO TOP FUNCTIONALITY
========================================= */

document.addEventListener("DOMContentLoaded", function () {
    const scrollTopButton = document.getElementById("ccScrollTop");

    if (!scrollTopButton) return;

    function toggleScrollButton() {
        scrollTopButton.classList.toggle(
            "is-visible",
            window.scrollY > 300
        );
    }

    window.addEventListener("scroll", toggleScrollButton, {
        passive: true
    });

    scrollTopButton.addEventListener("click", function () {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    });

    toggleScrollButton();
});
