import { DATA, NONE, SELF, UNSAFE_EVAL, UNSAFE_INLINE } from "csp-header";

/**
 * {@link https://github.com/frux/csp/tree/master/packages/csp-header | csp-headers}
 * preset.
 *
 * @remarks Includes basic rules and Google Analytics/Google Tag Manager exceptions.
 */
const cspHeaderPreset = {
  "base-uri": [SELF],
  "connect-src": [SELF, "https://www.google-analytics.com"],
  "default-src": [SELF],
  "img-src": [SELF, DATA, "https://www.google-analytics.com"],
  "frame-ancestors": [NONE],
  "frame-src": [NONE],
  "manifest-src": [DATA],
  "object-src": [NONE],
  "script-src": [
    SELF,
    "https://www.google-analytics.com",
    "https://www.googletagmanager.com",
    ...(process.env.NODE_ENV === "development"
      ? [UNSAFE_EVAL, UNSAFE_INLINE]
      : []),
  ],
  "style-src": [SELF, UNSAFE_INLINE],
};

export default cspHeaderPreset;
