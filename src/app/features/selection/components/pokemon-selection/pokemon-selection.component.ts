import {
  Component,
  signal,
  computed,
  OnInit,
  AfterViewInit,
  Output,
  EventEmitter
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import Swiper from 'swiper';

@Component({
  selector: 'app-pokemon-selection',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule],
  templateUrl: './pokemon-selection.component.html',
  styleUrls: ['./pokemon-selection.component.scss']
})
export class PokemonSelectionComponent implements OnInit, AfterViewInit {
  @Output() selectionCompleted = new EventEmitter<number[]>();

  pokemons = signal<{ name: string; image: string; number: number }[]>([]);
  selectedPokemons = signal<number[]>([]);
  searchTerm: string = '';
  loading = signal<boolean>(true);
  swiper: Swiper | null = null;
  errorMessage = signal<string>('');
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchPokemon();
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.initSwiper();
    }, 500);
  }

  trackByNumber(index: number, pokemon: { number: number }) {
    return pokemon.number;
  }
  
  /**
   * Fetches a list of Pokemon data from an external API and updates the component's state accordingly.
   * It sets the loading state to true before making the API call and sets it back to false after the call is completed.
   * It also maps the response data to a new format with additional properties like number and image.
   * Finally, it updates the component's state with the formatted data and re-initializes the Swiper component after a delay.
   * @returns None
   */
  fetchPokemon() {
    this.loading.set(true);
    this.http.get<any>('https://pokeapi.co/api/v2/pokemon?limit=151').subscribe((response) => {
      const results = response.results.map((p: any, index: number) => ({
        name: p.name,
        number: index + 1,
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`
      }));
      this.pokemons.set(results);
      this.loading.set(false);
      setTimeout(() => this.reInitSwiper(), 300);
    });
  }

  /**
   * Returns a list of pokemons filtered based on the search term.
   * @returns {Array} - An array of pokemons that match the search term.
   */
  filteredPokemons() {
    const term = this.searchTerm.toLowerCase();
    return this.pokemons().filter((p) => p.name.includes(term));
  }

  /**
   * Toggles the selection of a Pokemon based on its number.
   * If the Pokemon is already selected, it will be deselected.
   * If the Pokemon is not selected and there are less than 3 selected Pokemons,
   * it will be added to the selected Pokemons list.
   * @param {number} pokemonNumber - The number of the Pokemon to toggle selection for.
   * @returns None
   */
  toggleSelection(pokemonNumber: number) {
    const current = this.selectedPokemons();
    if (current.includes(pokemonNumber)) {
      this.selectedPokemons.set(current.filter(id => id !== pokemonNumber));
    } else if (current.length < 3) {
      this.selectedPokemons.set([...current, pokemonNumber]);
    }
  }

  /**
   * Saves the selected Pokémon when the user completes the selection process.
   * If the number of selected Pokémon is not exactly 3, an error message is displayed.
   * If 3 Pokémon are selected, the error message is cleared and the selected Pokémon are emitted.
   * @returns None
   */
  saveSelection() {
    const selected = this.selectedPokemons();

    if (selected.length !== 3) {
      this.errorMessage.set('Debes seleccionar exactamente 3 Pokémon.');
      return;
    }

    this.errorMessage.set('');
    this.selectionCompleted.emit(selected);
  }

  /**
   * Returns the name of a Pokemon object based on the given index.
   * @param {number} index - The index of the Pokemon object.
   * @param {Object} pokemon - The Pokemon object containing a 'name' property.
   * @returns {string} The name of the Pokemon object.
   */
  trackByName(index: number, pokemon: { name: string }) {
    return pokemon.name;
  }

  private initSwiper() {
    if (typeof Swiper !== 'undefined') {
      this.swiper = new Swiper('.pokemon-swiper', {
        direction: 'vertical',
        slidesPerView: 3,
        grid: {
          rows: 3,
          fill: 'row'
        },
        spaceBetween: 20,
        mousewheel: true
      });
    }
  }

  private reInitSwiper() {
    if (this.swiper) {
      this.swiper.update();
    }
  }
}
