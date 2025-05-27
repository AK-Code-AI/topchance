/**
 * Language switcher functionality
 * Supports Traditional Chinese (zh-hant), English (en), and Simplified Chinese (zh-hans)
 */

// Default language
const DEFAULT_LANG = 'zh-hant';

// Available languages
const LANGUAGES = {
    'zh-hant': '繁體',
    'en': 'EN',
    'zh-hans': '简体'
};

// Store translations
let translations = {};

// Get current language from localStorage or use default
const getCurrentLanguage = () => {
    return localStorage.getItem('language') || DEFAULT_LANG;
};

// Set current language in localStorage
const setCurrentLanguage = (lang) => {
    localStorage.setItem('language', lang);
};

// Update language button text
const updateLanguageButton = (lang) => {
    const langBtn = document.querySelector('.lang-btn');
    if (langBtn) {
        langBtn.innerHTML = `${LANGUAGES[lang]} <i class="fas fa-chevron-down"></i>`;
    }
};

// Load language file
const loadLanguage = async (lang) => {
    try {
        const response = await fetch(`/js/lang/${lang}.json`);
        if (!response.ok) {
            throw new Error(`Failed to load language file: ${lang}.json`);
        }
        return await response.json();
    } catch (error) {
        console.error(error);
        return null;
    }
};

// Apply translations to the page
const applyTranslations = (lang, data) => {
    if (!data) return;
    
    // Store translations for this language
    translations[lang] = data;
    
    // Update navigation items
    document.querySelectorAll('.nav-link').forEach(link => {
        const key = link.getAttribute('data-text');
        if (key && data.nav[key]) {
            link.setAttribute('data-text', data.nav[key]);
            link.textContent = data.nav[key];
        }
    });

    // Update buttons
    document.querySelectorAll('.btn-primary, .btn-secondary, .submit-btn, .cta-btn, .project-link, .related-link').forEach(btn => {
        const text = btn.textContent.trim();
        
        // Check for button text matches
        Object.entries(data.buttons).forEach(([key, value]) => {
            if (text.includes(translations[DEFAULT_LANG].buttons[key])) {
                btn.textContent = text.replace(
                    translations[DEFAULT_LANG].buttons[key], 
                    value
                );
            }
        });
    });

    // Update section titles and subtitles
    document.querySelectorAll('.section-title').forEach(title => {
        const text = title.textContent.trim();
        
        Object.entries(data.sections).forEach(([key, value]) => {
            if (text === translations[DEFAULT_LANG].sections[key]) {
                title.textContent = value;
            }
        });
    });

    document.querySelectorAll('.section-subtitle').forEach(subtitle => {
        const text = subtitle.textContent.trim();
        
        Object.entries(data.sections).forEach(([key, value]) => {
            const subtitleKey = `${key}_subtitle`;
            if (subtitleKey in data.sections && text === translations[DEFAULT_LANG].sections[subtitleKey]) {
                subtitle.textContent = data.sections[subtitleKey];
            }
        });
    });

    // Update footer sections
    document.querySelectorAll('.footer-links h3, .footer-services h3, .footer-newsletter h3').forEach(heading => {
        const text = heading.textContent.trim();
        
        if (text === translations[DEFAULT_LANG].footer.quick_links) {
            heading.textContent = data.footer.quick_links;
        } else if (text === translations[DEFAULT_LANG].footer.services) {
            heading.textContent = data.footer.services;
        } else if (text === translations[DEFAULT_LANG].footer.newsletter) {
            heading.textContent = data.footer.newsletter;
        }
    });

    // Update newsletter description
    const newsletterDesc = document.querySelector('.footer-newsletter p');
    if (newsletterDesc && newsletterDesc.textContent.trim() === translations[DEFAULT_LANG].footer.newsletter_desc) {
        newsletterDesc.textContent = data.footer.newsletter_desc;
    }

    // Update input placeholders
    const emailInput = document.querySelector('.newsletter-form input');
    if (emailInput && emailInput.placeholder === translations[DEFAULT_LANG].footer.email_placeholder) {
        emailInput.placeholder = data.footer.email_placeholder;
    }

    // Update copyright text
    const copyright = document.querySelector('.footer-bottom p');
    if (copyright && copyright.textContent.includes(translations[DEFAULT_LANG].footer.copyright)) {
        copyright.textContent = copyright.textContent.replace(
            translations[DEFAULT_LANG].footer.copyright, 
            data.footer.copyright
        );
    }

    // Update legal links
    document.querySelectorAll('.footer-legal a').forEach(link => {
        const text = link.textContent.trim();
        
        if (text === translations[DEFAULT_LANG].footer.privacy) {
            link.textContent = data.footer.privacy;
        } else if (text === translations[DEFAULT_LANG].footer.terms) {
            link.textContent = data.footer.terms;
        }
    });

    // Update loading text
    const loadingText = document.querySelector('.loading-text');
    if (loadingText) {
        const textNode = loadingText.childNodes[0];
        if (textNode && textNode.nodeValue === translations[DEFAULT_LANG].common.loading) {
            textNode.nodeValue = data.common.loading;
        }
    }
};

// Initialize language functionality
const initLanguage = async () => {
    const currentLang = getCurrentLanguage();
    
    // Load default language first
    const defaultData = await loadLanguage(DEFAULT_LANG);
    if (defaultData) {
        translations[DEFAULT_LANG] = defaultData;
    }
    
    // If current language is not default, load and apply it
    if (currentLang !== DEFAULT_LANG) {
        const langData = await loadLanguage(currentLang);
        if (langData) {
            applyTranslations(currentLang, langData);
            updateLanguageButton(currentLang);
        }
    } else {
        updateLanguageButton(DEFAULT_LANG);
    }
    
    // Add click event listeners to language options
    document.querySelectorAll('.lang-dropdown a').forEach(async (link) => {
        const text = link.textContent.trim();
        let lang = DEFAULT_LANG;
        
        if (text === 'EN') {
            lang = 'en';
        } else if (text === '简体') {
            lang = 'zh-hans';
        }
        
        link.addEventListener('click', async (e) => {
            e.preventDefault();
            
            // If we haven't loaded this language yet
            if (!translations[lang]) {
                const langData = await loadLanguage(lang);
                if (langData) {
                    applyTranslations(lang, langData);
                }
            } else {
                // We already have this language data
                applyTranslations(lang, translations[lang]);
            }
            
            // Update UI and save preference
            updateLanguageButton(lang);
            setCurrentLanguage(lang);
            
            // Close dropdown
            document.querySelector('.lang-btn').classList.remove('active');
            document.querySelector('.lang-dropdown').classList.remove('active');
        });
    });
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initLanguage);