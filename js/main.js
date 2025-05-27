// =========== Custom Cursor ===========
const cursor = document.querySelector('.cursor');
const cursorFollower = document.querySelector('.cursor-follower');

document.addEventListener('mousemove', function(e) {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    
    setTimeout(function() {
        cursorFollower.style.left = e.clientX + 'px';
        cursorFollower.style.top = e.clientY + 'px';
    }, 100);
});

document.addEventListener('mouseover', function(e) {
    if (e.target.tagName.toLowerCase() === 'a' || 
        e.target.tagName.toLowerCase() === 'button' ||
        e.target.classList.contains('service-card') ||
        e.target.classList.contains('project-item')) {
        cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
        cursorFollower.style.transform = 'translate(-50%, -50%) scale(1.5)';
    } else {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorFollower.style.transform = 'translate(-50%, -50%) scale(1)';
    }
});

// =========== Preloader ===========
window.addEventListener('load', function() {
    const preloader = document.querySelector('.preloader');
    
    setTimeout(() => {
        preloader.classList.add('hide');
    }, 2000);
    
    // Split text animation
    const splitText = document.querySelector('.split-text');
    if (splitText) {
        const text = splitText.textContent;
        splitText.textContent = '';
        
        for (let i = 0; i < text.length; i++) {
            const span = document.createElement('span');
            span.textContent = text[i];
            span.style.setProperty('--i', i);
            splitText.appendChild(span);
        }
    }
});

// =========== Theme Toggle ===========
const themeToggle = document.querySelector('.theme-toggle');
themeToggle.addEventListener('click', function() {
    document.body.classList.toggle('dark-mode');
    
    const icon = this.querySelector('i');
    if (document.body.classList.contains('dark-mode')) {
        icon.className = 'fas fa-sun';
    } else {
        icon.className = 'fas fa-moon';
    }
});

// =========== Navigation ===========
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', function() {
    this.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.classList.toggle('nav-open');
});

const navLinks = document.querySelectorAll('.nav-link');
navLinks.forEach(link => {
    link.addEventListener('click', function() {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('nav-open');
    });
});

// =========== Smooth Scrolling ===========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// =========== Counter Animation ===========
const statItems = document.querySelectorAll('.stat-item');

function animateCounter(el) {
    const target = parseInt(el.getAttribute('data-count'));
    const counter = el.querySelector('.counter');
    const step = target / 100;
    let current = 0;
    
    const updateCounter = () => {
        if (current < target) {
            current += step;
            counter.textContent = Math.floor(current);
            setTimeout(updateCounter, 20);
        } else {
            counter.textContent = target;
        }
    };
    
    updateCounter();
}

// Start counter animation when element is in viewport
const observerOptions = {
    threshold: 0.5
};

const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

statItems.forEach(item => {
    counterObserver.observe(item);
});

// =========== Project Tabs ===========
const tabButtons = document.querySelectorAll('.tab-btn');
const projectItems = document.querySelectorAll('.project-item');

tabButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Remove active class from all buttons
        tabButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        this.classList.add('active');
        
        const filter = this.getAttribute('data-filter');
        
        projectItems.forEach(item => {
            if (filter === 'all' || item.classList.contains(filter)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

// =========== Testimonial Slider ===========
const testimonialCards = document.querySelectorAll('.testimonial-card');
const dots = document.querySelectorAll('.dot');
const prevButton = document.querySelector('.slider-arrow.prev');
const nextButton = document.querySelector('.slider-arrow.next');
let currentIndex = 0;

function showTestimonial(index) {
    testimonialCards.forEach(card => {
        card.classList.remove('active');
    });
    
    dots.forEach(dot => {
        dot.classList.remove('active');
    });
    
    testimonialCards[index].classList.add('active');
    dots[index].classList.add('active');
}

nextButton.addEventListener('click', function() {
    currentIndex = (currentIndex + 1) % testimonialCards.length;
    showTestimonial(currentIndex);
});

prevButton.addEventListener('click', function() {
    currentIndex = (currentIndex - 1 + testimonialCards.length) % testimonialCards.length;
    showTestimonial(currentIndex);
});

dots.forEach((dot, index) => {
    dot.addEventListener('click', function() {
        currentIndex = index;
        showTestimonial(currentIndex);
    });
});

// Auto rotate testimonials
setInterval(function() {
    currentIndex = (currentIndex + 1) % testimonialCards.length;
    showTestimonial(currentIndex);
}, 5000);

// =========== Scroll Animation ===========
const elements = document.querySelectorAll('[data-aos]');

function checkScroll() {
    const windowHeight = window.innerHeight;
    const windowTop = window.scrollY;
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top + windowTop;
        const elementHeight = element.offsetHeight;
        
        if (windowTop + windowHeight > elementTop + 100) {
            element.classList.add('aos-animate');
        }
    });
}

window.addEventListener('scroll', checkScroll);
window.addEventListener('resize', checkScroll);
window.addEventListener('load', checkScroll);

// Hide cursor on mobile devices
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

if (isMobile()) {
    cursor.style.display = 'none';
    cursorFollower.style.display = 'none';
}