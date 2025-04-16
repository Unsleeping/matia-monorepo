export const resolveAfter = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));
