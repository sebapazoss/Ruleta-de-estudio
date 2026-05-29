# 🎡 Ruleta de Estudio

¡Bienvenido a **Ruleta de Estudio**! Una aplicación web interactiva diseñada para hacer que las sesiones de estudio grupal sean dinámicas, competitivas y muy divertidas. Gira la ruleta, selecciona un participante al azar, responde preguntas y compite por el primer lugar en la tabla de clasificación.

---

## 🚀 Características Principales

*   **🎡 Ruleta Animada Interactiva**: Una ruleta visualmente atractiva con efectos de sonido de giro, desaceleración e indicador visual de selección.
*   **👥 Gestión de Participantes**: Agrega, edita y elimina estudiantes de forma rápida. Asigna colores personalizados a cada uno para identificarlos fácilmente en la ruleta.
*   **📚 Importación de Preguntas**: Carga cuestionarios interactivos a través de archivos en formato JSON para personalizar tus temas de estudio.
*   **🏆 Tabla de Posiciones en Tiempo Real**: Lleva el control de los puntajes, respuestas correctas e incorrectas, y mira quién lidera la sesión de estudio.
*   **⚙️ Configuración Personalizada**: Ajusta el tiempo límite por pregunta, activa o desactiva la música de fondo y los efectos de sonido (SFX).
*   **🎨 Diseño Premium y Adaptable**: Interfaz moderna y responsiva construida con React y Tailwind CSS, optimizada para todo tipo de pantallas.

---

## 🛠️ Tecnologías Utilizadas

*   **Núcleo**: [React](https://react.dev/) + [Vite](https://vite.dev/) (Rápido y eficiente)
*   **Estilos**: [Tailwind CSS](https://tailwindcss.com/)
*   **Gestión de Estados**: Hooks de React (`useState`, `useEffect`, `useRef`)
*   **Audio**: Web Audio API / Reproducción interactiva de SFX y música
*   **Iconos**: Elementos SVG responsivos y limpios

---

## 💻 Instalación y Desarrollo Local

Sigue estos sencillos pasos para levantar el proyecto en tu entorno local:

### 1. Clonar el Repositorio
```bash
git clone https://github.com/sebapazoss/Ruleta-de-estudio.git
cd Ruleta-de-estudio
```

### 2. Instalar Dependencias
Este proyecto utiliza `pnpm` (aunque también puedes usar `npm` o `yarn`):
```bash
pnpm install
# o con npm:
npm install
```

### 3. Iniciar el Servidor de Desarrollo
```bash
pnpm dev
# o con npm:
npm run dev
```

Abre tu navegador en [http://localhost:5173](http://localhost:5173) para ver la aplicación ejecutándose.

---

## 📂 Estructura del Cuestionario JSON

Para importar tus propias preguntas, crea un archivo JSON con la siguiente estructura:

```json
[
  {
    "id": 1,
    "materia": "Historia",
    "pregunta": "¿En qué año se descubrió América?",
    "opciones": [
      "1492",
      "1500",
      "1488",
      "1512"
    ],
    "correcta": 0,
    "explicacion": "Cristóbal Colón llegó a América el 12 de octubre de 1492."
  }
]
```

---

## 🤝 Contribuciones

Las contribuciones, sugerencias y reportes de errores son bienvenidos. Siéntete libre de abrir un *Issue* o enviar un *Pull Request* para seguir mejorando esta herramienta educativa.

---

Desarrollado con ❤️ para transformar la forma en que estudiamos en grupo.
