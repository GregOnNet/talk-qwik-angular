import { component$, QwikIntrinsicElements, Slot } from '@builder.io/qwik';

export const ButtonSecondary = component$(
  (props: QwikIntrinsicElements['button']) => {
    return (
      <button {...props} class="secondary">
        <Slot />
      </button>
    );
  },
);
