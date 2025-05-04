import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="admin-container">
      <header class="admin-header">
        <h1>Панель Администратора</h1>
        <button class="menu-toggle" (click)="toggleMenu()">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="24"
            height="24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </button>
        <div class="admin-nav" [class.nav-open]="menuOpen">
          <a routerLink="/admin/slideshow" routerLinkActive="active"
            >Слайдшоу</a
          >
          <a routerLink="/admin/gallery" routerLinkActive="active">Галерея</a>
          <a routerLink="/admin/hero" routerLinkActive="active"
            >Главный текст</a
          >
          <a routerLink="/admin/contacts" routerLinkActive="active">Контакты</a>
          <a routerLink="/" class="back-link">На сайт</a>
        </div>
      </header>
      <main class="admin-content">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [
    `
      .admin-container {
        display: flex;
        flex-direction: column;
        min-height: 100vh;
        background-color: #f5f5f5;
      }

      .admin-header {
        background-color: #fff3ed;
        color: #333;
        padding: 1rem 2rem;
        border-bottom: 1px solid #e6c7b7;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
        position: relative;
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;
      }

      .admin-header h1 {
        margin: 0;
        font-size: 1.8rem;
      }

      .menu-toggle {
        display: none;
        background: none;
        border: none;
        cursor: pointer;
        padding: 0.5rem;
        color: #333;
      }

      .admin-nav {
        display: flex;
        gap: 1rem;
        margin-top: 1rem;
        width: 100%;
      }

      .admin-nav a {
        padding: 0.5rem 1rem;
        text-decoration: none;
        color: #333;
        background-color: #fff;
        border-radius: 4px;
        transition: all 0.3s ease;
        border: 1px solid #e6c7b7;
        white-space: nowrap;
      }

      .admin-nav a:hover {
        background-color: #f4e1d7;
      }

      .admin-nav a.active {
        background-color: #e6c7b7;
        color: #333;
        font-weight: bold;
      }

      .admin-nav .back-link {
        margin-left: auto;
        background-color: #e9e3ff;
        border-color: #d1bfff;
      }

      .admin-nav .back-link:hover {
        background-color: #d1bfff;
      }

      .admin-content {
        padding: 2rem;
        flex: 1;
      }

      /* Стили для мобильных устройств */
      @media (max-width: 768px) {
        .admin-header {
          padding: 1rem;
          flex-direction: column;
          align-items: flex-start;
        }

        .admin-header h1 {
          font-size: 1.5rem;
          margin-bottom: 0.5rem;
        }

        .menu-toggle {
          display: block;
          position: absolute;
          top: 1rem;
          right: 1rem;
        }

        .admin-nav {
          flex-direction: column;
          width: 100%;
          gap: 0.5rem;
          height: 0;
          overflow: hidden;
          transition: height 0.3s ease;
          margin-top: 0;
        }

        .admin-nav.nav-open {
          height: auto;
          margin-top: 1rem;
        }

        .admin-nav a {
          width: 100%;
          text-align: center;
        }

        .admin-nav .back-link {
          margin-left: 0;
          margin-top: 1rem;
        }

        .admin-content {
          padding: 1rem;
        }
      }

      /* Стили для маленьких экранов (телефоны) */
      @media (max-width: 480px) {
        .admin-header h1 {
          font-size: 1.3rem;
        }

        .admin-content {
          padding: 0.8rem;
        }
      }
    `,
  ],
})
export class AdminComponent {
  menuOpen = false;

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
}
