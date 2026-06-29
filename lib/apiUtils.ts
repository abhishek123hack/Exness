export function pageParams(url: string) {
  const searchParams = new URL(url).searchParams;
  const page = Math.max(Number(searchParams.get("page") || 1), 1);
  const limit = Math.min(Math.max(Number(searchParams.get("limit") || 20), 1), 100);
  const search = String(searchParams.get("search") || "").trim();
  const status = String(searchParams.get("status") || "").trim();
  const skip = (page - 1) * limit;
  return { page, limit, skip, search, status };
}

export function paged<T>(items: T[], page: number, limit: number) {
  return {
    page,
    limit,
    total: items.length,
    pages: Math.max(Math.ceil(items.length / limit), 1),
    items: items.slice((page - 1) * limit, page * limit)
  };
}
