import { Component } from '@angular/core';

@Component({
  selector: 'app-gallery',
  imports: [],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss',
})
export class GalleryComponent {
  images = [
    { src: 'assets/art1.jpg', alt: 'Photo 1' },
    { src: 'assets/art2.jpg', alt: 'Photo 2' },
    { src: 'assets/art3.jpg', alt: 'Photo 3' },
    { src: 'assets/art4.jpg', alt: 'Photo 4' },
  ];
  modalOpen = false;
  modalImg = '';
  modalAlt = '';

  openModal(img: string, alt: string) {
    this.modalImg = img;
    this.modalAlt = alt;
    this.modalOpen = true;
  }
  closeModal() {
    this.modalOpen = false;
  }
}
