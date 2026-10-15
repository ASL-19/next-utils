import { renderHook } from "@testing-library/react";
import { NextRouter, useRouter } from "next/router.js";
import { expect, test, vi } from "vitest";

import useHrefIsActive from "./useHrefIsActive.js";

vi.mock("next/router.js", () => ({ useRouter: vi.fn() }));

const renderUseHrefIsActive = ({
  activeUrlComparisonQueryKeys = [],
  asPath,
  href,
  query = {},
}: {
  activeUrlComparisonQueryKeys?: Array<string>;
  asPath: string;
  href: Array<string> | string;
  query?: NextRouter["query"];
}) => {
  vi.mocked(useRouter).mockReturnValue({ asPath, query } as NextRouter);

  return renderHook(() =>
    useHrefIsActive({ activeUrlComparisonQueryKeys, href }),
  ).result.current;
};

test("returns true if the pathname matches", () => {
  expect(renderUseHrefIsActive({ asPath: "/about", href: "/about" })).toBe(
    true,
  );
});

test("returns false if the pathname doesn’t match", () => {
  expect(renderUseHrefIsActive({ asPath: "/about", href: "/contact" })).toBe(
    false,
  );
});

test("ignores query string keys not in activeUrlComparisonQueryKeys", () => {
  expect(
    renderUseHrefIsActive({
      asPath: "/about?fbclid=abc",
      href: "/about",
      query: { fbclid: "abc" },
    }),
  ).toBe(true);
});

test("compares query string keys in activeUrlComparisonQueryKeys", () => {
  const options = {
    activeUrlComparisonQueryKeys: ["category"],
    asPath: "/apps?category=games",
    query: { category: "games" },
  };

  expect(
    renderUseHrefIsActive({ ...options, href: "/apps?category=games" }),
  ).toBe(true);
  expect(
    renderUseHrefIsActive({ ...options, href: "/apps?category=tools" }),
  ).toBe(false);
  expect(renderUseHrefIsActive({ ...options, href: "/apps" })).toBe(false);
});

test("returns true if any of an array of hrefs is active", () => {
  expect(
    renderUseHrefIsActive({
      asPath: "/blog/post",
      href: ["/blog", "/blog/post"],
    }),
  ).toBe(true);
  expect(
    renderUseHrefIsActive({ asPath: "/about", href: ["/blog", "/blog/post"] }),
  ).toBe(false);
});

test("compares absolute hrefs by pathname", () => {
  expect(
    renderUseHrefIsActive({
      asPath: "/about",
      href: "https://example.org/about",
    }),
  ).toBe(true);
});
