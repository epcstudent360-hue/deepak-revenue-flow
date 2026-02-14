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

            // Get form data
            const formData = new FormData(contactForm);
            const data = new URLSearchParams();
            for (const pair of formData) {
                data.append(pair[0], pair[1]);
            }

            // Log data being sent (for debugging)
            console.log('Form data being sent:', Object.fromEntries(data));

            fetch(SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                body: data
            })
                .then(response => {
                    // With no-cors, we get an opaque response.
                    // We assume success if the network request didn't fail.
                    console.log('Form submitted successfully');
                    formStatus.innerHTML = '<span class="success-message">Thank you! Your details have been submitted successfully. I will be in touch shortly.</span>';
                    contactForm.reset();
                })
                .catch(error => {
                    console.error('Form submission error:', error);
                    formStatus.innerHTML = '<span class="error-message">Something went wrong. Please try again or contact me directly via WhatsApp/Email.</span>';
                })
                .finally(() => {
                    btn.disabled = false;
                    btn.innerText = originalBtnText;
                    // Clear success message after 8 seconds
                    setTimeout(() => {
                        if (formStatus.querySelector('.success-message')) {
                            formStatus.innerHTML = '';
                        }
                    }, 8000);
                });
        });
    }

    // Country code handling for phone input
    const countrySelect = document.getElementById('country-code');
    const phoneInput = document.getElementById('phone');
    const countryCodeBtn = document.getElementById('country-code-btn');
    const countryCodeDropdown = document.getElementById('country-code-dropdown');
    const countryCodeSearch = document.getElementById('country-code-search');
    const countryCodeList = document.getElementById('country-code-list');
    const countryCodeDisplay = document.querySelector('.country-code-display');

    // Country data with flags and lengths
    const countryData = [
        { name: 'India', flag: '🇮🇳', code: '+91', length: '10' },
        { name: 'Afghanistan', flag: '🇦🇫', code: '+93'},
        { name: 'Albania', flag: '🇦🇱', code: '+355'},
        { name: 'Algeria', flag: '🇩🇿', code: '+213'},
        { name: 'Andorra', flag: '🇦🇩', code: '+376'},
        { name: 'Angola', flag: '🇦🇴', code: '+244'},
        { name: 'Argentina', flag: '🇦🇷', code: '+54'},
        { name: 'Armenia', flag: '🇦🇲', code: '+374'},
        { name: 'Australia', flag: '🇦🇺', code: '+61', length: '9'},
        { name: 'Austria', flag: '🇦🇹', code: '+43'},
        { name: 'Azerbaijan', flag: '🇦🇿', code: '+994'},
        { name: 'Bahamas', flag: '🇧🇸', code: '+1'},
        { name: 'Bahrain', flag: '🇧🇭', code: '+973'},
        { name: 'Bangladesh', flag: '🇧🇩', code: '+880'},
        { name: 'Barbados', flag: '🇧🇧', code: '+1'},
        { name: 'Belarus', flag: '🇧🇾', code: '+375'},
        { name: 'Belgium', flag: '🇧🇪', code: '+32'},
        { name: 'Belize', flag: '🇧🇿', code: '+501'},
        { name: 'Benin', flag: '🇧🇯', code: '+229'},
        { name: 'Bermuda', flag: '🇧🇲', code: '+1'},
        { name: 'Bhutan', flag: '🇧🇹', code: '+975'},
        { name: 'Bolivia', flag: '🇧🇴', code: '+591'},
        { name: 'Bosnia & Herzegovina', flag: '🇧🇦', code: '+387'},
        { name: 'Botswana', flag: '🇧🇼', code: '+267'},
        { name: 'Brazil', flag: '🇧🇷', code: '+55'},
        { name: 'British Virgin Islands', flag: '🇻🇬', code: '+1'},
        { name: 'Brunei', flag: '🇧🇳', code: '+673'},
        { name: 'Bulgaria', flag: '🇧🇬', code: '+359'},
        { name: 'Burkina Faso', flag: '🇧🇫', code: '+226'},
        { name: 'Burundi', flag: '🇧🇮', code: '+257'},
        { name: 'Cambodia', flag: '🇰🇭', code: '+855'},
        { name: 'Cameroon', flag: '🇨🇲', code: '+237'},
        { name: 'Canada', flag: '🇨🇦', code: '+1'},
        { name: 'Cape Verde', flag: '🇨🇻', code: '+238'},
        { name: 'Cayman Islands', flag: '🇰🇾', code: '+1'},
        { name: 'Central African Republic', flag: '🇨🇫', code: '+236'},
        { name: 'Chad', flag: '🇹🇩', code: '+235'},
        { name: 'Chile', flag: '🇨🇱', code: '+56'},
        { name: 'China', flag: '🇨🇳', code: '+86'},
        { name: 'Colombia', flag: '🇨🇴', code: '+57'},
        { name: 'Comoros', flag: '🇰🇲', code: '+269'},
        { name: 'Congo', flag: '🇨🇬', code: '+242'},
        { name: 'Costa Rica', flag: '🇨🇷', code: '+506'},
        { name: 'Croatia', flag: '🇭🇷', code: '+385'},
        { name: 'Cuba', flag: '🇨🇺', code: '+53'},
        { name: 'Cyprus', flag: '🇨🇾', code: '+357'},
        { name: 'Czech Republic', flag: '🇨🇿', code: '+420'},
        { name: 'DR Congo', flag: '🇨🇩', code: '+243'},
        { name: 'Denmark', flag: '🇩🇰', code: '+45'},
        { name: 'Djibouti', flag: '🇩🇯', code: '+253'},
        { name: 'Dominica', flag: '🇩🇲', code: '+1'},
        { name: 'Dominican Republic', flag: '🇩🇴', code: '+1'},
        { name: 'Ecuador', flag: '🇪🇨', code: '+593'},
        { name: 'Egypt', flag: '🇪🇬', code: '+20'},
        { name: 'El Salvador', flag: '🇸🇻', code: '+503'},
        { name: 'Equatorial Guinea', flag: '🇬🇶', code: '+240'},
        { name: 'Eritrea', flag: '🇪🇷', code: '+291'},
        { name: 'Estonia', flag: '🇪🇪', code: '+372'},
        { name: 'Eswatini', flag: '🇸🇿', code: '+268'},
        { name: 'Ethiopia', flag: '🇪🇹', code: '+251'},
        { name: 'Faroe Islands', flag: '🇫🇴', code: '+298'},
        { name: 'Fiji', flag: '🇫🇯', code: '+679'},
        { name: 'Finland', flag: '🇫🇮', code: '+358'},
        { name: 'France', flag: '🇫🇷', code: '+33'},
        { name: 'French Guiana', flag: '🇬🇫', code: '+594'},
        { name: 'Gabon', flag: '🇬🇦', code: '+241'},
        { name: 'Gambia', flag: '🇬🇲', code: '+220'},
        { name: 'Georgia', flag: '🇬🇪', code: '+995'},
        { name: 'Germany', flag: '🇩🇪', code: '+49'},
        { name: 'Ghana', flag: '🇬🇭', code: '+233'},
        { name: 'Gibraltar', flag: '🇬🇮', code: '+350'},
        { name: 'Greece', flag: '🇬🇷', code: '+30'},
        { name: 'Greenland', flag: '🇬🇱', code: '+299'},
        { name: 'Grenada', flag: '🇬🇩', code: '+1'},
        { name: 'Guadeloupe', flag: '🇬🇵', code: '+590'},
        { name: 'Guam', flag: '🇬🇺', code: '+1'},
        { name: 'Guatemala', flag: '🇬🇹', code: '+502'},
        { name: 'Guernsey', flag: '🇬🇬', code: '+44'},
        { name: 'Guinea', flag: '🇬🇳', code: '+224'},
        { name: 'Guinea-Bissau', flag: '🇬🇼', code: '+245'},
        { name: 'Guyana', flag: '🇬🇾', code: '+592'},
        { name: 'Haiti', flag: '🇭🇹', code: '+509'},
        { name: 'Honduras', flag: '🇭🇳', code: '+504'},
        { name: 'Hong Kong', flag: '🇭🇰', code: '+852'},
        { name: 'Hungary', flag: '🇭🇺', code: '+36'},
        { name: 'Iceland', flag: '🇮🇸', code: '+354'},
        { name: 'Indonesia', flag: '🇮🇩', code: '+62'},
        { name: 'Iran', flag: '🇮🇷', code: '+98'},
        { name: 'Iraq', flag: '🇮🇶', code: '+964'},
        { name: 'Ireland', flag: '🇮🇪', code: '+353'},
        { name: 'Isle of Man', flag: '🇮🇲', code: '+44'},
        { name: 'Israel', flag: '🇮🇱', code: '+972'},
        { name: 'Italy', flag: '🇮🇹', code: '+39'},
        { name: 'Jamaica', flag: '🇯🇲', code: '+1'},
        { name: 'Japan', flag: '🇯🇵', code: '+81'},
        { name: 'Jersey', flag: '🇯🇪', code: '+44'},
        { name: 'Jordan', flag: '🇯🇴', code: '+962'},
        { name: 'Kazakhstan', flag: '🇰🇿', code: '+7'},
        { name: 'Kenya', flag: '🇰🇪', code: '+254'},
        { name: 'Kiribati', flag: '🇰🇮', code: '+686'},
        { name: 'Kuwait', flag: '🇰🇼', code: '+965'},
        { name: 'Kyrgyzstan', flag: '🇰🇬', code: '+996'},
        { name: 'Laos', flag: '🇱🇦', code: '+856'},
        { name: 'Latvia', flag: '🇱🇻', code: '+371'},
        { name: 'Lebanon', flag: '🇱🇧', code: '+961'},
        { name: 'Lesotho', flag: '🇱🇸', code: '+266'},
        { name: 'Liberia', flag: '🇱🇷', code: '+231'},
        { name: 'Libya', flag: '🇱🇾', code: '+218'},
        { name: 'Liechtenstein', flag: '🇱🇮', code: '+423'},
        { name: 'Lithuania', flag: '🇱🇹', code: '+370'},
        { name: 'Luxembourg', flag: '🇱🇺', code: '+352'},
        { name: 'Macao', flag: '🇲🇴', code: '+853'},
        { name: 'Madagascar', flag: '🇲🇬', code: '+261'},
        { name: 'Malawi', flag: '🇲🇼', code: '+265'},
        { name: 'Malaysia', flag: '🇲🇾', code: '+60'},
        { name: 'Maldives', flag: '🇲🇻', code: '+960'},
        { name: 'Mali', flag: '🇲🇱', code: '+223'},
        { name: 'Malta', flag: '🇲🇹', code: '+356'},
        { name: 'Martinique', flag: '🇲🇶', code: '+596'},
        { name: 'Mauritania', flag: '🇲🇷', code: '+222'},
        { name: 'Mauritius', flag: '🇲🇺', code: '+230'},
        { name: 'Mayotte', flag: '🇾🇹', code: '+262'},
        { name: 'Mexico', flag: '🇲🇽', code: '+52'},
        { name: 'Moldova', flag: '🇲🇩', code: '+373'},
        { name: 'Monaco', flag: '🇲🇨', code: '+377'},
        { name: 'Mongolia', flag: '🇲🇳', code: '+976'},
        { name: 'Montenegro', flag: '🇲🇪', code: '+382'},
        { name: 'Montserrat', flag: '🇲🇸', code: '+1'},
        { name: 'Morocco', flag: '🇲🇦', code: '+212'},
        { name: 'Mozambique', flag: '🇲🇿', code: '+258'},
        { name: 'Myanmar', flag: '🇲🇲', code: '+95'},
        { name: 'Namibia', flag: '🇳🇦', code: '+264'},
        { name: 'Nauru', flag: '🇳🇷', code: '+674'},
        { name: 'Nepal', flag: '🇳🇵', code: '+977'},
        { name: 'Netherlands', flag: '🇳🇱', code: '+31'},
        { name: 'New Caledonia', flag: '🇳🇨', code: '+687'},
        { name: 'New Zealand', flag: '🇳🇿', code: '+64'},
        { name: 'Nicaragua', flag: '🇳🇮', code: '+505'},
        { name: 'Niger', flag: '🇳🇪', code: '+227'},
        { name: 'Nigeria', flag: '🇳🇬', code: '+234'},
        { name: 'Niue', flag: '🇳🇺', code: '+683'},
        { name: 'North Korea', flag: '🇰🇵', code: '+850'},
        { name: 'North Macedonia', flag: '🇲🇰', code: '+389'},
        { name: 'Northern Mariana Islands', flag: '🇲🇵', code: '+1'},
        { name: 'Norway', flag: '🇳🇴', code: '+47'},
        { name: 'Oman', flag: '🇴🇲', code: '+968'},
        { name: 'Pakistan', flag: '🇵🇰', code: '+92'},
        { name: 'Palau', flag: '🇵🇼', code: '+680'},
        { name: 'Palestine', flag: '🇵🇸', code: '+970'},
        { name: 'Panama', flag: '🇵🇦', code: '+507'},
        { name: 'Papua New Guinea', flag: '🇵🇬', code: '+675'},
        { name: 'Paraguay', flag: '🇵🇾', code: '+595'},
        { name: 'Peru', flag: '🇵🇪', code: '+51'},
        { name: 'Philippines', flag: '🇵🇭', code: '+63'},
        { name: 'Poland', flag: '🇵🇱', code: '+48'},
        { name: 'Portugal', flag: '🇵🇹', code: '+351'},
        { name: 'Puerto Rico', flag: '🇵🇷', code: '+1'},
        { name: 'Qatar', flag: '🇶🇦', code: '+974'},
        { name: 'Reunion', flag: '🇷🇪', code: '+262'},
        { name: 'Romania', flag: '🇷🇴', code: '+40'},
        { name: 'Russia', flag: '🇷🇺', code: '+7'},
        { name: 'Rwanda', flag: '🇷🇼', code: '+250'},
        { name: 'Saint Kitts & Nevis', flag: '🇰🇳', code: '+1'},
        { name: 'Saint Lucia', flag: '🇱🇨', code: '+1'},
        { name: 'Saint Vincent & Grenadines', flag: '🇻🇨', code: '+1'},
        { name: 'Samoa', flag: '🇼🇸', code: '+685'},
        { name: 'San Marino', flag: '🇸🇲', code: '+378'},
        { name: 'Sao Tome & Principe', flag: '🇸🇹', code: '+239'},
        { name: 'Saudi Arabia', flag: '🇸🇦', code: '+966'},
        { name: 'Senegal', flag: '🇸🇳', code: '+221'},
        { name: 'Serbia', flag: '🇷🇸', code: '+381'},
        { name: 'Seychelles', flag: '🇸🇨', code: '+248'},
        { name: 'Sierra Leone', flag: '🇸🇱', code: '+232'},
        { name: 'Singapore', flag: '🇸🇬', code: '+65'},
        { name: 'Slovakia', flag: '🇸🇰', code: '+421'},
        { name: 'Slovenia', flag: '🇸🇮', code: '+386'},
        { name: 'Solomon Islands', flag: '🇸🇧', code: '+677'},
        { name: 'Somalia', flag: '🇸🇴', code: '+252'},
        { name: 'South Africa', flag: '🇿🇦', code: '+27'},
        { name: 'South Korea', flag: '🇰🇷', code: '+82'},
        { name: 'South Sudan', flag: '🇸🇸', code: '+211'},
        { name: 'Spain', flag: '🇪🇸', code: '+34'},
        { name: 'Sri Lanka', flag: '🇱🇰', code: '+94'},
        { name: 'Sudan', flag: '🇸🇩', code: '+249'},
        { name: 'Suriname', flag: '🇸🇷', code: '+597'},
        { name: 'Sweden', flag: '🇸🇪', code: '+46'},
        { name: 'Switzerland', flag: '🇨🇭', code: '+41'},
        { name: 'Syria', flag: '🇸🇾', code: '+963'},
        { name: 'Taiwan', flag: '🇹🇼', code: '+886'},
        { name: 'Tajikistan', flag: '🇹🇯', code: '+992'},
        { name: 'Tanzania', flag: '🇹🇿', code: '+255'},
        { name: 'Thailand', flag: '🇹🇭', code: '+66'},
        { name: 'Timor-Leste', flag: '🇹🇱', code: '+670'},
        { name: 'Togo', flag: '🇹🇬', code: '+228'},
        { name: 'Tonga', flag: '🇹🇴', code: '+676'},
        { name: 'Trinidad & Tobago', flag: '🇹🇹', code: '+1'},
        { name: 'Tunisia', flag: '🇹🇳', code: '+216'},
        { name: 'Turkey', flag: '🇹🇷', code: '+90'},
        { name: 'Turkmenistan', flag: '🇹🇲', code: '+993'},
        { name: 'Turks & Caicos', flag: '🇹🇨', code: '+1'},
        { name: 'Tuvalu', flag: '🇹🇻', code: '+688'},
        { name: 'Uganda', flag: '🇺🇬', code: '+256'},
        { name: 'Ukraine', flag: '🇺🇦', code: '+380'},
        { name: 'United Arab Emirates', flag: '🇦🇪', code: '+971'},
        { name: 'United Kingdom', flag: '🇬🇧', code: '+44'},
        { name: 'United States', flag: '🇺🇸', code: '+1'},
        { name: 'Uruguay', flag: '🇺🇾', code: '+598'},
        { name: 'Uzbekistan', flag: '🇺🇿', code: '+998'},
        { name: 'Vanuatu', flag: '🇻🇺', code: '+678'},
        { name: 'Venezuela', flag: '🇻🇪', code: '+58'},
        { name: 'Vietnam', flag: '🇻🇳', code: '+84'},
        { name: 'Virgin Islands (US)', flag: '🇻🇮', code: '+1'},
        { name: 'Yemen', flag: '🇾🇪', code: '+967'},
        { name: 'Zambia', flag: '🇿🇲', code: '+260'},
        { name: 'Zimbabwe', flag: '🇿🇼', code: '+263'}
    ];

    function renderCountryOptions(filterQuery = '') {
        const filtered = countryData.filter(c =>
            c.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
            c.code.includes(filterQuery)
        );

        countryCodeList.innerHTML = filtered.map((country, idx) => `
            <button type="button" class="country-code-option ${country.code === '+91' ? 'active' : ''}" data-code="${country.code}" data-length="${country.length || ''}">
                ${country.flag} ${country.name} ${country.code}
            </button>
        `).join('');

        if (filtered.length === 0) {
            countryCodeList.innerHTML = '<button type="button" disabled>No countries found</button>';
        }
    }

    function setSelectedCountry(code, displayText) {
        countryCodeDisplay.textContent = displayText;
        countrySelect.value = code;
        updatePhonePlaceholder();
        closeDropdown();
    }

    function openDropdown() {
        countryCodeDropdown.hidden = false;
        countryCodeBtn.setAttribute('aria-expanded', 'true');
        countryCodeSearch.focus();
    }

    function closeDropdown() {
        countryCodeDropdown.hidden = true;
        countryCodeBtn.setAttribute('aria-expanded', 'false');
        countryCodeSearch.value = '';
        renderCountryOptions();
    }

    function updatePhonePlaceholder() {
        const selected = countryData.find(c => c.code === countrySelect.value);
        const len = selected?.length;
        phoneInput.placeholder = len ? `Enter ${len}-digit phone number` : 'Enter phone number';
        if (len) {
            phoneInput.pattern = `\\d{${len}}`;
        } else {
            phoneInput.removeAttribute('pattern');
        }
    }

    // Initialize dropdown
    renderCountryOptions();

    // Button click to toggle
    countryCodeBtn.addEventListener('click', () => {
        const isExpanded = countryCodeBtn.getAttribute('aria-expanded') === 'true';
        if (isExpanded) closeDropdown();
        else openDropdown();
    });

    // Search functionality
    countryCodeSearch.addEventListener('input', (e) => {
        renderCountryOptions(e.target.value);
    });

    // Option selection
    countryCodeList.addEventListener('click', (e) => {
        if (e.target.classList.contains('country-code-option') && !e.target.disabled) {
            const code = e.target.dataset.code;
            const country = countryData.find(c => c.code === code);
            const displayText = `${country.flag} ${country.code}`;
            setSelectedCountry(code, displayText);
        }
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.country-code-wrapper')) {
            closeDropdown();
        }
    });

    // Keyboard navigation
    countryCodeSearch.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeDropdown();
        if (e.key === 'Enter') {
            const active = countryCodeList.querySelector('.country-code-option.active');
            if (active && !active.disabled) active.click();
        }
    });
});
