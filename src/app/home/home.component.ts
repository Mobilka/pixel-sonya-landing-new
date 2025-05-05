import { Component, OnInit, HostListener, AfterViewInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { ScrollingModule } from '@angular/cdk/scrolling';
import {
  DomSanitizer,
  SafeResourceUrl,
  Title,
} from '@angular/platform-browser';
import { AdminService } from '../admin/services/admin.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink,
    FormsModule,
    CommonModule,
    TranslateModule,
    ScrollingModule,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit, AfterViewInit {
  title = 'Pixel Sonya';

  // Page titles based on language
  pageTitles: { [key: string]: string } = {};

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
  slides: any[] = [];

  // Gallery images
  galleryImages: any[] = [];

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
    private sanitizer: DomSanitizer,
    private titleService: Title,
    private adminService: AdminService
  ) {
    // Setting default language and available languages
    this.langs = ['he', 'en', 'ru'];
    this.translate.addLangs(this.langs);
    this.translate.setDefaultLang('he');
    this.translate.use('he');

    // Map URL initialization
    this.updateMapUrl('he');

    // Set initial page title
    this.pageTitles = {
      en:
        this.translate.instant('HEADER.TITLE') +
        ' ' +
        this.translate.instant('HEADER.SUBTITLE'),
      ru:
        this.translate.instant('HEADER.TITLE') +
        ' ' +
        this.translate.instant('HEADER.SUBTITLE'),
      he:
        this.translate.instant('HEADER.TITLE') +
        ' ' +
        this.translate.instant('HEADER.SUBTITLE'),
    };
    this.updatePageTitle('he');
  }

  ngOnInit() {
    // Get data from admin service
    this.loadDataFromAdminService();

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

  // Loading data from admin service
  loadDataFromAdminService() {
    // Loading slideshow data
    this.adminService.getSlideshow().subscribe((slides) => {
      console.log('Home: Slides loaded from service:', slides.length);
      if (slides && slides.length > 0) {
        this.slides = slides.map((s) => ({
          image: s.image,
          alt: s.alt,
        }));
        console.log(
          'Home: Slides loaded into component, count:',
          this.slides.length
        );
      } else {
        console.log('Home: No data for slideshow');
        this.slides = []; // Clear slideshow if there are no selected images
      }
    });

    // Loading images for gallery
    this.adminService.getGallery().subscribe((images) => {
      console.log('Home: Images loaded for gallery:', images.length);
      if (images && images.length > 0) {
        this.galleryImages = images.map((img) => ({
          src: img.src,
          alt: img.alt,
        }));
        console.log(
          'Home: Gallery loaded into component, count:',
          this.galleryImages.length
        );
      } else {
        console.log('Home: No data for gallery');
        this.galleryImages = []; // Clear gallery if there are no images
      }
    });

    // Loading contact information
    this.adminService.getContactInfo().subscribe((info) => {
      if (info && (info.email || info.phone)) {
        this.contactInfo = info;
      }
    });
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

  // Update page title based on selected language
  updatePageTitle(lang: string) {
    this.titleService.setTitle(
      this.pageTitles[lang as keyof typeof this.pageTitles] ||
        this.pageTitles['en']
    );
  }

  // Method for changing language
  changeLanguage(lang: string) {
    this.translate.use(lang);
    this.currentLang = lang;

    // Updating map URL when changing language
    this.updateMapUrl(lang);

    // Update the page title
    this.updatePageTitle(lang);

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

  // Method for changing preference contact type
  setPreferredContact(type: string) {
    this.formData.preferredContact = type;
  }

  // Toggle gallery visibility
  toggleGallery() {
    this.isGalleryOpen = !this.isGalleryOpen;
  }

  // Display the gallery
  openGallery() {
    this.isGalleryOpen = true;
  }

  // Hide the gallery
  closeGallery() {
    this.isGalleryOpen = false;
  }

  // Open modal window with full-size image
  openImageModal(src: string, alt: string) {
    this.selectedImage = src;
    this.selectedImageAlt = alt;
    this.selectedImageIndex = this.galleryImages.findIndex(
      (img) => img.src === src
    );

    // Add keyboard event listener
    window.addEventListener(
      'keydown',
      this.handleKeyboardNavigation.bind(this)
    );
  }

  // Close modal window
  closeImageModal() {
    this.selectedImage = '';

    // Remove keyboard event listener
    window.removeEventListener(
      'keydown',
      this.handleKeyboardNavigation.bind(this)
    );
  }

  // Go to next image in modal gallery
  nextImage(event?: Event) {
    if (event) {
      event.stopPropagation();
    }

    this.selectedImageIndex =
      (this.selectedImageIndex + 1) % this.galleryImages.length;
    const nextImage = this.galleryImages[this.selectedImageIndex];

    this.selectedImage = nextImage.src;
    this.selectedImageAlt = nextImage.alt;
  }

  // Go to previous image in modal gallery
  prevImage(event?: Event) {
    if (event) {
      event.stopPropagation();
    }

    this.selectedImageIndex =
      (this.selectedImageIndex - 1 + this.galleryImages.length) %
      this.galleryImages.length;
    const prevImage = this.galleryImages[this.selectedImageIndex];

    this.selectedImage = prevImage.src;
    this.selectedImageAlt = prevImage.alt;
  }

  // Handle keyboard navigation in modal gallery
  handleKeyboardNavigation(event: KeyboardEvent) {
    if (this.selectedImage) {
      if (event.key === 'ArrowRight') {
        this.nextImage();
      } else if (event.key === 'ArrowLeft') {
        this.prevImage();
      } else if (event.key === 'Escape') {
        this.closeImageModal();
      }
    }
  }

  // Method for opening WhatsApp chat
  openChat() {
    window.open(
      `https://wa.me/${this.contactInfo.phone.replace(/\D/g, '')}`,
      '_blank'
    );
  }

  // Method for sending an email
  sendEmail() {
    window.location.href = `mailto:${this.contactInfo.email}`;
  }

  // Method for making a phone call
  callPhone() {
    window.location.href = `tel:${this.contactInfo.phone.replace(/\D/g, '')}`;
  }

  // Method for opening WhatsApp with the phone number
  openWhatsApp() {
    window.open(
      `https://wa.me/${this.contactInfo.phone.replace(/\D/g, '')}`,
      '_blank'
    );
  }
}
