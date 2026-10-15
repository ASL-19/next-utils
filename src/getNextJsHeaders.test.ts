import { expect, test } from "vitest";

import getNextJsHeaders from "./getNextJsHeaders.js";

test("converts an object of headers to a Next.js headers array", () => {
  expect(
    getNextJsHeaders({
      "Referrer-Policy": "no-referrer",
      "X-Content-Type-Options": "nosniff",
    }),
  ).toEqual([
    { key: "Referrer-Policy", value: "no-referrer" },
    { key: "X-Content-Type-Options", value: "nosniff" },
  ]);
});
