// MARK: Imports
// -----------------------------------------------------------------------------
// - NPM
import { mount } from 'svelte';
// - Local
import App from './app.svelte';
import './assets/main.scss';

// MARK: Types
// -----------------------------------------------------------------------------
import { type ComponentSettings } from '@moss/comp';
type Context = ComponentSettings | boolean;

// MARK: Setup
// -----------------------------------------------------------------------------
const reducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)',
).matches;

const componentContext: ComponentSettings = {
  textField: {
    noAsterisk: true,
    noSpinner: true,
    variant: 'outlined',
  },
  select: {
    noAsterisk: true,
    variant: 'outlined',
  },
};

// - Mount Options
const target = document.getElementById('app')!;
const context = new Map<string, Context>([
  ['ReducedMotion', reducedMotion],
  ['ComponentSettings', componentContext],
]);

const app = mount(App, { target, context });

export default app;
