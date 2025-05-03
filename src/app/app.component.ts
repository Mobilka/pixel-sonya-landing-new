import { Component, OnInit, HostListener, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    FormsModule,
    CommonModule,
    TranslateModule,
    ScrollingModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'Pixel Sonya';

  // Supported languages
  langs = ['he', 'en', 'ru'];
  currentLang = 'he'; // Hebrew by default

  // Map URL, safe for use in iframe
  mapUrl!: SafeResourceUrl;

  // Adding contact information
  contactInfo = {
    email: 'pixelsonya@gmail.com',
    phone: '+972 052 728 4388',
  };

  // Flag for displaying gallery
  isGalleryOpen = false;

  // Slideshow data
  slides = [
    {
      image: 'assets/Sonya.png',
      alt: 'Portrait of Sonya',
    },
    {
      image: 'assets/logo.png',
      alt: 'Pixel Sonya Logo',
    },
    {
      image: 'assets/Sonya.png', // Temporarily duplicated until we have more photos
      alt: 'Sonya working',
    },
    {
      image: 'assets/logo.png', // Temporarily duplicated until we have more photos
      alt: 'Pixel Sonya Works',
    },
  ];

  // For virtual scrolling demonstration, creating a large array of images
  galleryImages = Array.from({ length: 100 }, (_, i) => {
    const isEven = i % 2 === 0;
    return {
      src: isEven ? 'assets/Sonya.png' : 'assets/logo.png',
      alt: `${isEven ? 'Sonya' : 'Logo'} - example ${i + 1}`,
    };
  });

  // Variables for gallery modal window
  selectedImage = '';
  selectedImageAlt = '';
  selectedImageIndex = -1;

  currentSlide = 0;
  slideInterval: any;

  // Form data
  formData = {
    name: '',
    phone: '',
    email: '',
    message: '',
    preferredContact: '',
  };

  constructor(
    private translate: TranslateService,
    private sanitizer: DomSanitizer
  ) {
    // Setting default language and available languages
    translate.addLangs(this.langs);
    translate.setDefaultLang('he');
    translate.use('he');

    // Map URL initialization
    this.updateMapUrl('he');
  }

  ngOnInit() {
    // Automatic slide change every 5 seconds
    this.startSlideShow();

    // Setting initial text direction
    const htmlTag = document.getElementsByTagName('html')[0] as HTMLHtmlElement;
    if (this.currentLang === 'he') {
      htmlTag.setAttribute('dir', 'rtl');
    } else {
      htmlTag.setAttribute('dir', 'ltr');
    }

    // Setting lang attribute on html tag
    htmlTag.setAttribute('lang', this.currentLang);
  }

  ngAfterViewInit() {
    // Animation disabled to improve content visibility
    // Leaving a placeholder for potential future use
  }

  // Scroll tracking (disabled)
  @HostListener('window:scroll', ['$event'])
  onScroll() {
    // Animation disabled
  }

  // Method disabled
  checkForAnimation() {
    // Animation disabled
  }

  // Method for changing language
  changeLanguage(lang: string) {
    this.translate.use(lang);
    this.currentLang = lang;

    // Updating map URL when changing language
    this.updateMapUrl(lang);

    // Setting text direction (RTL for Hebrew)
    const htmlTag = document.getElementsByTagName('html')[0] as HTMLHtmlElement;
    if (lang === 'he') {
      htmlTag.setAttribute('dir', 'rtl');
    } else {
      htmlTag.setAttribute('dir', 'ltr');
    }

    // Setting lang attribute on html tag
    htmlTag.setAttribute('lang', lang);
  }

  // Method for updating map URL depending on selected language
  updateMapUrl(lang: string) {
    // Base map URL with coordinates
    const baseMapUrl =
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3388.1780114442224!2d34.8041576!3d31.9072105!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1502b6eaa4e2bfc7%3A0x6d16c99e4eb9fad!2z157XqdeQINeU16jXptecIDE5Niwg16jXl9eV15HXldeq!5e0!3m2!1s';

    // Adding language code to URL
    let fullMapUrl = `${baseMapUrl}${lang}!2sil!4v1719329650836!5m2!1s${lang}!2sil`;

    // Using DomSanitizer to create a safe URL
    this.mapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(fullMapUrl);
  }

  // Starting automatic slide change
  startSlideShow() {
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  // Stopping automatic slide change
  stopSlideShow() {
    clearInterval(this.slideInterval);
  }

  // Going to next slide
  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  // Going to previous slide
  prevSlide() {
    this.currentSlide =
      (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }

  // Going to specific slide
  goToSlide(index: number) {
    this.currentSlide = index;
  }

  // Form submission method
  onSubmit() {
    console.log('Form submitted with data:', this.formData);
    // Here will be the logic for sending data to the server
    this.translate.get('CONTACT.SUCCESS').subscribe((res: string) => {
      alert(res);
    });
    this.resetForm();
  }

  // Form reset
  resetForm() {
    this.formData = {
      name: '',
      phone: '',
      email: '',
      message: '',
      preferredContact: '',
    };
  }

  // Method for setting preferred contact method
  setPreferredContact(type: string) {
    this.formData.preferredContact = type;
  }

  // Method for displaying gallery
  showGallery() {
    this.isGalleryOpen = true;
  }

  // Closing gallery
  closeGallery() {
    this.isGalleryOpen = false;
  }

  // Open enlarged image
  openImageModal(src: string, alt: string) {
    this.selectedImage = src;
    this.selectedImageAlt = alt;
    // Finding current image index
    this.selectedImageIndex = this.galleryImages.findIndex(
      (img) => img.src === src && img.alt === alt
    );
  }

  // Close enlarged image
  closeImageModal() {
    this.selectedImage = '';
    this.selectedImageAlt = '';
    this.selectedImageIndex = -1;
  }

  // Go to next image
  nextImage(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    if (this.selectedImageIndex < this.galleryImages.length - 1) {
      this.selectedImageIndex++;
    } else {
      this.selectedImageIndex = 0; // Going to first image if end is reached
    }
    const newImage = this.galleryImages[this.selectedImageIndex];
    this.selectedImage = newImage.src;
    this.selectedImageAlt = newImage.alt;
  }

  // Go to previous image
  prevImage(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    if (this.selectedImageIndex > 0) {
      this.selectedImageIndex--;
    } else {
      this.selectedImageIndex = this.galleryImages.length - 1; // Going to last image if beginning is reached
    }
    const newImage = this.galleryImages[this.selectedImageIndex];
    this.selectedImage = newImage.src;
    this.selectedImageAlt = newImage.alt;
  }

  // Key handler for navigation
  @HostListener('window:keydown', ['$event'])
  handleKeyboardNavigation(event: KeyboardEvent) {
    if (!this.selectedImage) return; // Exit if modal window is not open

    switch (event.key) {
      case 'ArrowRight':
        this.nextImage();
        break;
      case 'ArrowLeft':
        this.prevImage();
        break;
      case 'Escape':
        this.closeImageModal();
        break;
    }
  }

  // Methods for contact buttons
  openChat() {
    // Chat opening implementation
    alert('Opening chat');
    // Future chat implementation
  }

  // Method for sending email
  sendEmail() {
    window.location.href = `mailto:${this.contactInfo.email}`;
  }

  // Method for calling
  callPhone() {
    window.location.href = `tel:${this.contactInfo.phone.replace(/\D/g, '')}`;
  }

  // Method for opening WhatsApp - empty implementation to fix error
  openWhatsApp() {
    // Empty implementation to bypass compilation error
  }
}
