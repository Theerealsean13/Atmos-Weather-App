# AtmosReact

![React](https://img.shields.io/badge/react-%2320232a.svg?style=flat&logo=react&logoColor=%2361DAFB)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=flat&logo=javascript&logoColor=%23F7DF1E)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=flat&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=flat&logo=tailwind-css&logoColor=white)

A high-performance, interactive weather application built with React. This project demonstrates asynchronous RESTful API data fetching, real-time location querying, complex component state management, and modern glassmorphic UI/UX design principles.

## Visual Preview
Images of AtmosReact in a UI Liquid Glass aesthetic design
:New York (Dynamic Regional Updates)
<img width="1919" height="1012" alt="Screenshot 2026-05-25 052235" src="https://github.com/user-attachments/assets/d86e056d-307b-4f67-811a-cba26c1ff700" />
:Location Search
<img width="1919" height="1015" alt="Screenshot 2026-05-25 052313" src="https://github.com/user-attachments/assets/18850c9b-a922-4622-9a64-6cfec4af9dc2" />
:Johannesburg
<img width="1919" height="1016" alt="Screenshot 2026-05-25 052331" src="https://github.com/user-attachments/assets/400d26bc-e11b-4731-9ae3-683bb022da91" />
## Tech Stack Overview
* **Frontend Framework:** React 18 (via Vite)
* **Language:** JavaScript (ES6+)
* **Styling:** Tailwind CSS & CSS3 (Glassmorphism, CSS Grid, Custom UI Variables)
* **API Integration:** RESTful Meteorological Data Services

## Key Features
* **Asynchronous Data Integration:** Seamlessly aggregates concurrent API payloads to update real-time visibility, wind speed, humidity, atmospheric pressure, and regional astronomical cycles.
* **Predictive Global Search:** Features a robust location autocomplete dropdown component, enabling users to fetch environmental metrics for cities worldwide instantaneously.
* **Premium Glassmorphism UI:** Built with a sophisticated "Liquid Glass" design framework utilizing high-end backdrop filters, translucent borders, and soft glowing drop shadows.
* **Dynamic Content Scaling:** Leverages custom CSS Grid and Flexbox structures to keep the multi-panel weather grid perfectly aligned, scannable, and scalable across various viewport sizes.

## Technical Walkthrough: API Integration & State Logic
Engineered around fluid client-side interactions, AtmosReact tracks and coordinates multiple state layers to maintain a zero-latency interface feel:
1. `searchQuery`: Handles the real-time user keystrokes and controls the debounce pattern for city suggestions.
2. `weatherData`: Stores the main weather payload containing exact current metrics (temperatures, wind configurations, pressure indices).
3. `astronomyData`: Independently maps coordinates to derive astronomical conditions like current moon phases, sunset, and solar arc progress.

By isolating these metrics into modular state arrays, the application safely ensures that invalid lookups or network drops are intercepted gracefully by error-catching hooks without interrupting the rendering of the core container interface.

## How to Run Locally

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/Theerealsean13/AtmosReact.git](https://github.com/Theerealsean13/AtmosReact.git)
