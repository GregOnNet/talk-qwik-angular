import { component$, Slot, useStylesScoped$ } from '@builder.io/qwik';
import styles from './button.scss';
import { Link, LinkProps } from '@builder.io/qwik-city';

export const LinkPrimary = component$((props: LinkProps) => {
  useStylesScoped$(styles);

  return (
    <Link {...props} class="primary">
      <Slot />
    </Link>
  );
});
