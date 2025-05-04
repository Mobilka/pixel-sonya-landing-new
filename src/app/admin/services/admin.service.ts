import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';

export interface SlideImage {
  id?: string;
  image: string;
  alt: string;
}

export interface GalleryImage {
  id?: string;
  src: string;
  alt: string;
}

export interface HeroContent {
  title: string;
  description: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
}

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private slideshowSubject = new BehaviorSubject<SlideImage[]>([]);
  private gallerySubject = new BehaviorSubject<GalleryImage[]>([]);
  private heroSubject = new BehaviorSubject<HeroContent>({
    title: '',
    description: '',
  });
  private contactsSubject = new BehaviorSubject<ContactInfo>({
    email: '',
    phone: '',
  });

  slideshow$ = this.slideshowSubject.asObservable();
  gallery$ = this.gallerySubject.asObservable();
  hero$ = this.heroSubject.asObservable();
  contacts$ = this.contactsSubject.asObservable();

  // Временные данные до подключения реального API
  private tempSlideshow: SlideImage[] = [
    { id: '1', image: 'assets/Sonya.png', alt: 'Portrait of Sonya' },
    { id: '2', image: 'assets/logo.png', alt: 'Pixel Sonya Logo' },
    { id: '3', image: 'assets/Sonya.png', alt: 'Sonya working' },
    { id: '4', image: 'assets/logo.png', alt: 'Pixel Sonya Works' },
  ];

  private tempGallery: GalleryImage[] = Array.from({ length: 10 }, (_, i) => {
    const isEven = i % 2 === 0;
    return {
      id: String(i + 1),
      src: isEven ? 'assets/Sonya.png' : 'assets/logo.png',
      alt: `${isEven ? 'Sonya' : 'Logo'} - example ${i + 1}`,
    };
  });

  private tempHero: HeroContent = {
    title: 'Pixel Sonya Photography',
    description:
      'Профессиональная фотография для вашего бизнеса и личных событий',
  };

  private tempContacts: ContactInfo = {
    email: 'pixelsonya@gmail.com',
    phone: '+972 052 728 4388',
  };

  constructor(private http: HttpClient) {
    // Инициализация данных из временных переменных
    this.slideshowSubject.next(this.tempSlideshow);
    this.gallerySubject.next(this.tempGallery);
    this.heroSubject.next(this.tempHero);
    this.contactsSubject.next(this.tempContacts);
  }

  // Методы для работы со слайдшоу
  getSlideshow(): Observable<SlideImage[]> {
    // В будущем здесь будет запрос к API
    return of(this.tempSlideshow);
  }

  addSlide(slide: SlideImage): Observable<SlideImage> {
    // Имитация добавления слайда
    const newId = String(this.tempSlideshow.length + 1);
    const newSlide = { ...slide, id: newId };
    this.tempSlideshow.push(newSlide);
    this.slideshowSubject.next(this.tempSlideshow);
    return of(newSlide);
  }

  updateSlide(slide: SlideImage): Observable<SlideImage> {
    // Имитация обновления слайда
    const index = this.tempSlideshow.findIndex((s) => s.id === slide.id);
    if (index !== -1) {
      this.tempSlideshow[index] = slide;
      this.slideshowSubject.next([...this.tempSlideshow]);
    }
    return of(slide);
  }

  deleteSlide(id: string): Observable<boolean> {
    // Имитация удаления слайда
    this.tempSlideshow = this.tempSlideshow.filter((s) => s.id !== id);
    this.slideshowSubject.next(this.tempSlideshow);
    return of(true);
  }

  // Методы для работы с галереей
  getGallery(): Observable<GalleryImage[]> {
    return of(this.tempGallery);
  }

  addImage(image: GalleryImage): Observable<GalleryImage> {
    // Имитация добавления изображения
    const newId = String(this.tempGallery.length + 1);
    const newImage = { ...image, id: newId };
    this.tempGallery.push(newImage);
    this.gallerySubject.next(this.tempGallery);
    return of(newImage);
  }

  updateImage(image: GalleryImage): Observable<GalleryImage> {
    // Имитация обновления изображения
    const index = this.tempGallery.findIndex((img) => img.id === image.id);
    if (index !== -1) {
      this.tempGallery[index] = image;
      this.gallerySubject.next([...this.tempGallery]);
    }
    return of(image);
  }

  deleteImage(id: string): Observable<boolean> {
    // Имитация удаления изображения
    this.tempGallery = this.tempGallery.filter((img) => img.id !== id);
    this.gallerySubject.next(this.tempGallery);
    return of(true);
  }

  // Методы для работы с информацией в hero секции
  getHeroContent(): Observable<HeroContent> {
    return of(this.tempHero);
  }

  updateHeroContent(content: HeroContent): Observable<HeroContent> {
    this.tempHero = content;
    this.heroSubject.next(this.tempHero);
    return of(this.tempHero);
  }

  // Методы для работы с контактной информацией
  getContactInfo(): Observable<ContactInfo> {
    return of(this.tempContacts);
  }

  updateContactInfo(info: ContactInfo): Observable<ContactInfo> {
    this.tempContacts = info;
    this.contactsSubject.next(this.tempContacts);
    return of(this.tempContacts);
  }

  // Вспомогательный метод для загрузки файлов (будет реализован в будущем)
  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    // Здесь будет реальный запрос к API для загрузки файла
    // Пока возвращаем имитацию успешной загрузки
    return of({
      success: true,
      filePath: URL.createObjectURL(file),
    });
  }
}
