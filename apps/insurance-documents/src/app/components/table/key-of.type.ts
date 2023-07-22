/** Extracts all keys of type string from the given type **/
export type KeyOf<T> = Extract<keyof T, string>;
