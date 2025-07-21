import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-card.component.html',
  styleUrls: ['./profile-card.component.scss']
})
export class ProfileCardComponent {
  @Input() imageUrl: string = '';
  @Input() name: string = '';
  @Input() hobby: string = '';
  @Input() age: number = 0;
  @Input() readOnly: boolean = false;
  @Output() imageChanged = new EventEmitter<string>();

  defaultImage: string = 'assets/avatar.png';

  /**
   * Handles the file input event by reading the selected file and emitting the result.
   * @param {Event} event - The input event triggered by selecting a file.
   * @returns None
   */
  handleFileInput(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        this.imageUrl = result;
        this.imageChanged.emit(result);
      };
      reader.readAsDataURL(file);
    }
  }

  /**
   * Handles the event of uploading an image file.
   * @param {Event} event - The event object triggered by the image upload.
   * @returns {void}
   */
  handleImageUpload(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        this.imageChanged.emit(result);
      };
      reader.readAsDataURL(input.files[0]);
    }
  }
}
