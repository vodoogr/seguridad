# UI refactor incremental

## Auditoria rapida

- Layout actual: `app/components/AppShell.tsx` concentra sidebar y workspace. Funciona, pero mezcla estructura, navegacion y estilo.
- Navegacion: simple y operativa; necesita estados activos mas claros, iconografia consistente y mejor comportamiento responsive.
- Cards/tablas: estilos globales compartidos en `app/globals.css`; conviene moverlos a componentes reutilizables.
- Colores: ya existe base azul, pero faltan tokens estables para superficies, estados, bordes, foco y sombras.
- Tipografia/spacing: correcta, pero no hay escala de layout SaaS consistente.
- Estados: faltan componentes reutilizables para vacio, carga y estados de datos.
- Animacion: no existe capa aislada; debe mantenerse minima con `components/motion`.

## Componentes creados

- `components/ui/button.tsx`
- `components/ui/card.tsx`
- `components/ui/badge.tsx`
- `components/ui/skeleton.tsx`
- `components/layout/AppShellV2.tsx`
- `components/layout/Sidebar.tsx`
- `components/layout/Header.tsx`
- `components/layout/PageContainer.tsx`
- `components/cards/KpiCard.tsx`
- `components/cards/StatusCard.tsx`
- `components/data-display/DataTableShell.tsx`
- `components/data-display/StatusBadge.tsx`
- `components/data-display/EmptyState.tsx`
- `components/data-display/LoadingState.tsx`
- `components/motion/FadeIn.tsx`
- `design-system/tokens.ts`
- `design-system/globals.css`

## Integracion recomendada

1. Validar visualmente una pantalla paralela `V2`, por ejemplo `DashboardV2`, sin tocar `app/page.tsx`.
2. Usar `AppShellV2`, `Header`, `PageContainer`, `KpiCard` y `DataTableShell` con los datos actuales.
3. Comparar comportamiento con la pantalla actual.
4. Migrar una pantalla cada vez.
5. Eliminar componentes antiguos solo cuando todas las pantallas estén validadas.

## Riesgos

- Requiere instalar dependencias nuevas: Tailwind, shadcn base, Framer Motion.
- Tailwind base puede afectar estilos globales existentes; por eso no se han migrado pantallas todavía.
- La rama debe validarse en deploy preview antes de mezclar a `main`.
