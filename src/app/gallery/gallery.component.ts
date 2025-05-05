import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService, GalleryImage } from '../admin/services/admin.service';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.scss',
})
export class GalleryComponent implements OnInit {
  galleryImages: GalleryImage[] = [];
  selectedImage: GalleryImage | null = null;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadGallery();
  }

  loadGallery() {
    this.adminService.getGallery().subscribe((images) => {
      console.log('Gallery received images:', images.length);
      if (images && images.length > 0) {
        this.galleryImages = images;
        console.log('First image in gallery:', this.galleryImages[0]);
      }
    });
  }

  openImageModal(image: GalleryImage) {
    this.selectedImage = image;
  }

  closeImageModal() {
    this.selectedImage = null;
  }
}
