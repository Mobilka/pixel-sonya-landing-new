import { Component } from '@angular/core';

@Component({
  selector: 'app-gallery',
  imports: [],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss',
})
export class GalleryComponent {
  images = [
    { src: 'assets/art1.jpg', alt: 'Фото 1' },
    { src: 'assets/art2.jpg', alt: 'Фото 2' },
    { src: 'assets/art3.jpg', alt: 'Фото 3' },
    { src: 'assets/art4.jpg', alt: 'Фото 4' },
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
