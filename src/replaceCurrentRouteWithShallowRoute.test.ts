import { NextRouter } from "next/router.js";
import { expect, test, vi } from "vitest";

import replaceCurrentRouteWithShallowRoute from "./replaceCurrentRouteWithShallowRoute.js";

test("replaces the current route with a shallow route", async () => {
  const replace = vi.fn().mockResolvedValue(true);
  const router = { asPath: "/apps?category=games", replace };

  await replaceCurrentRouteWithShallowRoute({
    router: router as unknown as NextRouter,
  });

  expect(replace).toHaveBeenCalledExactlyOnceWith(
    "/apps?category=games",
    undefined,
    { scroll: false, shallow: true },
  );
});
