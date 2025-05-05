import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService, SlideImage } from '../admin/services/admin.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-slideshow',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './slideshow.component.html',
  styleUrl: './slideshow.component.scss',
})
export class SlideshowComponent implements OnInit, OnDestroy {
  slides: SlideImage[] = [];
  currentSlide = 0;
  slideInterval: any;
  private subscription: Subscription = new Subscription();

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadSlides();
    // Subscribe to slideshow updates
    this.subscription.add(
      this.adminService.slideshow$.subscribe((slides) => {
        console.log(
          'Slideshow: Received slideshow update, number of slides:',
          slides.length
        );
        this.slides = [...slides]; // Create a new array to update the view

        // If the current slide is out of bounds of the new array, reset it
        if (this.currentSlide >= this.slides.length) {
          this.currentSlide = 0;
        }
      })
    );
    this.startSlideShow();
  }

  ngOnDestroy() {
    this.stopSlideShow();
    this.subscription.unsubscribe();
  }

  loadSlides() {
    this.adminService.getSlideshow().subscribe((slides) => {
      console.log('Slideshow: Loaded slides for display:', slides.length);
      if (slides && slides.length > 0) {
        // Add error handler for images
        this.slides = slides.map((slide) => ({
          ...slide,
          hasError: false,
        }));
        console.log('Slideshow: First slide:', this.slides[0]);
      } else {
        console.log('Slideshow: No slides for display');
        this.slides = [];
      }
    });
  }

  // Starting automatic slide change
  startSlideShow() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
    }

    this.slideInterval = setInterval(() => {
      if (this.slides.length > 0) {
        this.nextSlide();
      }
    }, 5000);
  }

  // Stopping automatic slide change
  stopSlideShow() {
    if (this.slideInterval) {
      clearInterval(this.slideInterval);
      this.slideInterval = null;
    }
  }

  // Going to next slide
  nextSlide() {
    if (this.slides.length === 0) return;
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  // Going to previous slide
  prevSlide() {
    if (this.slides.length === 0) return;
    this.currentSlide =
      (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }

  // Going to specific slide
  goToSlide(index: number) {
    if (index >= 0 && index < this.slides.length) {
      this.currentSlide = index;
    }
  }
}
