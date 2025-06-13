// Remove the import and use the global tns from CDN
class Carousel {
    constructor() {
        console.log('Initializing carousel...');
        this.heroCarousel = document.querySelector('.hero-carousel');
        this.slider = null;
        this.updateSlideAppearance = this.updateSlideAppearance.bind(this);
        this.handleNextClick = this.handleNextClick.bind(this);
        this.handlePrevClick = this.handlePrevClick.bind(this);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.init();
    }

    updateSlideAppearance() {
        if (!this.slider) {
            console.warn('Slider not initialized for updateSlideAppearance');
            return;
        }
        setTimeout(() => {
            if (!this.slider || typeof this.slider.getInfo !== 'function') {
                console.warn('Slider not available or getInfo not a function in updateSlideAppearance timeout');
                return;
            }
            try {
                const info = this.slider.getInfo();
                const slidesArray = Array.from(info.slideItems);
                const activeIndex = info.indexCached;
                if (activeIndex >= 0 && activeIndex < slidesArray.length) {
                    slidesArray.forEach((slide) => {
                        slide.style.opacity = '1';
                        if (slide === slidesArray[activeIndex]) {
                            slide.style.filter = 'brightness(1)';
                        } else {
                            slide.style.filter = 'brightness(0.33)';
                        }
                    });
                } else {
                    console.warn(`activeIndex ${activeIndex} out of bounds in updateSlideAppearance.`);
                    slidesArray.forEach(slide => {
                        slide.style.opacity = '1';
                        slide.style.filter = 'brightness(0.33)'; 
                    });
                }
            } catch (e) {
                console.error('Error in updateSlideAppearance (inside timeout):', e);
            }
        }, 0);
    }

    handlePrevClick() {
        if (!this.slider) return;
        const info = this.slider.getInfo();
        const slidesArray = Array.from(info.slideItems);
        const currentIndex = info.indexCached;

        if (slidesArray[currentIndex]) {
            slidesArray[currentIndex].style.filter = 'brightness(0.33)';
            slidesArray[currentIndex].style.opacity = '1';
        }

        if (slidesArray.length > 0) {
            const prevIndex = (currentIndex - 1 + slidesArray.length) % slidesArray.length;
            if (slidesArray[prevIndex]) {
                slidesArray[prevIndex].style.filter = 'brightness(1)'; 
                slidesArray[prevIndex].style.opacity = '1';
            }
        }
        this.slider.goTo('prev');
    }

    handleNextClick() {
        if (!this.slider) return;
        const info = this.slider.getInfo();
        const slidesArray = Array.from(info.slideItems);
        const currentIndex = info.indexCached;

        if (slidesArray[currentIndex]) {
            slidesArray[currentIndex].style.filter = 'brightness(0.33)';
            slidesArray[currentIndex].style.opacity = '1';
        }
        
        if (slidesArray.length > 0) {
            const nextIndex = (currentIndex + 1) % slidesArray.length;
            if (slidesArray[nextIndex]) {
                slidesArray[nextIndex].style.filter = 'brightness(1)';
                slidesArray[nextIndex].style.opacity = '1';
            }
        }
        this.slider.goTo('next');
    }

    handleKeyDown(e) {
        if (!this.slider) return;
        const info = this.slider.getInfo();
        const slidesArray = Array.from(info.slideItems);
        const currentIndex = info.indexCached;

        if (e.key === 'ArrowLeft') {
            if (slidesArray[currentIndex]) {
                slidesArray[currentIndex].style.filter = 'brightness(0.33)';
                slidesArray[currentIndex].style.opacity = '1';
            }
            if (slidesArray.length > 0) {
                const prevIndex = (currentIndex - 1 + slidesArray.length) % slidesArray.length;
                if (slidesArray[prevIndex]) {
                    slidesArray[prevIndex].style.filter = 'brightness(1)';
                    slidesArray[prevIndex].style.opacity = '1';
                }
            }
            this.slider.goTo('prev');
        } else if (e.key === 'ArrowRight') {
            if (slidesArray[currentIndex]) {
                slidesArray[currentIndex].style.filter = 'brightness(0.33)';
                slidesArray[currentIndex].style.opacity = '1';
            }
            if (slidesArray.length > 0) {
                const nextIndex = (currentIndex + 1) % slidesArray.length;
                if (slidesArray[nextIndex]) {
                    slidesArray[nextIndex].style.filter = 'brightness(1)';
                    slidesArray[nextIndex].style.opacity = '1';
                }
            }
            this.slider.goTo('next');
        }
    }

    async init() {
        try {
            const response = await fetch('/data/photos.json');
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const photos = await response.json();
            
            const sliderContainer = document.querySelector('.my-slider');
            if (!sliderContainer) throw new Error('Slider container not found');

            const imageLoadPromises = photos.map(photo => {
                return new Promise((resolve) => {
                    const img = document.createElement('img');
                    img.onload = () => {
                        const aspectRatio = img.naturalWidth / img.naturalHeight;
                        const width = Math.round(600 * aspectRatio);
                        img.style.width = `${width}px`;
                        img.style.height = '600px';
                        resolve(img);
                    };
                    img.onerror = () => { console.error('Failed to load image:', photo.src); resolve(null); };
                    img.src = `/${photo.src}`;
                    img.alt = photo.alt;
                });
            });

            const loadedImages = await Promise.all(imageLoadPromises);
            loadedImages.forEach(img => { if (img) sliderContainer.appendChild(img); });
            this.heroCarousel.classList.add('loaded');

            if (typeof tns !== 'function') throw new Error('tiny-slider not loaded');

            const validImages = loadedImages.filter(img => img !== null);
            if (validImages.length === 0) {
                console.warn('No valid images loaded for the carousel.');
                return; 
            }
            const randomStartIndex = Math.floor(Math.random() * validImages.length);

            this.slider = tns({
                container: '.my-slider',
                items: 1, 
                slideBy: 1,
                center: true,
                loop: true,
                speed: 400,
                nav: false,
                mouseDrag: true,
                controls: false, 
                preventActionWhenRunning: false,
                autoWidth: true,
                gutter: 0,
                edgePadding: 150,
                startIndex: randomStartIndex,
                onInit: this.updateSlideAppearance,
                touch: true,
                swipeAngle: 45,
                preventScrollOnTouch: 'auto',
                responsive: {
                    0: {
                        edgePadding: 20,
                        mouseDrag: true,
                        touch: true,
                        swipeAngle: 45,
                        preventScrollOnTouch: 'auto'
                    }
                }
            });

            this.slider.events.on('transitionEnd', this.updateSlideAppearance);

            const prevArrow = document.querySelector('.carousel-arrow.prev');
            const nextArrow = document.querySelector('.carousel-arrow.next');
            if (prevArrow) prevArrow.addEventListener('click', this.handlePrevClick);
            if (nextArrow) nextArrow.addEventListener('click', this.handleNextClick);
            
            document.removeEventListener('keydown', this.handleKeyDown); 
            document.addEventListener('keydown', this.handleKeyDown);

            console.log('Carousel initialized with manual brightness pre-dimming control.');

        } catch (error) {
            console.error('Error initializing carousel:', error);
        }
    }
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new Carousel();
}); 