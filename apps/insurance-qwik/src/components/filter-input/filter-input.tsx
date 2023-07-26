import {
  component$,
  type PropFunction,
  QwikIntrinsicElements,
  useStylesScoped$,
} from '@builder.io/qwik';

import styles from './filter-input.scss?inline';

type FilterInputProps = {
  onChange$: PropFunction<(term: string) => void>;
} & Pick<QwikIntrinsicElements['input'], 'placeholder'>;

export const FilterInput = component$((props: FilterInputProps) => {
  useStylesScoped$(styles);

  return (
    <input
      class="filter-input"
      type="search"
      placeholder={props.placeholder}
      oninput$={async (event) => {
        const term = (event.target as HTMLInputElement).value;
        await props.onChange$(term);
      }}
    />
  );
});
