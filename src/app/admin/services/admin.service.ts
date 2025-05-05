import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap, catchError, map } from 'rxjs/operators';

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

  // Keys for LocalStorage
  private GALLERY_KEY = 'gallery';
  private SLIDESHOW_KEY = 'slideshow';
  private API_BASE_URL = 'http://localhost:3002'; // Updated to match current server port

  // Temporary data until real API is connected
  private tempSlideshow: SlideImage[] = [];

  private tempGallery: GalleryImage[] = [];

  private tempHero: HeroContent = {
    title: 'Pixel Sonya Photography',
    description:
      'Professional photography for your business and personal events',
  };

  private tempContacts: ContactInfo = {
    email: 'pixelsonya@gmail.com',
    phone: '+972 052 728 4388',
  };

  constructor(private http: HttpClient) {
    // Clear slideshow on start
    this.tempSlideshow = [];
    localStorage.removeItem(this.SLIDESHOW_KEY);

    // Initialize data from LocalStorage or temporary variables
    const savedGallery = localStorage.getItem(this.GALLERY_KEY);

    // If data exists in localStorage, use it
    if (savedGallery) {
      this.tempGallery = JSON.parse(savedGallery);
    }

    // Load gallery list from server
    this.http.get<any>(`${this.API_BASE_URL}/api/gallery`).subscribe(
      (response) => {
        if (response.success && response.images && response.images.length > 0) {
          console.log('Received response from server with gallery:', response);

          // Create gallery objects based on files from server
          const serverImages = response.images.map((img: any) => {
            const src = img.path.startsWith('/assets/gallery/')
              ? img.path
              : '/assets/gallery/' + img.filename;
            console.log('GalleryImage:', { id: img.filename, src });
            return {
              id: img.filename,
              src,
              alt:
                img.filename
                  .split('-')
                  .slice(1)
                  .join('-')
                  .replace(/\.[^/.]+$/, '') || img.filename,
            };
          });

          console.log('Transformed images:', serverImages);

          // Update gallery
          this.tempGallery = serverImages;
          localStorage.setItem(
            this.GALLERY_KEY,
            JSON.stringify(this.tempGallery)
          );
          this.gallerySubject.next(this.tempGallery);
        } else {
          console.log(
            'No images in server response or error in response structure'
          );
        }
      },
      (error) => {
        console.error('Error loading gallery from server', error);
      }
    );

    // Initialize observables
    this.slideshowSubject.next(this.tempSlideshow);
    this.gallerySubject.next(this.tempGallery);
    this.heroSubject.next(this.tempHero);
    this.contactsSubject.next(this.tempContacts);
  }

  // Methods for working with slideshow
  getSlideshow(): Observable<SlideImage[]> {
    return this.getSlideshowIds().pipe(
      map((ids) => {
        const slides = this.tempGallery
          .filter((img) => ids.includes(img.id!))
          .map((img) => ({
            id: img.id,
            image: img.src,
            alt: img.alt,
          }));
        this.tempSlideshow = slides;
        this.slideshowSubject.next(this.tempSlideshow);
        return this.tempSlideshow;
      }),
      catchError((err) => {
        console.error('Error getting slideshow:', err);
        return of([]);
      })
    );
  }

  addSlide(slide: SlideImage): Observable<SlideImage> {
    // Add id to tempSlideshow only if it is not present
    if (!this.tempSlideshow.some((s) => s.id === slide.id)) {
      this.tempSlideshow.push(slide);
      localStorage.setItem(
        this.SLIDESHOW_KEY,
        JSON.stringify(this.tempSlideshow)
      );
      this.slideshowSubject.next(this.tempSlideshow);
      // Save id on server
      this.setSlideshowIds(this.tempSlideshow.map((s) => s.id!)).subscribe();
    }
    return of(slide);
  }

  updateSlide(slide: SlideImage): Observable<SlideImage> {
    const index = this.tempSlideshow.findIndex((s) => s.id === slide.id);
    if (index !== -1) {
      this.tempSlideshow[index] = slide;
      localStorage.setItem(
        this.SLIDESHOW_KEY,
        JSON.stringify(this.tempSlideshow)
      );
      this.slideshowSubject.next([...this.tempSlideshow]);
    }
    return of(slide);
  }

  deleteSlide(id: string): Observable<boolean> {
    this.tempSlideshow = this.tempSlideshow.filter((s) => s.id !== id);
    localStorage.setItem(
      this.SLIDESHOW_KEY,
      JSON.stringify(this.tempSlideshow)
    );
    this.slideshowSubject.next(this.tempSlideshow);
    // Save id on server
    this.setSlideshowIds(this.tempSlideshow.map((s) => s.id!)).subscribe();
    return of(true);
  }

  // Methods for working with gallery
  getGallery(): Observable<GalleryImage[]> {
    return of(this.tempGallery);
  }

  addImage(image: GalleryImage): Observable<GalleryImage> {
    const newId = String(Date.now());
    const newImage = { ...image, id: newId };
    this.tempGallery.push(newImage);
    localStorage.setItem(this.GALLERY_KEY, JSON.stringify(this.tempGallery));
    this.gallerySubject.next(this.tempGallery);
    return of(newImage);
  }

  updateImage(image: GalleryImage): Observable<GalleryImage> {
    const index = this.tempGallery.findIndex((img) => img.id === image.id);
    if (index !== -1) {
      this.tempGallery[index] = image;
      localStorage.setItem(this.GALLERY_KEY, JSON.stringify(this.tempGallery));
      this.gallerySubject.next([...this.tempGallery]);
    }
    return of(image);
  }

  deleteImage(id: string): Observable<boolean> {
    this.tempGallery = this.tempGallery.filter((img) => img.id !== id);
    localStorage.setItem(this.GALLERY_KEY, JSON.stringify(this.tempGallery));
    this.gallerySubject.next(this.tempGallery);
    return of(true);
  }

  // Methods for working with hero section information
  getHeroContent(): Observable<HeroContent> {
    return of(this.tempHero);
  }

  updateHeroContent(content: HeroContent): Observable<HeroContent> {
    this.tempHero = content;
    this.heroSubject.next(this.tempHero);
    return of(this.tempHero);
  }

  // Methods for working with contact information
  getContactInfo(): Observable<ContactInfo> {
    return of(this.tempContacts);
  }

  updateContactInfo(info: ContactInfo): Observable<ContactInfo> {
    this.tempContacts = info;
    this.contactsSubject.next(this.tempContacts);
    return of(this.tempContacts);
  }

  // Helper method for file upload (to be implemented in the future)
  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    // Send file to server for physical upload to assets/gallery folder
    return this.http.post(`${this.API_BASE_URL}/api/upload`, formData).pipe(
      tap((response) => console.log('Upload response:', response)),
      catchError((error) => {
        console.error('Error uploading file:', error);
        return of({
          success: false,
          error: 'Error uploading file',
        });
      })
    );
  }

  // Get list of ids for slideshow from server
  getSlideshowIds(): Observable<string[]> {
    return this.http
      .get<{ success: boolean; ids: string[] }>(
        `${this.API_BASE_URL}/api/slideshow`
      )
      .pipe(
        map((res) => (Array.isArray(res.ids) ? res.ids : [])),
        catchError((err) => {
          console.error('Error getting slideshow ids:', err);
          return of([]);
        })
      );
  }

  // Save list of ids for slideshow on server
  setSlideshowIds(ids: string[]): Observable<any> {
    return this.http.post(`${this.API_BASE_URL}/api/slideshow`, { ids }).pipe(
      tap(() => console.log('Slideshow id list saved on server:', ids)),
      catchError((err) => {
        console.error('Error saving slideshow ids:', err);
        return of({ success: false });
      })
    );
  }
}
