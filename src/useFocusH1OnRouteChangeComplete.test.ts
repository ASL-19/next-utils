import { renderHook } from "@testing-library/react";
import { NextRouter, useRouter } from "next/router.js";
import { afterEach, beforeEach, expect, test, vi } from "vitest";

import useFocusH1OnRouteChangeComplete from "./useFocusH1OnRouteChangeComplete.js";

vi.mock("next/router.js", () => ({ useRouter: vi.fn() }));

type RouteChangeHandler = (url: string, options: { shallow: boolean }) => void;

let handlers: Set<RouteChangeHandler>;

beforeEach(() => {
  handlers = new Set();
  const events = {
    off: (_type: string, handler: RouteChangeHandler) =>
      handlers.delete(handler),
    on: (_type: string, handler: RouteChangeHandler) => handlers.add(handler),
  };
  vi.mocked(useRouter).mockReturnValue({
    asPath: "/",
    events,
  } as unknown as NextRouter);
  vi.spyOn(console, "warn").mockImplementation(() => {});
});

afterEach(() => {
  document.body.innerHTML = "";
  vi.restoreAllMocks();
});

const completeRouteChange = (url: string, shallow = false) => {
  for (const handler of handlers) {
    handler(url, { shallow });
  }
};

test("focuses the h1 after a route change", () => {
  document.body.innerHTML = "<a href='/'>Link</a><h1>Heading</h1>";

  renderHook(() => useFocusH1OnRouteChangeComplete());

  completeRouteChange("/about");

  expect(document.activeElement?.tagName).toBe("H1");
});

test("ignores shallow route changes", () => {
  document.body.innerHTML = "<h1>Heading</h1>";

  renderHook(() => useFocusH1OnRouteChangeComplete());

  completeRouteChange("/?page=2", true);

  expect(document.activeElement).toBe(document.body);
});

test("focuses the first element matching selector", () => {
  document.body.innerHTML =
    "<h1>Site name</h1><h1 id='main-heading'>Heading</h1>";

  renderHook(() =>
    useFocusH1OnRouteChangeComplete({ selector: "h1#main-heading" }),
  );

  completeRouteChange("/about");

  expect(document.activeElement?.id).toBe("main-heading");
});

test("warns if no element matches", () => {
  renderHook(() => useFocusH1OnRouteChangeComplete());

  completeRouteChange("/about");

  expect(console.warn).toHaveBeenCalledOnce();
});

test("skips focus if shouldSkipFocus returns true", () => {
  document.body.innerHTML = "<h1>Heading</h1>";

  const shouldSkipFocus = vi.fn(
    ({ url }: { previousUrl: string; url: string }) => url.includes("ios"),
  );

  renderHook(() => useFocusH1OnRouteChangeComplete({ shouldSkipFocus }));

  completeRouteChange("/apps?platform=android", true);
  completeRouteChange("/apps?platform=ios");

  expect(shouldSkipFocus).toHaveBeenCalledExactlyOnceWith({
    previousUrl: "/apps?platform=android",
    url: "/apps?platform=ios",
  });
  expect(document.activeElement).toBe(document.body);
});
