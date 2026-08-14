export const buildQueryString = (params: Record<string, unknown>) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return;
    }

    if (value === 'all') {
      return;
    }

    query.set(key, String(value));
  });

  return query.toString();
};
