// Main JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize navigation
    loadNavigation();
    
    // Initialize carousel if it exists
    if (document.querySelector('.my-slider')) {
        initializeCarousel();
    }
    
    // Initialize any accordions
    initializeAccordions();
});

function loadNavigation() {
    const navPlaceholder = document.getElementById('nav-placeholder');
    if (navPlaceholder) {
        fetch('/navigation.html')
            .then(response => response.text())
            .then(data => {
                navPlaceholder.innerHTML = data;
                // Initialize mobile menu after navigation is loaded
                initializeMobileMenu();
            })
            .catch(error => console.error('Error loading navigation:', error));
    }
}

function initializeMobileMenu() {
    const menuButton = document.querySelector('.mobile-menu-button');
    const navMenu = document.querySelector('.nav-menu');
    
    if (menuButton && navMenu) {
        menuButton.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            menuButton.classList.toggle('active');
        });
    }
}

function initializeAccordions() {
    const accordions = document.querySelectorAll('.accordion');
    
    accordions.forEach(accordion => {
        const header = accordion.querySelector('.accordion-header');
        const content = accordion.querySelector('.accordion-content');
        
        if (header && content) {
            header.addEventListener('click', () => {
                accordion.classList.toggle('active');
                content.style.maxHeight = accordion.classList.contains('active') 
                    ? content.scrollHeight + 'px' 
                    : '0';
            });
        }
    });
}

// Add smooth scrolling for anchor links
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