/**
 * Get Next.js headers array from object containing header values by name.
 * @public
 */
const getNextJsHeaders = (
  headers: Record<string, string>,
): Array<{ key: string; value: string }> =>
  Object.keys(headers).map((headerName) => ({
    key: headerName,
    value: headers[headerName],
  }));

export default getNextJsHeaders;
