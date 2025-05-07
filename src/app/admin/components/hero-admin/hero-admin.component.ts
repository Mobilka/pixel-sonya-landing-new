import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, HeroContent } from '../../services/admin.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-hero-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  template: `
    <div class="admin-panel">
      <h2>{{ 'ADMIN.HERO.TITLE' | translate }}</h2>

      <div class="current-hero">
        <h3>{{ 'ADMIN.HERO.CURRENT_TEXT' | translate }}</h3>
        <div class="content-card">
          <h4>{{ heroContent.title }}</h4>
          <p>{{ heroContent.description }}</p>
        </div>
      </div>

      <div class="edit-form">
        <h3>{{ 'ADMIN.HERO.TITLE' | translate }}</h3>
        <div class="form-group">
          <label for="edit-title">{{
            'ADMIN.HERO.EDIT_TITLE' | translate
          }}</label>
          <input type="text" id="edit-title" [(ngModel)]="editHero.title" />
        </div>
        <div class="form-group">
          <label for="edit-description">{{
            'ADMIN.HERO.EDIT_DESCRIPTION' | translate
          }}</label>
          <textarea
            id="edit-description"
            [(ngModel)]="editHero.description"
          ></textarea>
        </div>
        <button class="action-btn save-btn" (click)="updateHero()">
          {{ 'ADMIN.HERO.UPDATE' | translate }}
        </button>
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

      .current-hero {
        margin-bottom: 2rem;
      }

      .content-card {
        background-color: #f9f9f9;
        border-radius: 8px;
        padding: 1.5rem;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      }

      .content-card h4 {
        font-size: 1.5rem;
        margin-bottom: 1rem;
        color: #333;
      }

      .content-card p {
        font-size: 1rem;
        color: #555;
        line-height: 1.5;
      }

      .edit-form {
        background-color: #f9f9f9;
        border-radius: 8px;
        padding: 1.5rem;
        margin-top: 2rem;
      }

      .form-group {
        margin-bottom: 1.5rem;
      }

      .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 500;
        color: #555;
      }

      .form-group input[type='text'],
      .form-group textarea {
        width: 100%;
        padding: 0.8rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;
      }

      .form-group textarea {
        resize: vertical;
        min-height: 100px;
      }

      .form-actions {
        display: flex;
        gap: 1rem;
      }

      .action-btn {
        padding: 0.5rem 1.5rem;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 500;
        transition: background-color 0.2s;
      }

      .save-btn {
        background-color: #e9e3ff;
        color: #333;
      }

      .save-btn:hover {
        background-color: #d1bfff;
      }

      .cancel-btn {
        background-color: #f5f5f5;
        color: #333;
      }

      .cancel-btn:hover {
        background-color: #e0e0e0;
      }

      @media (max-width: 768px) {
        .admin-panel {
          padding: 1.5rem;
        }

        .edit-form {
          padding: 1.2rem;
        }
      }

      @media (max-width: 480px) {
        .admin-panel {
          padding: 1rem;
        }

        .content-card {
          padding: 1rem;
        }

        .edit-form {
          padding: 1rem;
        }

        .form-actions {
          flex-direction: column;
        }

        .action-btn {
          width: 100%;
          margin-bottom: 0.5rem;
        }
      }
    `,
  ],
})
export class HeroAdminComponent implements OnInit {
  heroContent: HeroContent = { title: '', description: '' };
  editingContent: HeroContent = { title: '', description: '' };
  editHero: HeroContent = { title: '', description: '' };

  constructor(
    private adminService: AdminService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.loadHeroContent();
  }

  loadHeroContent() {
    this.adminService.getHeroContent().subscribe((content) => {
      this.heroContent = content;
      this.editingContent = { ...content };
    });
  }

  updateHero() {
    if (!this.editHero.title || !this.editHero.description) {
      alert(this.translate.instant('ADMIN.GALLERY.FILL_ALL'));
      return;
    }
    this.adminService.updateHeroContent(this.editHero).subscribe(() => {
      alert(this.translate.instant('ADMIN.HERO.HERO_UPDATED'));
      this.heroContent = { ...this.editHero };
    });
  }

  resetForm() {
    this.editingContent = { ...this.heroContent };
  }
}
