(() => {
    const root = document.documentElement;
    const body = document.body;
    const navToggle = document.querySelector(".nav-toggle");
    const themeToggle = document.querySelector(".theme-toggle");
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const storedTheme = localStorage.getItem("krishna-theme");
    const preferredTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    root.dataset.theme = storedTheme || preferredTheme;

    const closeNav = () => {
        body.classList.remove("nav-open");
        navToggle?.setAttribute("aria-expanded", "false");
    };

    navToggle?.addEventListener("click", () => {
        const isOpen = body.classList.toggle("nav-open");
        navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    document.querySelectorAll(".nav-link").forEach((link) => {
        link.addEventListener("click", closeNav);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") closeNav();
    });

    themeToggle?.addEventListener("click", () => {
        const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
        root.dataset.theme = nextTheme;
        localStorage.setItem("krishna-theme", nextTheme);
    });

    if (!reduceMotion && "IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("is-visible");
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: "0px 0px -60px 0px" });

        document.querySelectorAll(".reveal").forEach((element) => observer.observe(element));
    } else {
        document.querySelectorAll(".reveal").forEach((element) => element.classList.add("is-visible"));
    }

    document.querySelectorAll(".product-card").forEach((card) => {
        card.addEventListener("pointermove", (event) => {
            if (reduceMotion) return;
            const rect = card.getBoundingClientRect();
            const x = ((event.clientX - rect.left) / rect.width - 0.5) * 4;
            const y = ((event.clientY - rect.top) / rect.height - 0.5) * -4;
            card.style.transform = `perspective(900px) rotateX(${y}deg) rotateY(${x}deg) translateY(-5px)`;
        });
        card.addEventListener("pointerleave", () => {
            card.style.transform = "";
        });
    });

    const contactForm = document.querySelector(".contact-form");
    contactForm?.addEventListener("submit", (event) => {
        const requiredFields = [...contactForm.querySelectorAll("[required]")];
        const invalidField = requiredFields.find((field) => !String(field.value || "").trim());
        const status = contactForm.querySelector(".form-status");

        if (invalidField) {
            event.preventDefault();
            invalidField.focus();
            if (status) status.textContent = "Please complete the required fields before sending.";
            return;
        }

        if (status) status.textContent = "Opening your email client to send the enquiry.";
    });
})();
