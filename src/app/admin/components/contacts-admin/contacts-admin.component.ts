import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService, ContactInfo } from '../../services/admin.service';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-contacts-admin',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  template: `
    <div class="admin-panel">
      <h2>{{ 'ADMIN.CONTACTS.TITLE' | translate }}</h2>

      <div class="current-content">
        <h3>{{ 'ADMIN.CONTACTS.CURRENT_CONTACTS' | translate }}</h3>
        <div class="content-card">
          <div class="contact-item">
            <strong>{{ 'ADMIN.CONTACTS.EMAIL' | translate }}</strong>
            {{ contactInfo.email }}
          </div>
          <div class="contact-item">
            <strong>{{ 'ADMIN.CONTACTS.PHONE' | translate }}</strong>
            {{ contactInfo.phone }}
          </div>
        </div>
      </div>

      <div class="edit-form">
        <h3>{{ 'ADMIN.CONTACTS.EDIT_CONTACTS' | translate }}</h3>
        <div class="form-group">
          <label for="edit-email">{{
            'ADMIN.CONTACTS.EMAIL' | translate
          }}</label>
          <input type="email" id="edit-email" [(ngModel)]="editingInfo.email" />
        </div>
        <div class="form-group">
          <label for="edit-phone">{{
            'ADMIN.CONTACTS.PHONE' | translate
          }}</label>
          <input type="tel" id="edit-phone" [(ngModel)]="editingInfo.phone" />
        </div>
        <div class="form-actions">
          <button class="action-btn save-btn" (click)="updateContacts()">
            {{ 'ADMIN.CONTACTS.UPDATE' | translate }}
          </button>
          <button class="action-btn cancel-btn" (click)="resetForm()">
            {{ 'ADMIN.CONTACTS.CANCEL' | translate }}
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

      .contact-item {
        margin-bottom: 1rem;
        font-size: 1.1rem;
      }

      .contact-item:last-child {
        margin-bottom: 0;
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

      .form-group input[type='email'],
      .form-group input[type='tel'] {
        width: 100%;
        padding: 0.8rem;
        border: 1px solid #ddd;
        border-radius: 4px;
        font-size: 1rem;
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
export class ContactsAdminComponent implements OnInit {
  contactInfo: ContactInfo = { email: '', phone: '' };
  editingInfo: ContactInfo = { email: '', phone: '' };

  constructor(
    private adminService: AdminService,
    private translate: TranslateService
  ) {}

  ngOnInit() {
    this.loadContactInfo();
  }

  loadContactInfo() {
    this.adminService.getContactInfo().subscribe((info) => {
      this.contactInfo = info;
      this.editingInfo = { ...info };
    });
  }

  updateContacts() {
    if (!this.editingInfo.email || !this.editingInfo.phone) {
      alert(this.translate.instant('ADMIN.GALLERY.FILL_ALL'));
      return;
    }
    this.adminService.updateContactInfo(this.editingInfo).subscribe(() => {
      alert(this.translate.instant('ADMIN.CONTACTS.CONTACTS_UPDATED'));
      this.contactInfo = { ...this.editingInfo };
    });
  }

  resetForm() {
    this.editingInfo = { ...this.contactInfo };
  }
}
