/* ============================================
   WEBCRAFT STUDIO — script.js
   Til almashtirish, Theme, Animatsiya, Menyu
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ===== 1. LOADER ===== */
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.classList.add('hidden');
        }, 500);
    });
    // Fallback: agar load hodisasi kechiksa
    setTimeout(() => loader.classList.add('hidden'), 2500);


    /* ===== 2. THEME TOGGLE (Light/Dark) ===== */
    const themeToggle = document.getElementById('themeToggle');
    const themeIcon = themeToggle.querySelector('i');
    const html = document.documentElement;

    // Saqlangan rejimni tekshirish
    const savedTheme = localStorage.getItem('theme') || 'dark';
    html.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    themeToggle.addEventListener('click', () => {
        const current = html.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        updateThemeIcon(next);
    });

    function updateThemeIcon(theme) {
        themeIcon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    }


    /* ===== 3. TIL ALMASHTIRISH (UZ/EN/RU) ===== */
    const langButtons = document.querySelectorAll('.lang-btn');
    const defaultLang = 'uz';

    // Saqlangan tilni yuklash
    let currentLang = localStorage.getItem('lang') || defaultLang;
    setLanguage(currentLang);

    langButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.dataset.lang;
            setLanguage(lang);
            localStorage.setItem('lang', lang);
        });
    });

    function setLanguage(lang) {
        currentLang = lang;

        // Tugmalarni yangilash
        langButtons.forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });

        // Matnlarni almashtirish
        document.querySelectorAll('[data-uz]').forEach(el => {
            const text = el.dataset[lang];
            if (text) el.textContent = text;
        });

        // Placeholderlarni almashtirish
        document.querySelectorAll('[data-ph-uz]').forEach(el => {
            const ph = el.dataset['ph' + capitalize(lang)];
            if (ph) el.placeholder = ph;
        });

        // HTML lang atributini yangilash
        document.documentElement.lang = lang;
    }

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }


    /* ===== 4. NAVBAR SCROLL EFFECT ===== */
    const navbar = document.getElementById('navbar');
    const scrollTopBtn = document.getElementById('scrollTop');

    window.addEventListener('scroll', () => {
        const y = window.scrollY;

        // Navbar
        navbar.classList.toggle('scrolled', y > 50);

        // Scroll top tugmasi
        scrollTopBtn.classList.toggle('visible', y > 400);

        // Active nav link
        updateActiveLink();
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });


    /* ===== 5. MOBIL MENYU ===== */
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Menyu havolasini bosganda yopish
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });


    /* ===== 6. ACTIVE NAV LINK ===== */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    function updateActiveLink() {
        const scrollPos = window.scrollY + 150;

        sections.forEach(section => {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(link => {
                    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
                });
            }
        });
    }


    /* ===== 7. SCROLL REVEAL ANIMATION ===== */
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 80);
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));


    /* ===== 8. CONTACT FORM ===== */
    const contactForm = document.getElementById('contactForm');

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const btn = contactForm.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;

        // Yuklanish holati
        btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
        btn.disabled = true;

        const formData = {
            name: contactForm.name.value,
            email: contactForm.email.value,
            subject: contactForm.subject.value,
            message: contactForm.message.value
        };

        try {
            // Formspree orqali yuborish (keyinroq o'z ID'ingizni qo'yasiz)
            // Hozircha demo — 1.5 sekunddan keyin muvaffaqiyat ko'rsatamiz
            await new Promise(resolve => setTimeout(resolve, 1500));

            showMessage('success', getSuccessMessage());
            contactForm.reset();
        } catch (error) {
            showMessage('error', getErrorMessage());
        } finally {
            btn.innerHTML = originalText;
            btn.disabled = false;
        }
    });

    function getSuccessMessage() {
        const msgs = {
            uz: 'Xabaringiz yuborildi! Tez orada javob beramiz.',
            en: 'Your message has been sent! We will reply soon.',
            ru: 'Ваше сообщение отправлено! Мы скоро ответим.'
        };
        return msgs[currentLang] || msgs.uz;
    }

    function getErrorMessage() {
        const msgs = {
            uz: 'Xatolik yuz berdi. Iltimos, qayta urinib ko\'ring.',
            en: 'An error occurred. Please try again.',
            ru: 'Произошла ошибка. Пожалуйста, попробуйте снова.'
        };
        return msgs[currentLang] || msgs.uz;
    }

    function showMessage(type, text) {
        const old = document.querySelector('.form-message');
        if (old) old.remove();

        const msg = document.createElement('div');
        msg.className = `form-message ${type}`;
        msg.textContent = text;

        const styles = {
            success: 'background: rgba(39, 201, 63, 0.15); border: 1px solid rgba(39, 201, 63, 0.4); color: #27c93f;',
            error: 'background: rgba(255, 95, 86, 0.15); border: 1px solid rgba(255, 95, 86, 0.4); color: #ff5f56;'
        };

        msg.style.cssText = `
            padding: 14px 18px;
            border-radius: 10px;
            font-size: 0.9rem;
            margin-top: 8px;
            text-align: center;
            animation: fadeUp 0.4s ease;
            ${styles[type]}
        `;

        contactForm.appendChild(msg);

        setTimeout(() => {
            msg.style.opacity = '0';
            msg.style.transition = 'opacity 0.4s';
            setTimeout(() => msg.remove(), 400);
        }, 4000);
    }


    /* ===== 9. SMOOTH SCROLL (eski brauzerlar uchun) ===== */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const offset = 80;
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });


    /* ===== 10. PARALLAX EFFECT (Hero orbs) ===== */
    const orbs = document.querySelectorAll('.gradient-orb');

    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        orbs.forEach((orb, i) => {
            const speed = i === 0 ? 0.3 : 0.2;
            orb.style.transform = `translateY(${y * speed}px)`;
        });
    });

});
