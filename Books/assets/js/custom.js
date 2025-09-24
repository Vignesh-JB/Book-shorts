class QuoteShortsApp {
  constructor() {
    // Quotes data
    this.quotes = [
      { text: "An Unfiltered Guide to Winning at Work", author: "Poornima Rathee", book: "Nobody Told Me That!" },
      { text: "Strategies for Resilience and Growth in a Changing World", author: "Bob Sehmi", book: "Future Proof Your Business" },
      { text: "A Guide for Turning from Employee to an Entrepreneur", author: "Rahul Sharma", book: "Resigned at 9 PM" },
      { text: "A Step-By-Step Guide to Launching Your Startup", author: "Shreedhar Raj", book: "From Idea to Startup" },
      { text: "Real Brand Stories, Hidden Strategies, and Consumer Truths", author: "Soumaya Askri", book: "Behind the Buy" },
      { text: "Think Faster. Decide Smarter. Win with AI.", author: "Vamsi Posemsetty", book: "AIM Unlocking the AI Mindset" },
      { text: "Empowering People, Driving Organizational Success", author: "Dr. Nupur Chhaniwal", book: "Human Resource Management" },
      { text: "A Practical Guide for Small and Emerging Business Owners", author: "S Ganesh Babu", book: "Proven Path to Profitable Growth" },
      { text: "Fintellectual Minds Exploring FinTech Through Gen AI Lens", author: "Vivek Dubey", book: "The Journey of FinTech" },
      { text: "Curriculum aligned and activity based one", author: "DR. K. Padmanaban", book: "Mastering Accountancy" }
    ];

    // State variables
    this.currentIndex = 0;
    this.isAutoplay = false;
    this.autoplayInterval = null;
    this.autoplayDuration = 5000;
    this.likedQuotes = new Set();
    this.isTransitioning = false;

    // Initialize
    this.initElements();
    this.generateSlides();
    this.initEventListeners();
    this.initializeTheme();
    this.updateActiveSlide();
  }

  // DOM references
  initElements() {
    this.slidesWrapper = document.getElementById('slidesWrapper');
    this.progressBar = document.getElementById('progressBar');
    this.autoplayBtn = document.getElementById('autoplayBtn');
    this.themeToggle = document.getElementById('themeToggle');
    this.likeBtn = document.getElementById('likeBtn');
    this.shareBtn = document.getElementById('shareBtn');
    this.copyBtn = document.getElementById('copyBtn');
    this.shareLink = document.getElementById('shareLink');
    this.upArrow = document.getElementById('upArrow');
    this.downArrow = document.getElementById('downArrow');
  }

  // Generate slide elements
  generateSlides() {
    this.quotes.forEach((quote, index) => {
      const slide = document.createElement('div');
      slide.className = `slide ${index === 0 ? 'active' : ''}`;
      slide.innerHTML = `
        <div class="quote-text">${quote.text}</div>
        <div class="quote-author">${quote.author}</div>
        <div class="quote-book">${quote.book}</div>
      `;
      this.slidesWrapper.appendChild(slide);
    });
  }

  // Event listeners
  initEventListeners() {
    this.autoplayBtn.addEventListener('click', () => this.toggleAutoplay());
    this.themeToggle.addEventListener('click', () => this.toggleTheme());
    this.likeBtn.addEventListener('click', () => this.toggleLike());
    this.shareBtn.addEventListener('click', () => this.prepareShareLink());
    this.copyBtn.addEventListener('click', () => this.copyShareLink());

    // Arrow navigation
    this.upArrow.addEventListener('click', () => this.prevSlide());
    this.downArrow.addEventListener('click', () => this.nextSlide());

    // Touch swipe
    let startY = 0, startX = 0;
    this.slidesWrapper.addEventListener('touchstart', e => {
      startY = e.touches[0].clientY;
      startX = e.touches[0].clientX;
    });

    this.slidesWrapper.addEventListener('touchend', e => {
      if (this.isTransitioning) return;
      const endY = e.changedTouches[0].clientY;
      const endX = e.changedTouches[0].clientX;
      const diffY = startY - endY;
      const diffX = Math.abs(startX - endX);
      if (Math.abs(diffY) > diffX && Math.abs(diffY) > 50) {
        diffY > 0 ? this.nextSlide() : this.prevSlide();
      }
    });

    // Mouse wheel
    this.slidesWrapper.addEventListener('wheel', e => {
      if (this.isTransitioning) return;
      e.preventDefault();
      e.deltaY > 0 ? this.nextSlide() : this.prevSlide();
    });

    // Keyboard controls
    document.addEventListener('keydown', e => {
      if (document.querySelector('.modal.show')) return;
      switch (e.code) {
        case 'ArrowDown':
        case 'Space':
          e.preventDefault();
          this.nextSlide();
          break;
        case 'ArrowUp':
          e.preventDefault();
          this.prevSlide();
          break;
        case 'KeyL':
          this.toggleLike();
          break;
        case 'KeyS':
          this.shareBtn.click();
          break;
      }
    });
  }

  // Update slide states
  updateActiveSlide() {
    const slides = this.slidesWrapper.querySelectorAll('.slide');
    slides.forEach((slide, index) => {
      slide.classList.remove('active', 'prev', 'next');
      if (index === this.currentIndex) slide.classList.add('active');
      else if (index < this.currentIndex) slide.classList.add('prev');
      else slide.classList.add('next');
    });

    if (this.likedQuotes.has(this.currentIndex)) {
      this.likeBtn.classList.add('liked');
      this.likeBtn.innerHTML = '<i class="fas fa-heart"></i>';
    } else {
      this.likeBtn.classList.remove('liked');
      this.likeBtn.innerHTML = '<i class="far fa-heart"></i>';
    }
  }

  // Slide navigation
  nextSlide() {
    if (this.isTransitioning) return;
    this.isTransitioning = true;
    this.currentIndex = (this.currentIndex + 1) % this.quotes.length;
    this.updateActiveSlide();
    setTimeout(() => this.isTransitioning = false, 600);
  }

  prevSlide() {
    if (this.isTransitioning) return;
    this.isTransitioning = true;
    this.currentIndex = (this.currentIndex - 1 + this.quotes.length) % this.quotes.length;
    this.updateActiveSlide();
    setTimeout(() => this.isTransitioning = false, 600);
  }

  // Autoplay
  toggleAutoplay() {
    this.isAutoplay ? this.stopAutoplay() : this.startAutoplay();
  }

  startAutoplay() {
    this.isAutoplay = true;
    this.autoplayBtn.classList.add('active');
    this.autoplayBtn.innerHTML = '<i class="fas fa-pause"></i>';

    let progress = 0;
    this.progressBar.style.width = '0%';

    this.autoplayInterval = setInterval(() => {
      progress += 100 / (this.autoplayDuration / 100);
      if (progress >= 100) {
        progress = 0;
        this.nextSlide();
      }
      this.progressBar.style.width = progress + '%';
    }, 100);
  }

  stopAutoplay() {
    this.isAutoplay = false;
    this.autoplayBtn.classList.remove('active');
    this.autoplayBtn.innerHTML = '<i class="fas fa-play"></i>';
    clearInterval(this.autoplayInterval);
    this.progressBar.style.width = '0%';
  }

  // Theme toggle
  toggleTheme() {
    const theme = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) document.body.setAttribute('data-theme', savedTheme);
  }

  // Like functionality
  toggleLike() {
    if (this.likedQuotes.has(this.currentIndex)) this.likedQuotes.delete(this.currentIndex);
    else this.likedQuotes.add(this.currentIndex);
    this.updateActiveSlide();
  }

  // Share functionality
  prepareShareLink() {
    const shareURL = `${window.location.origin}${window.location.pathname}#quote-${this.currentIndex}`;
    this.shareLink.textContent = shareURL;
  }

  copyShareLink() {
    navigator.clipboard.writeText(this.shareLink.textContent).then(() => {
      const originalText = this.copyBtn.innerHTML;
      this.copyBtn.innerHTML = '<i class="fas fa-check me-1"></i>Copied!';
      setTimeout(() => this.copyBtn.innerHTML = originalText, 2000);
    });
  }
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => new QuoteShortsApp());
