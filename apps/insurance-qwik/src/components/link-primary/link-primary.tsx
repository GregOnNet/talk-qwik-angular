import { component$, Slot } from '@builder.io/qwik';
import { Link, LinkProps } from '@builder.io/qwik-city';

export const LinkPrimary = component$((props: LinkProps) => {
  return (
    <Link {...props} class="primary">
      <Slot />
    </Link>
  );
});
