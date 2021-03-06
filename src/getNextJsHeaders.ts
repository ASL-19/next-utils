import { Header } from "next/dist/lib/load-custom-routes";

type NextJsHeadersArray = Header["headers"];

/**
 * Get Next.js headers array from object containing header values by name.
 */
const getNextJsHeaders = (headers: {
  [headerName: string]: string;
}): NextJsHeadersArray =>
  Object.keys(headers).map((headerName) => ({
    key: headerName,
    value: headers[headerName],
  }));

export default getNextJsHeaders;
