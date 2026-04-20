

## CRM Móvil Equilibria — Implementación

Portar el prototipo HTML al proyecto React/Vite/TS/Tailwind, mobile-first, manteniendo el diseño 1:1.

### Pantalla única (`src/pages/Index.tsx`)
- **Header glass sticky**: "Pipeline Total $XXX,XXX" + avatar "EQ" + 3 chips de filtro (🔥 Calientes, ⚡ Para hoy, ✍️ Por firmar).
- **Kanban horizontal** con `scroll-snap-x`, 11 etapas en orden:
  1. Mapeados · 2. Invitación por enviar · 3. Invitación enviada · 4. Demo agendado · 5. Elaborar propuesta · 6. Propuesta enviada · 7. Negociación · 8. Aprobado · 9. Contrato firmado · 10. Aliados · 11. Complete.
  Cada columna: ícono, label, categoría, contador, ancho ~85vw para mostrar "peek" de la siguiente.
- **Tarjetas de cliente**: nombre, contacto, badge temperatura (🔥 caliente / ⭐ tibio / ❄️ frío), valor USD, última acción + fecha, botones rápidos (Llamar / Correo). Acento lateral por etapa.
- **FAB verde** flotante (+) abajo-derecha.
- **Bottom Sheet** al tocar tarjeta: detalles + 4 acciones (Llamar, Email, Nota, Recordatorio) + selector de etapa que reubica la tarjeta en vivo.

### Datos mock (estado local con `useState`)
5 clientes embebidos: TechCorp LATAM, Inversiones Globales, Grupo Retail Sur, Fintech Solutions, EcoFoods Peru — distribuidos en distintas etapas.

### Sistema de diseño
- Tema **dark slate-900** con paneles glassmorphism (`backdrop-blur`).
- Tokens HSL en `src/index.css` (background, foreground, accent verde Equilibria, gradientes por etapa).
- `tailwind.config.ts`: extender con keyframe `slide-up` y gradientes de etapa.
- Fuente **Inter** vía Google Fonts en `index.html`.
- Íconos como SVG inline (Phone, Mail, Plus, Clock, FileText) — sin nuevas dependencias.
- Mobile-first: layout pensado para 375–414px; en pantallas grandes el contenido se centra con max-width.

### Archivos a tocar
- `src/pages/Index.tsx` (reescribir)
- `src/index.css` (tokens HSL del tema dark + utilidades glass)
- `tailwind.config.ts` (animación slide-up, gradientes)
- `index.html` (título, meta, fuente Inter)

### Estimación
~**2–4 créditos** para implementación completa en una pasada.

