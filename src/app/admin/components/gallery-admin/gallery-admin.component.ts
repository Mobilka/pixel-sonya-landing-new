import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  AdminService,
  GalleryImage,
  SlideImage,
} from '../../services/admin.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-gallery-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  template: `
    <div class="admin-panel">
      <h2>{{ 'ADMIN.GALLERY.TITLE' | translate }}</h2>

      <div class="current-items">
        <h3>{{ 'ADMIN.GALLERY.GALLERY_TITLE' | translate }}</h3>
        <p class="info-text">
          {{
            'ADMIN.GALLERY.TOTAL_PHOTOS'
              | translate : { count: galleryImages.length }
          }}
        </p>
        <div class="items-grid">
          <div class="item-card" *ngFor="let image of galleryImages">
            <div class="item-image">
              <img [src]="image.src" [alt]="image.alt" />
            </div>
            <div class="item-details">
              <p>
                <strong>{{ 'ADMIN.GALLERY.DESCRIPTION' | translate }}</strong>
                {{ image.alt }}
              </p>
              <div class="slideshow-checkbox">
                <input
                  type="checkbox"
                  [id]="'slideshow-' + image.id"
                  [checked]="isInSlideshow(image.id)"
                  [disabled]="
                    !isInSlideshow(image.id) && slideshowIds.length >= 10
                  "
                  (change)="toggleSlideshow(image, $event)"
                />
                <label [for]="'slideshow-' + image.id">{{
                  'ADMIN.GALLERY.SHOW_IN_SLIDESHOW' | translate
                }}</label>
              </div>
            </div>
            <div class="item-actions">
              <button
                class="action-btn delete-btn"
                (click)="deleteImage(image.id!)"
              >
                {{ 'ADMIN.GALLERY.DELETE' | translate }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div class="add-form" *ngIf="!isEditing">
        <h3>{{ 'ADMIN.GALLERY.ADD_NEW' | translate }}</h3>
        <div class="form-group">
          <label for="new-alt">{{
            'ADMIN.GALLERY.DESCRIPTION' | translate
          }}</label>
          <input type="text" id="new-alt" [(ngModel)]="newImage.alt" />
        </div>
        <div class="form-group">
          <label for="new-image">{{ 'ADMIN.GALLERY.IMAGE' | translate }}</label>
          <input
            type="file"
            id="new-image"
            (change)="onFileSelected($event)"
            accept="image/*"
          />
        </div>
        <div class="slideshow-checkbox" *ngIf="slideshowImages.length < 10">
          <input
            type="checkbox"
            id="new-in-slideshow"
            [(ngModel)]="addToSlideshowOnCreate"
          />
          <label for="new-in-slideshow">{{
            'ADMIN.GALLERY.ADD_TO_SLIDESHOW' | translate
          }}</label>
        </div>
        <div class="image-preview" *ngIf="imagePreview">
          <img
            [src]="imagePreview"
            alt="{{ 'ADMIN.GALLERY.PREVIEW' | translate }}"
          />
        </div>
        <button class="action-btn add-btn" (click)="addImage()">
          {{ 'ADMIN.GALLERY.ADD_BUTTON' | translate }}
        </button>
      </div>

      <div class="edit-form" *ngIf="isEditing">
        <h3>{{ 'ADMIN.GALLERY.EDIT_IMAGE' | translate }}</h3>
        <div class="form-group">
          <label for="edit-alt">{{
            'ADMIN.GALLERY.DESCRIPTION' | translate
          }}</label>
          <input type="text" id="edit-alt" [(ngModel)]="editingImage.alt" />
        </div>
        <div class="form-group">
          <label for="edit-image">{{
            'ADMIN.GALLERY.IMAGE' | translate
          }}</label>
          <input
            type="file"
            id="edit-image"
            (change)="onFileSelected($event)"
            accept="image/*"
          />
        </div>
        <div class="image-preview">
          <img
            [src]="imagePreview || editingImage.src"
            alt="{{ 'ADMIN.GALLERY.PREVIEW' | translate }}"
          />
        </div>
        <div class="edit-actions">
          <button class="action-btn save-btn" (click)="saveEdit()">
            {{ 'ADMIN.GALLERY.SAVE' | translate }}
          </button>
          <button class="action-btn cancel-btn" (click)="cancelEdit()">
            {{ 'ADMIN.GALLERY.CANCEL' | translate }}
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .admin-panel {
        background-color: #fff;
        border-radius: 8px;
        padding: 2rem;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
      }

      h2 {
        margin-bottom: 2rem;
        color: #333;
        border-bottom: 2px solid #e6c7b7;
        padding-bottom: 0.5rem;
      }

      h3 {
        margin: 1.5rem 0 1rem;
        color: #555;
      }

      .info-text {
        font-size: 0.9rem;
        color: #666;
        margin-bottom: 1rem;
      }

      .info-text.empty {
        color: #999;
        font-style: italic;
      }

      .current-items,
      .slideshow-selection {
        margin-bottom: 2rem;
        background-color: #fafafa;
        border-radius: 6px;
        padding: 1.5rem;
        border: 1px solid #eee;
      }

      .slideshow-selection {
        background-color: #f9f4ff;
      }

      .items-grid,
      .slideshow-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1.5rem;
      }

      .slideshow-grid {
        grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      }

      .item-card {
        border: 1px solid #eee;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        transition: transform 0.2s, box-shadow 0.2s;
        background-color: #fff;
      }

      .slideshow-card {
        border-color: #d1bfff;
        background-color: #fefcff;
      }

      .item-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
      }

      .item-image {
        height: 180px;
        overflow: hidden;
      }

      .item-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .item-details {
        padding: 1rem;
        border-bottom: 1px solid #eee;
      }

      .slideshow-checkbox {
        display: flex;
        align-items: center;
        margin-top: 0.5rem;
        padding-top: 0.5rem;
        border-top: 1px dotted #eee;
      }

      .slideshow-checkbox input {
        margin-right: 0.5rem;
      }

      .slideshow-checkbox label {
        font-size: 0.9rem;
        color: #555;
      }

      .item-actions {
        display: flex;
        padding: 1rem;
        gap: 0.5rem;
      }

      .action-btn {
        padding: 0.5rem 1rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 500;
        transition: background-color 0.2s;
        flex: 1;
      }

      .edit-btn {
        background-color: #e9e3ff;
        color: #333;
      }

      .edit-btn:hover {
        background-color: #d1bfff;
      }

      .delete-btn {
        background-color: #ffe9dd;
        color: #333;
      }

      .delete-btn:hover {
        background-color: #ffd4bc;
      }

      .remove-btn {
        background-color: #f4e1d7;
        color: #333;
      }

      .remove-btn:hover {
        background-color: #f0cdb8;
      }

      .add-btn,
      .save-btn {
        background-color: #e9e3ff;
        color: #333;
        margin-top: 1rem;
      }

      .add-btn:hover,
      .save-btn:hover {
        background-color: #d1bfff;
      }

      .cancel-btn {
        background-color: #f5f5f5;
        color: #333;
        margin-top: 1rem;
      }

      .cancel-btn:hover {
        background-color: #e0e0e0;
      }

      .add-form,
      .edit-form {
        background-color: #f9f9f9;
        border-radius: 8px;
        padding: 1.5rem;
        margin-top: 2rem;
      }

      .form-group {
        margin-bottom: 1rem;
      }

      .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
        color: #555;
      }

      .form-group input[type='text'],
      .form-group input[type='file'] {
        width: 100%;
        padding: 0.8rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;
      }

      .form-group input[type='file'] {
        padding: 0.5rem;
        background-color: #fff;
      }

      .image-preview {
        margin-top: 1rem;
        border: 1px dashed #ddd;
        border-radius: 4px;
        padding: 0.5rem;
        max-width: 300px;
      }

      .image-preview img {
        width: 100%;
        height: auto;
        display: block;
      }

      .edit-actions {
        display: flex;
        gap: 0.5rem;
      }

      /* Responsive styles for tablets */
      @media (max-width: 768px) {
        .admin-panel {
          padding: 1.5rem;
        }

        .items-grid,
        .slideshow-grid {
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 1rem;
        }

        .slideshow-grid {
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
        }

        .item-image {
          height: 140px;
        }

        .item-details,
        .item-actions {
          padding: 0.8rem;
        }

        .action-btn {
          padding: 0.4rem 0.8rem;
          font-size: 0.9rem;
        }
      }

      /* Responsive styles for mobile devices */
      @media (max-width: 480px) {
        .admin-panel {
          padding: 1rem;
          border-radius: 6px;
        }

        h2 {
          font-size: 1.3rem;
          margin-bottom: 1rem;
        }

        h3 {
          font-size: 1.1rem;
          margin: 1rem 0 0.8rem;
        }

        .current-items,
        .slideshow-selection {
          padding: 1rem;
        }

        .items-grid {
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 0.8rem;
        }

        .slideshow-grid {
          grid-template-columns: 1fr;
        }

        .item-image {
          height: 120px;
        }

        .item-details {
          padding: 0.7rem;
          font-size: 0.9rem;
        }

        .item-actions {
          flex-direction: column;
          padding: 0.7rem;
        }

        .action-btn {
          width: 100%;
          margin-bottom: 0.5rem;
          font-size: 0.85rem;
        }

        .add-form,
        .edit-form {
          padding: 1rem;
        }

        .form-group input[type='text'],
        .form-group input[type='file'] {
          padding: 0.6rem;
          font-size: 0.9rem;
        }

        .image-preview {
          max-width: 100%;
        }

        .edit-actions {
          flex-direction: column;
        }
      }
    `,
  ],
})
export class GalleryAdminComponent implements OnInit {
  galleryImages: GalleryImage[] = [];
  slideshowImages: SlideImage[] = [];
  newImage: GalleryImage = { src: '', alt: '' };
  editingImage: GalleryImage = { src: '', alt: '' };
  addToSlideshowOnCreate = false;

  isEditing = false;
  imagePreview: string | null = null;
  selectedFile: File | null = null;

  slideshowIds: string[] = [];

  constructor(
    private adminService: AdminService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.loadGallery();
    this.loadSlideshow();
    // Load ids for slideshow from server
    this.adminService.getSlideshowIds().subscribe((ids) => {
      this.slideshowIds = ids;
      this.loadSlideshow();
    });
  }

  loadGallery() {
    this.adminService.getGallery().subscribe((images) => {
      this.galleryImages = images;
      // After loading the gallery — update slideshowIds
      this.adminService.getSlideshowIds().subscribe((ids) => {
        this.slideshowIds = ids;
      });
    });
  }

  loadSlideshow() {
    this.adminService.getSlideshow().subscribe((slides) => {
      this.slideshowImages = slides;
    });
  }

  isInSlideshow(imageId?: string): boolean {
    if (!imageId) return false;
    return this.slideshowIds.includes(imageId);
  }

  toggleSlideshow(image: GalleryImage, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      if (!this.slideshowIds.includes(image.id!)) {
        this.slideshowIds.push(image.id!);
        this.adminService.setSlideshowIds(this.slideshowIds).subscribe(() => {
          this.loadGallery(); // update gallery and ids after change
        });
      }
    } else {
      this.slideshowIds = this.slideshowIds.filter((id) => id !== image.id);
      this.adminService.setSlideshowIds(this.slideshowIds).subscribe(() => {
        this.loadGallery(); // update gallery and ids after change
      });
    }
  }

  removeFromSlideshow(id: string) {
    this.adminService.deleteSlide(id).subscribe(() => {
      this.loadSlideshow();
    });
  }

  onFileSelected(event: Event) {
    const element = event.target as HTMLInputElement;
    if (element.files && element.files.length > 0) {
      this.selectedFile = element.files[0];

      // Create image preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  addImage() {
    if (!this.selectedFile || !this.newImage.alt) {
      alert(this.translate.instant('ADMIN.GALLERY.FILL_ALL'));
      return;
    }

    if (this.galleryImages.length >= 30) {
      alert(this.translate.instant('ADMIN.GALLERY.LIMIT_GALLERY'));
      return;
    }

    // Upload file to server
    this.adminService.uploadFile(this.selectedFile).subscribe((response) => {
      if (response.success) {
        // Form the file path as assets/gallery/filename.ext
        const image: GalleryImage = {
          src: response.filePath, // Server returns the file path
          alt: this.newImage.alt,
        };

        this.adminService.addImage(image).subscribe((addedImage) => {
          this.resetForm();
          this.loadGallery();

          // If need to add to slideshow
          if (this.addToSlideshowOnCreate && this.slideshowImages.length < 10) {
            const slide: SlideImage = {
              id: addedImage.id,
              image: addedImage.src,
              alt: addedImage.alt,
            };

            this.adminService.addSlide(slide).subscribe(() => {
              this.loadSlideshow();
              this.resetForm();
            });
          }
        });
      } else {
        // Handle upload error
        alert(response.error || 'Error uploading file');
      }
    });
  }

  editImage(image: GalleryImage) {
    this.isEditing = true;
    this.editingImage = { ...image };
    this.imagePreview = null;
    this.selectedFile = null;
  }

  saveEdit() {
    if (!this.editingImage.alt) {
      alert(this.translate.instant('ADMIN.GALLERY.FILL_DESCRIPTION'));
      return;
    }

    if (this.selectedFile) {
      // If a file was selected, upload it
      this.adminService.uploadFile(this.selectedFile).subscribe((response) => {
        if (response.success) {
          this.editingImage.src = response.filePath;
          this.updateImage();
        } else {
          // Handle upload error
          alert(response.error || 'Error uploading file');
        }
      });
    } else {
      // If no file was selected, just update the data
      this.updateImage();
    }
  }

  updateImage() {
    this.adminService.updateImage(this.editingImage).subscribe(() => {
      // If the image is in the slideshow, update it too
      const slideshowImage = this.slideshowImages.find(
        (slide) => slide.id === this.editingImage.id
      );
      if (slideshowImage) {
        const updatedSlide: SlideImage = {
          id: this.editingImage.id,
          image: this.editingImage.src,
          alt: this.editingImage.alt,
        };

        this.adminService.updateSlide(updatedSlide).subscribe(() => {
          this.cancelEdit();
          this.loadGallery();
          this.loadSlideshow();
        });
      } else {
        this.cancelEdit();
        this.loadGallery();
      }
    });
  }

  deleteImage(id: string) {
    if (confirm(this.translate.instant('ADMIN.GALLERY.DELETE_CONFIRM'))) {
      // First, check if the image is in the slideshow
      const inSlideshow = this.slideshowImages.some((slide) => slide.id === id);

      // Remove from gallery
      this.adminService.deleteImage(id).subscribe(() => {
        this.loadGallery();

        // If the image was in the slideshow, remove it from there too
        if (inSlideshow) {
          this.adminService.deleteSlide(id).subscribe(() => {
            this.loadSlideshow();
          });
        }
      });
    }
  }

  cancelEdit() {
    this.isEditing = false;
    this.editingImage = { src: '', alt: '' };
    this.imagePreview = null;
    this.selectedFile = null;
  }

  resetForm() {
    this.newImage = { src: '', alt: '' };
    this.imagePreview = null;
    this.selectedFile = null;
    this.addToSlideshowOnCreate = false;
  }
}
