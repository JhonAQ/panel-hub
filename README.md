# ⚡ PanelHub — Estación Central de Enlaces Multi-Dispositivo

> **PanelHub** es tu lanzadera de recursos, repositorios y accesos rápidos en la web. Diseñado para solucionar el problema de tener enlaces dispersos entre chats de WhatsApp, pestañas perdidas o notas locales, permitiéndote entrar desde cualquier PC, laptop o dispositivo móvil y tener todo a un clic de distancia.

---

## 🎨 Estética & Diseño
- **Estilo**: Brutalismo Moderno + Dark Glassmorphism.
- **Paleta**: Fondo carbón profundo (`#08090d`), tarjetas de cristal esmerilado con desenfoque de fondo (`backdrop-blur-xl`), bordes nítidos y acentos neón de alto impacto (Cian Neón, Verde Esmeralda, Ámbar, Violeta y Rosa).
- **Tarjetas Grandes (Launchpad)**: Botones interactivos con íconos vectoriales oficiales (GitHub, Google Drive, Figma, Notion, Vercel, YouTube, bases de datos y herramientas de desarrollo).

---

## 🚀 Características Clave

1. **Acceso Multi-Dispositivo y Persistencia Dual**:
   - Guarda automáticamente tus enlaces y carpetas en el servidor (`/api/hub`) respaldado en `data/hub-data.json`.
   - Mantiene una caché en tiempo real en `localStorage` para carga instantánea en cualquier red o dispositivo.
   - Si mañana te sientas en otra computadora o tu teléfono, simplemente abres la URL y todos tus links están sincronizados.

2. **Detección Inteligente de URLs**:
   - Al pegar un link de GitHub, Google Drive, Figma, Notion, Vercel, Supabase o YouTube, PanelHub **auto-detecta** el ícono y la paleta de colores brutalista adecuada, e incluso sugiere títulos automáticamente.

3. **Organización por Carpetas y Grupos**:
   - Categoriza tus recursos por áreas (ej. `Repositorios GitHub`, `Drive & Cloud Docs`, `Servidores & Cloud`, `Diseño & UI`, etc.).
   - Navegación por pestañas de carpetas con contador dinámico de links por categoría.
   - Crea, edita o elimina carpetas con asignación de color personalizado.

4. **Favoritos y Métricas de Uso**:
   - Fija enlaces prioritarios en la sección de **Favoritos**.
   - Contador de clics para identificar rápidamente tus accesos más utilizados.

5. **Búsqueda Instantánea & Atajos**:
   - Búsqueda en vivo por título, URL, descripción, carpetas y etiquetas `#tags`.
   - Atajo de teclado: pulsa `Ctrl + K` (o `Cmd + K` en Mac) o `/` para buscar al instante.

6. **Vistas Adaptables**:
   - **Vista Launchpad (Grid)**: Botones grandes con íconos, descripciones y micro-acciones (Copiar enlace, fijar, editar, eliminar).
   - **Vista de Lista Compacta**: Para escanear rápidamente decenas de enlaces.

7. **Copia de Seguridad e Importación JSON**:
   - Exporta toda tu base de datos en un archivo `.json` con un solo clic.
   - Importa o restaura tu colección en cualquier momento.

---

## 🛠️ Tecnologías

- **Framework**: [Next.js](https://nextjs.org/) (App Router, Turbopack)
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)
- **Estilos**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Íconos**: [Lucide React](https://lucide.dev/) + SVGs vectoriales optimizados
- **Backend**: Next.js API Routes (`/api/hub`) con almacenamiento persistente en JSON

---

## 🏁 Inicio Rápido

### 1. Iniciar en Modo Desarrollo
```bash
npm run dev
```
Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

Para acceder desde otros dispositivos en tu misma red WiFi local:
```bash
# Inicia escuchando en todas las interfaces:
npm run dev -- -H 0.0.0.0
# Luego entra desde tu móvil o laptop a http://<IP-DE-TU-PC>:3000
```

### 2. Compilar para Producción
```bash
npm run build
npm run start
```

### 3. Despliegue en la Nube
Puedes desplegar este proyecto en cualquier servidor o plataforma:
- **Vercel / Netlify**: Conecta tu repositorio de GitHub y despliega en 1 clic.
- **Docker / VPS (Coolify, Railway, DigitalOcean)**: Al tener soporte de persistencia local en `data/hub-data.json`, funciona de inmediato con volúmenes persistentes.
