import { bootstrapApplication } from '@angular/platform-browser';
import { ProfileComponent } from './app/features/profile/profile.component';
import { provideHttpClient } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import 'zone.js';

bootstrapApplication(ProfileComponent, {
  providers: [
    provideHttpClient(),
    importProvidersFrom(BrowserAnimationsModule)
  ]
}).catch(err => console.error(err));
