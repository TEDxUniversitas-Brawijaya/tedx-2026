export const parseISODate = (input: string | null) => {
  if (!input) {
    return null;
  }

  const value = new Date(input);
  return Number.isNaN(value.getTime()) ? null : value;
};
