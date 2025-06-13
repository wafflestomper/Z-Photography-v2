document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/navigation.html');
        const html = await response.text();
        const navPlaceholder = document.getElementById('nav-placeholder');
        if (navPlaceholder) {
            navPlaceholder.innerHTML = html;
        }
    } catch (error) {
        console.error('Error loading navigation:', error);
    }
}); 