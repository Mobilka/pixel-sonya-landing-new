import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, SlideImage } from '../../services/admin.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-slideshow-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  template: `
    <div class="admin-panel">
      <h2>{{ 'ADMIN.GALLERY.SLIDESHOW' | translate }}</h2>

      <div class="current-items">
        <h3>
          {{
            'ADMIN.GALLERY.SLIDESHOW_SELECTED'
              | translate : { count: slides.length }
          }}
        </h3>
        <div class="items-grid">
          <div class="item-card" *ngFor="let slide of slides">
            <div class="item-image">
              <img [src]="slide.image" [alt]="slide.alt" />
            </div>
            <div class="item-details">
              <p>
                <strong>{{ 'ADMIN.GALLERY.DESCRIPTION' | translate }}</strong>
                {{ slide.alt }}
              </p>
            </div>
            <div class="item-actions">
              <button class="action-btn edit-btn" (click)="editSlide(slide)">
                {{ 'ADMIN.GALLERY.EDIT' | translate }}
              </button>
              <button
                class="action-btn delete-btn"
                (click)="deleteSlide(slide.id!)"
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
          <input type="text" id="new-alt" [(ngModel)]="newSlide.alt" />
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
        <div class="image-preview" *ngIf="imagePreview">
          <img
            [src]="imagePreview"
            alt="{{ 'ADMIN.GALLERY.PREVIEW' | translate }}"
          />
        </div>
        <button class="action-btn add-btn" (click)="addSlide()">
          {{ 'ADMIN.GALLERY.ADD_BUTTON' | translate }}
        </button>
      </div>

      <div class="edit-form" *ngIf="isEditing">
        <h3>{{ 'ADMIN.GALLERY.EDIT_IMAGE' | translate }}</h3>
        <div class="form-group">
          <label for="edit-alt">{{
            'ADMIN.GALLERY.DESCRIPTION' | translate
          }}</label>
          <input type="text" id="edit-alt" [(ngModel)]="editingSlide.alt" />
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
            [src]="imagePreview || editingSlide.image"
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

      .current-items {
        margin-bottom: 2rem;
      }

      .items-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 1.5rem;
      }

      .item-card {
        border: 1px solid #eee;
        border-radius: 8px;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        transition: transform 0.2s, box-shadow 0.2s;
        background-color: #fff;
      }

      .item-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
      }

      .item-image {
        height: 200px;
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

        .items-grid {
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1rem;
        }

        .item-image {
          height: 160px;
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

        .items-grid {
          grid-template-columns: 1fr;
        }

        .item-image {
          height: 180px;
        }

        .item-actions {
          flex-direction: column;
        }

        .action-btn {
          width: 100%;
          margin-bottom: 0.5rem;
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
export class SlideshowAdminComponent implements OnInit {
  slides: SlideImage[] = [];
  newSlide: SlideImage = { image: '', alt: '' };
  editingSlide: SlideImage = { image: '', alt: '' };

  isEditing = false;
  imagePreview: string | null = null;
  selectedFile: File | null = null;

  constructor(
    private adminService: AdminService,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    this.loadSlides();
  }

  loadSlides() {
    this.adminService.getSlideshow().subscribe((slides) => {
      this.slides = slides;
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

  addSlide() {
    if (!this.selectedFile || !this.newSlide.alt) {
      alert('Please fill in all fields and select an image');
      return;
    }

    // In a real application, here would be a request to upload the file
    // Now we simulate upload
    this.adminService.uploadFile(this.selectedFile).subscribe((response) => {
      if (response.success) {
        const slide: SlideImage = {
          image: response.filePath,
          alt: this.newSlide.alt,
        };

        this.adminService.addSlide(slide).subscribe(() => {
          this.resetForm();
          this.loadSlides();
        });
      }
    });
  }

  editSlide(slide: SlideImage) {
    this.isEditing = true;
    this.editingSlide = { ...slide };
    this.imagePreview = null;
    this.selectedFile = null;
  }

  saveEdit() {
    if (!this.editingSlide.alt) {
      alert('Please fill in the description');
      return;
    }

    if (this.selectedFile) {
      // If a file was selected, upload it
      this.adminService.uploadFile(this.selectedFile).subscribe((response) => {
        if (response.success) {
          this.editingSlide.image = response.filePath;
          this.updateSlide();
        }
      });
    } else {
      // If no file was selected, just update the data
      this.updateSlide();
    }
  }

  updateSlide() {
    this.adminService.updateSlide(this.editingSlide).subscribe(() => {
      this.cancelEdit();
      this.loadSlides();
    });
  }

  deleteSlide(id: string) {
    if (confirm('Are you sure you want to delete this slide?')) {
      this.adminService.deleteSlide(id).subscribe(() => {
        this.loadSlides();
      });
    }
  }

  cancelEdit() {
    this.isEditing = false;
    this.editingSlide = { image: '', alt: '' };
    this.imagePreview = null;
    this.selectedFile = null;
  }

  resetForm() {
    this.newSlide = { image: '', alt: '' };
    this.imagePreview = null;
    this.selectedFile = null;
  }
}
