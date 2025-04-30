import { Component, OnInit, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { TranslateService, TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, FormsModule, CommonModule, TranslateModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'Pixel Sonya';

  // Поддерживаемые языки
  langs = ['he', 'en', 'ru'];
  currentLang = 'he'; // Иврит по умолчанию

  // Добавляем контактную информацию
  contactInfo = {
    email: 'pixelsonya@gmail.com',
    phone: '+972 052 728 4388',
  };

  // Флаг для отображения галереи
  isGalleryOpen = false;

  // Данные слайд-шоу
  slides = [
    {
      image: 'assets/Sonya.png',
      alt: 'Портрет Сони',
    },
    {
      image: 'assets/logo.png',
      alt: 'Логотип Pixel Sonya',
    },
    {
      image: 'assets/Sonya.png', // Временно дублируем, пока нет других фото
      alt: 'Соня работает',
    },
    {
      image: 'assets/logo.png', // Временно дублируем, пока нет других фото
      alt: 'Работы Pixel Sonya',
    },
  ];

  // Галерея изображений - количество примеров сокращено, дубликаты удалены
  galleryImages = [
    { src: 'assets/Sonya.png', alt: 'Портрет Сони' },
    { src: 'assets/logo.png', alt: 'Логотип Pixel Sonya' },
    // Ниже заглушки, которые нужно будет заменить на реальные работы
    { src: 'assets/Sonya.png', alt: 'Пример работы 1' },
    { src: 'assets/logo.png', alt: 'Пример работы 2' },
    { src: 'assets/Sonya.png', alt: 'Пример работы 3' },
    { src: 'assets/logo.png', alt: 'Пример работы 4' },
  ];

  // Переменные для модального окна галереи
  selectedImage = '';
  selectedImageAlt = '';
  selectedImageIndex = -1;

  currentSlide = 0;
  slideInterval: any;

  // Данные формы
  formData = {
    name: '',
    phone: '',
    email: '',
    message: '',
    preferredContact: '',
  };

  constructor(private translate: TranslateService) {
    // Установка языка по умолчанию и доступных языков
    translate.addLangs(this.langs);
    translate.setDefaultLang('he');
    translate.use('he');
  }

  ngOnInit() {
    // Автоматическая смена слайдов каждые 5 секунд
    this.startSlideShow();

    // Устанавливаем начальное направление текста
    const htmlTag = document.getElementsByTagName('html')[0] as HTMLHtmlElement;
    if (this.currentLang === 'he') {
      htmlTag.setAttribute('dir', 'rtl');
    } else {
      htmlTag.setAttribute('dir', 'ltr');
    }
  }

  // Метод для смены языка
  changeLanguage(lang: string) {
    this.translate.use(lang);
    this.currentLang = lang;

    // Устанавливаем направление текста (RTL для иврита)
    const htmlTag = document.getElementsByTagName('html')[0] as HTMLHtmlElement;
    if (lang === 'he') {
      htmlTag.setAttribute('dir', 'rtl');
    } else {
      htmlTag.setAttribute('dir', 'ltr');
    }
  }

  // Запуск автоматической смены слайдов
  startSlideShow() {
    this.slideInterval = setInterval(() => {
      this.nextSlide();
    }, 5000);
  }

  // Остановка автоматической смены слайдов
  stopSlideShow() {
    clearInterval(this.slideInterval);
  }

  // Переход к следующему слайду
  nextSlide() {
    this.currentSlide = (this.currentSlide + 1) % this.slides.length;
  }

  // Переход к предыдущему слайду
  prevSlide() {
    this.currentSlide =
      (this.currentSlide - 1 + this.slides.length) % this.slides.length;
  }

  // Переход к конкретному слайду
  goToSlide(index: number) {
    this.currentSlide = index;
  }

  // Метод отправки формы
  onSubmit() {
    console.log('Форма отправлена с данными:', this.formData);
    // Здесь будет логика отправки данных на сервер
    this.translate.get('CONTACT.SUCCESS').subscribe((res: string) => {
      alert(res);
    });
    this.resetForm();
  }

  // Сброс формы
  resetForm() {
    this.formData = {
      name: '',
      phone: '',
      email: '',
      message: '',
      preferredContact: '',
    };
  }

  // Метод установки предпочтительного способа связи
  setPreferredContact(type: string) {
    this.formData.preferredContact = type;
  }

  // Метод для отображения галереи
  showGallery() {
    this.isGalleryOpen = true;
  }

  // Закрытие галереи
  closeGallery() {
    this.isGalleryOpen = false;
  }

  // Открыть увеличенное изображение
  openImageModal(src: string, alt: string) {
    this.selectedImage = src;
    this.selectedImageAlt = alt;
    // Находим индекс текущего изображения
    this.selectedImageIndex = this.galleryImages.findIndex(
      (img) => img.src === src && img.alt === alt
    );
  }

  // Закрыть увеличенное изображение
  closeImageModal() {
    this.selectedImage = '';
    this.selectedImageAlt = '';
    this.selectedImageIndex = -1;
  }

  // Перейти к следующему изображению
  nextImage(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    if (this.selectedImageIndex < this.galleryImages.length - 1) {
      this.selectedImageIndex++;
    } else {
      this.selectedImageIndex = 0; // Переход к первому изображению, если достигнут конец
    }
    const newImage = this.galleryImages[this.selectedImageIndex];
    this.selectedImage = newImage.src;
    this.selectedImageAlt = newImage.alt;
  }

  // Перейти к предыдущему изображению
  prevImage(event?: Event) {
    if (event) {
      event.stopPropagation();
    }
    if (this.selectedImageIndex > 0) {
      this.selectedImageIndex--;
    } else {
      this.selectedImageIndex = this.galleryImages.length - 1; // Переход к последнему изображению, если достигнуто начало
    }
    const newImage = this.galleryImages[this.selectedImageIndex];
    this.selectedImage = newImage.src;
    this.selectedImageAlt = newImage.alt;
  }

  // Обработчик клавиш для навигации
  @HostListener('window:keydown', ['$event'])
  handleKeyboardNavigation(event: KeyboardEvent) {
    if (!this.selectedImage) return; // Выходим, если модальное окно не открыто

    switch (event.key) {
      case 'ArrowRight':
        this.nextImage();
        break;
      case 'ArrowLeft':
        this.prevImage();
        break;
      case 'Escape':
        this.closeImageModal();
        break;
    }
  }

  // Методы для контактных кнопок
  openChat() {
    // Реализация открытия чата
    alert('Открытие чата');
    // Будущая реализация чата
  }

  // Метод для отправки email
  sendEmail() {
    window.location.href = `mailto:${this.contactInfo.email}`;
  }

  // Метод для звонка
  callPhone() {
    window.location.href = `tel:${this.contactInfo.phone.replace(/\D/g, '')}`;
  }

  // Метод для открытия WhatsApp - пустая реализация для фикса ошибки
  openWhatsApp() {
    // Пустая реализация для обхода ошибки компиляции
  }
}
