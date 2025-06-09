export const useFormatDate = (date?: string | Date | null) =>
  date ? new Date(date).toLocaleDateString() : "";
