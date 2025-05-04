import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, HeroContent } from '../../services/admin.service';

@Component({
  selector: 'app-hero-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="admin-panel">
      <h2>Управление текстом в главной секции</h2>

      <div class="current-content">
        <h3>Текущий текст</h3>
        <div class="content-card">
          <h4>{{ heroContent.title }}</h4>
          <p>{{ heroContent.description }}</p>
        </div>
      </div>

      <div class="edit-form">
        <h3>Редактировать текст</h3>
        <div class="form-group">
          <label for="title">Заголовок:</label>
          <input type="text" id="title" [(ngModel)]="editingContent.title" />
        </div>
        <div class="form-group">
          <label for="description">Описание:</label>
          <textarea
            id="description"
            [(ngModel)]="editingContent.description"
            rows="5"
          ></textarea>
        </div>
        <div class="form-actions">
          <button class="action-btn save-btn" (click)="saveContent()">
            Сохранить
          </button>
          <button class="action-btn cancel-btn" (click)="resetForm()">
            Отмена
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

      .current-content {
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

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadHeroContent();
  }

  loadHeroContent() {
    this.adminService.getHeroContent().subscribe((content) => {
      this.heroContent = content;
      this.editingContent = { ...content };
    });
  }

  saveContent() {
    if (!this.editingContent.title || !this.editingContent.description) {
      alert('Пожалуйста, заполните все поля');
      return;
    }

    this.adminService
      .updateHeroContent(this.editingContent)
      .subscribe((updatedContent) => {
        this.heroContent = updatedContent;
        alert('Содержимое успешно обновлено');
      });
  }

  resetForm() {
    this.editingContent = { ...this.heroContent };
  }
}
