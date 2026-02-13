document.addEventListener('DOMContentLoaded', () => {
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const fadeElements = document.querySelectorAll('.fade-in');
    fadeElements.forEach(el => observer.observe(el));

    // Smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Mobile drawer (hamburger) handling
    const hamburger = document.getElementById('hamburger');
    const drawer = document.getElementById('mobile-drawer');
    const overlay = document.getElementById('drawer-overlay');
    const drawerClose = document.getElementById('drawer-close');

    function openDrawer() {
        if (!drawer) return;
        drawer.classList.add('open');
        overlay.classList.add('active');
        drawer.setAttribute('aria-hidden', 'false');
        hamburger.setAttribute('aria-expanded', 'true');
        document.body.classList.add('drawer-open');
        overlay.hidden = false;
    }

    function closeDrawer() {
        if (!drawer) return;
        drawer.classList.remove('open');
        overlay.classList.remove('active');
        drawer.setAttribute('aria-hidden', 'true');
        hamburger.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('drawer-open');
        // hide after transition for accessibility
        setTimeout(() => overlay.hidden = true, 300);
    }

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            const isOpen = drawer.classList.contains('open');
            if (isOpen) closeDrawer(); else openDrawer();
        });
    }

    if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
    if (overlay) overlay.addEventListener('click', closeDrawer);

    // Close drawer on navigation link click (mobile friendly)
    const drawerLinks = document.querySelectorAll('.mobile-drawer .drawer-nav a');
    drawerLinks.forEach(l => l.addEventListener('click', () => {
        closeDrawer();
    }));

    // Close on Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeDrawer();
    });
    // Contact Form Handling
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');
    const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxuSdWv2c5FpqPCZ_xJmZw-9zHYmmaWdibGqyHglsFsSZh-orAG9-IZMoD4CAcvcMpKzA/exec';

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();

            const btn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = btn.innerText;

            // Loading State
            btn.disabled = true;
            btn.innerText = 'Sending...';
            formStatus.innerHTML = '<div class="loading-spinner"></div> Sending your details...';

            // Convert FormData to URLSearchParams for reliable 'no-cors' submission
            const formData = new FormData(contactForm);
            const data = new URLSearchParams();
            for (const pair of formData) {
                data.append(pair[0], pair[1]);
            }

            fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                body: data
            })
                .then(response => {
                    // With no-cors, we get an opaque response.
                    // We assume success if the network request didn't fail.
                    formStatus.innerHTML = '<span class="success-message">Thank you! Your details have been submitted successfully. I will be in touch shortly.</span>';
                    contactForm.reset();
                })
                .catch(error => {
                    formStatus.innerHTML = '<span class="error-message">Something went wrong. Please try again or contact me directly via WhatsApp/Email.</span>';
                    console.error('Error!', error.message);
                })
                .finally(() => {
                    btn.disabled = false;
                    btn.innerText = originalBtnText;
                    // Clear success message after 5 seconds
                    setTimeout(() => {
                        if (formStatus.querySelector('.success-message')) {
                            formStatus.innerHTML = '';
                        }
                    }, 8000);
                });
        });
    }
});
