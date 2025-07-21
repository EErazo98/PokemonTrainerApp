# Pokémon Trainer Profile App

¡Bienvenido entrenador! Esta aplicación permite a los usuarios configurar su perfil, seleccionar sus Pokémon favoritos y visualizar un resumen con sus estadísticas.

---

## Tecnologías utilizadas

- Angular Standalone Components (v16+)
- TypeScript
- Signals
- SCSS
- Angular CDK Virtual Scroll
- PokeAPI

---

## Instalación y ejecución

Sigue estos pasos para clonar el repositorio y ejecutar el proyecto localmente:

# 1. Clonar el repositorio
git clone https://github.com/EErazo98/PokemonTrainerApp.git
cd pokemon-trainer-app

# 2. Instalar dependencias
npm install

# 3. Ejecutar la aplicación
ng serve

# 4. Abre tu navegador en
http://localhost:4200/
```

---

## Estructura general del proyecto

```
src/
├── app/
│   ├── features/
│   │   ├── profile/
│   │   ├── selection/
│   │   └── summary/
│   ├── shared/
│   │   ├── loading-spinner/
│   │   ├── profile-card/
│   └── assets/
```

- `features/profile`: Formulario de perfil e imagen.
- `features/selection`: Selección de Pokémon desde la API.
- `features/summary`: Visualización de Pokémon y sus estadísticas.
- `shared/`: Componentes reutilizables como loading spinner, profile card

---

## Funcionalidades

- Carga y validación de datos de usuario.
- Consulta a la PokeAPI para obtener información de los Pokémon seleccionados.
- Cálculo de estadísticas con barras proporcionales a sus valores reales.
- Diseño proporcionado en Figma.

---
