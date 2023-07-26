import { component$, Slot, useStylesScoped$ } from '@builder.io/qwik';

import styles from './toolbar.scss';

export const Toolbar = component$(() => {
  useStylesScoped$(styles);

  return (
    <section class="toolbar">
      <Slot />
    </section>
  );
});
