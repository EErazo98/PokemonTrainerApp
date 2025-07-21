import { Component, Input, OnInit, signal, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { CdkVirtualScrollViewport, ScrollingModule } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-stats-summary',
  standalone: true,
  imports: [CommonModule, HttpClientModule, ScrollingModule],
  templateUrl: './stats-summary.component.html',
  styleUrls: ['./stats-summary.component.scss']
})
export class StatsSummaryComponent implements OnInit {
  @Input() selectedIds: number[] = [];
  @Output() backToPokemon = new EventEmitter<void>();
  pokemons = signal<any[]>([]);

  /**
   * An object containing the maximum stats for different attributes of a pokémon.
   * @type {Record<string, number>}
   */
  readonly MAX_STATS: Record<string, number> = {
    hp: 255,
    attack: 190,
    defense: 230,
    'special-attack': 194,
    'special-defense': 230,
    speed: 180
  };

  constructor(private http: HttpClient) { }

  /**
   * Initializes the component and fetches data for selected IDs from an API endpoint.
   * If there are selected IDs, it makes multiple HTTP GET requests to retrieve data
   * for each ID and populates the 'pokemons' map with the results.
   * @returns None
   */
  ngOnInit(): void {
    if (this.selectedIds?.length) {
      Promise.all(
        this.selectedIds.map(id =>
          this.http.get(`https://pokeapi.co/api/v2/pokemon/${id}`).toPromise()
        )
      ).then(results => this.pokemons.set(results));
    }
  }

  /**
   * Retrieves the types of a Pokemon from the provided object.
   * @param {any} pokemon - The Pokemon object containing type information.
   * @returns A string representing the types of the Pokemon separated by '/'.
   */
  getTypes(pokemon: any): string {
    return pokemon.types.map((t: any) => t.type.name).join('/');
  }

  /**
   * Returns the translated label for a given stat name.
   * @param {string} name - The name of the stat to get the label for.
   * @returns {string} The translated label for the stat.
   */
  getStatLabel(name: string): string {
    switch (name) {
      case 'hp': return 'HP';
      case 'attack': return 'Ataque';
      case 'defense': return 'Defensa';
      case 'special-attack': return 'Ataque Especial';
      case 'special-defense': return 'Defensa Especial';
      case 'speed': return 'Velocidad';
      default: return name;
    }
  }

  /**
   * Calculates the percentage value of a given stat based on its maximum value.
   * @param {string} statName - The name of the stat for which the percentage is calculated.
   * @param {number} value - The current value of the stat.
   * @returns The percentage value of the stat relative to its maximum value.
   */
  getStatPercentage(statName: string, value: number): number {
    const max = this.MAX_STATS[statName] || 100;
    return Math.min((value / max) * 100, 100);
  }

  /**
   * Returns the color associated with a specific stat for a bar graph.
   * @param {string} statName - The name of the stat to determine the color for.
   * @returns {string} The color associated with the statName.
   */
  getBarColor(statName: string): string {
    if (statName === 'hp') return 'green';
    if (statName === 'attack' || statName === 'special-attack') return 'yellow';
    if (statName === 'defense' || statName === 'special-defense') return 'blue';
    if (statName === 'speed') return 'purple';
    return '';
  }

  /**
   * Triggered when an edit action is performed. Emits an event to navigate back to the Pokemon page.
   * @returns None
   */
  onEdit() {
    this.backToPokemon.emit(); 
  }

  /**
   * Returns the maximum value for a given stat name.
   * @param {string} statName - The name of the stat (e.g., 'hp', 'attack', 'defense', 'special-attack', 'special-defense', 'speed').
   * @returns {number} The maximum value for the specified stat.
   */
  getMaxValue(statName: string): number {
    switch (statName.toLowerCase()) {
      case 'hp': return 255;
      case 'attack': return 190;
      case 'defense': return 230;
      case 'special-attack': return 194;
      case 'special-defense': return 230;
      case 'speed': return 180;
      default: return 255;
    }
  }
}
