// Read a text field from multipart FormData: null when missing or when a file was sent.
export const formText = (formData: FormData, key: string) => {
  const value = formData.get(key);

  return value instanceof File ? null : value;
};

// Read a file field from multipart FormData: null when missing or when text was sent.
export const formFile = (formData: FormData, key: string) => {
  const value = formData.get(key);

  return value instanceof File ? value : null;
};

// Narrow a <select> value to one of its known option values: undefined when it is not one of them.
export const parseOption = <T extends string>(options: readonly T[], value: string) =>
  options.find((option) => option === value);
