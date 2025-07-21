import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileCardComponent } from '../../shared/components/profile-card/profile-card.component';
import { InformationComponent } from './components/information.component';
import { PokemonSelectionComponent } from '../selection/components/pokemon-selection/pokemon-selection.component';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { StatsSummaryComponent } from '../summary/components/stats-summary/stats-summary.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ProfileCardComponent,
    InformationComponent,
    PokemonSelectionComponent,
    LoadingSpinnerComponent,
    StatsSummaryComponent
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent {
  imageUrl = signal<string>('');
  userName = signal<string>('');
  userHobby = signal<string>('');
  userAge = signal<number>(0);
  selectedPokemonIds = signal<number[]>([]);
  currentStep = signal<'info' | 'loading' | 'pokemon' | 'summary'>('info');

  /**
   * Update the image URL with the provided data URL.
   * @param {string} dataUrl - The data URL of the image to update.
   * @returns None
   */
  updateImage(dataUrl: string) {
    this.imageUrl.set(dataUrl);
  }

  /**
   * Sets the user's name, hobby, and age based on the provided data object, then changes the current step to 'loading'.
   * After a delay of 2000ms, changes the current step to 'pokemon'.
   * @param {object} data - An object containing the user's name, hobby, and age.
   * @param {string} data.name - The user's name.
   * @param {string} data.hobby - The user's hobby.
   * @param {number} data.age - The user's age.
   * @returns None
   */
  goToLoadingAndNextStep(data: { name: string; hobby: string; age: number }) {
    this.userName.set(data.name);
    this.userHobby.set(data.hobby);
    this.userAge.set(data.age);
    this.currentStep.set('loading');

    setTimeout(() => {
      this.currentStep.set('pokemon');
    }, 2000);
  }

  /**
   * Updates the selected Pokemon IDs, sets the current step to 'loading', and then
   * after a delay of 2000ms, sets the current step to 'summary'.
   * @param {number[]} selectedIds - An array of selected Pokemon IDs.
   * @returns None
   */
  handlePokemonSelected(selectedIds: number[]) {
    this.selectedPokemonIds.set(selectedIds);
    this.currentStep.set('loading');

    setTimeout(() => {
      this.currentStep.set('summary');
    }, 2000);
  }

  /**
   * Scrolls back to the Pokemon selection section and sets the current step to 'pokemon'.
   * Uses a timeout to allow for smooth scrolling.
   * @returns None
   */
  goBackToPokemonSelection() {
    this.currentStep.set('pokemon');
    setTimeout(() => {
      const section = document.getElementById('pokemon');
      section?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }
}
