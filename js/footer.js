// Function to load the footer
async function loadFooter() {
    try {
        const response = await fetch('/templates/footer.html');
        const footerHtml = await response.text();
        
        // Insert the footer before the closing body tag
        document.body.insertAdjacentHTML('beforeend', footerHtml);
        
        // Update the current year
        document.getElementById('current-year').textContent = new Date().getFullYear();
    } catch (error) {
        console.error('Error loading footer:', error);
    }
}

// Load the footer when the DOM is ready
document.addEventListener('DOMContentLoaded', loadFooter);

// Horizontal Accordion interaction for Take Your Shot section
const accordionCards = document.querySelectorAll('.accordion-card');
if (accordionCards.length) {
  accordionCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      accordionCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    });
    card.addEventListener('mouseleave', () => {
      card.classList.remove('active');
    });
    card.addEventListener('focus', () => {
      accordionCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
    });
    card.addEventListener('blur', () => {
      card.classList.remove('active');
    });
    card.addEventListener('click', () => {
      accordionCards.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      const href = card.getAttribute('data-href');
      if (href) {
        window.location.href = href;
      }
    });
  });
} 