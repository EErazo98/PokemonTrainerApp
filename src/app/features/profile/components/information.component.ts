import { Component, Input, Output, EventEmitter, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MAT_DATE_LOCALE } from '@angular/material/core';

declare const M: any;

@Component({
  selector: 'app-information',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatChipsModule,
    MatAutocompleteModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-SV' }
  ]
})
export class InformationComponent {
  @Input() imageUrl: string = '';
  @Output() formCompleted = new EventEmitter<{ name: string; hobby: string; age: number }>();

  form: FormGroup;
  isAdult = signal(true);
  hobbies: string[] = [
    'Jugar Fútbol',
    'Jugar Basquetball',
    'Jugar Tennis',
    'Jugar Voleibol',
    'Jugar Fifa',
    'Jugar Videojuegos',
    'Leer libros',
    'Escuchar música',
    'Cocinar',
    'Dibujar'
  ];
  filteredHobbies: string[] = [];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      hobby: [''],
      birthday: ['', Validators.required],
      document: ['', Validators.required]
    });
  }

  /**
   * Updates the list of filtered hobbies based on the input value in the hobby form control.
   * Retrieves the hobby form control value, converts it to lowercase, and filters the list of hobbies
   * to match the input value in a case-insensitive manner.
   * @returns None
   */
  onHobbyInput() {
    const hobbyControl = this.form.get('hobby');
    const value = (hobbyControl?.value || '').toLowerCase();
    this.filteredHobbies = this.hobbies.filter(h =>
      h.toLowerCase().includes(value)
    );
  }

  /**
   * Updates the hobby form control with the selected hobby and clears the filtered hobbies list.
   * @param {string} hobby - The hobby selected by the user.
   * @returns None
   */
  selectHobby(hobby: string) {
    this.form.get('hobby')?.setValue(hobby);
    this.filteredHobbies = [];
  }

  /**
   * Updates the form based on the change in the birthday input field.
   * Calculates the age based on the birthdate and updates the validation rules for the document field accordingly.
   * @param {any} event - The event object containing the new value of the birthday input field.
   * @returns None
   */
  onBirthdayChange(event: any) {
    const birthDate = new Date(event.value);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const isNowAdult = age >= 18;

    this.isAdult.set(isNowAdult);

    const docControl = this.form.get('document');
    docControl?.clearValidators();

    if (isNowAdult) {
      docControl?.addValidators([
        Validators.required,
        Validators.pattern(/\d{8}-\d{1}/)
      ]);
    } else {
      docControl?.addValidators([
        Validators.required,
        Validators.pattern(/[A-Z]{3}-\d{6}/)
      ]);
    }
    docControl?.updateValueAndValidity();
  }

  /**
   * Formats the 'document' form control value by removing non-digit characters and
   * adding a hyphen at the 9th position if the length is greater than 8.
   * @returns None
   */
  formatDui(): void {
    const control = this.form.get('document');
    let value: string = control?.value || '';
    value = value.replace(/\D/g, '');
    if (value.length > 9) {
      value = value.substring(0, 9);
    }
    if (value.length > 8) {
      value = `${value.substring(0, 8)}-${value.substring(8)}`;
    }
    control?.setValue(value, { emitEvent: false });
  }

  /**
   * Handles the form submission by validating the input fields and emitting the completed form data.
   * If the image URL is not provided, it displays an error message.
   * If the form is invalid, it marks all fields as touched and displays an error message.
   * Calculates the age based on the provided birthday and emits the completed form data.
   * Displays a success message after the form is successfully submitted.
   */
  onSubmit() {
    if (!this.imageUrl || this.imageUrl.trim() === '') {
      M.toast({
        html: 'Debe subir una foto de perfil',
        classes: 'red lighten-1'
      });
      return;
    }

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      M.toast({
        html: 'Complete todos los campos requeridos correctamente',
        classes: 'orange lighten-1'
      });
      return;
    }

    const name = this.form.get('name')?.value;
    const hobby = this.form.get('hobby')?.value;
    const birthday = new Date(this.form.get('birthday')?.value);
    const today = new Date();
    const age = today.getFullYear() - birthday.getFullYear();

    this.formCompleted.emit({ name, hobby, age });

    M.toast({
      html: 'Perfil completado con éxito',
      classes: 'green lighten-1'
    });
  }
}
