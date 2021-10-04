/**
 * Default global header values by name.
 *
 * @remarks
 * Should be used with {@link getNextJsHeaders}.
 */
const defaultGlobalHeaders = {
  "Cache-Control": "public, max-age=0, s-maxage=315360000",
  "Cross-Origin-Embedder-Policy": "require-corp",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Cross-Origin-Resource-Policy": "same-origin",
  "Feature-Policy":
    "accelerometer 'none'; ambient-light-sensor 'none'; battery 'none'; camera 'none'; display-capture 'none'; document-domain 'none'; gamepad 'none'; geolocation 'none'; gyroscope 'none'; magnetometer 'none'; microphone 'none'; midi 'none'; payment 'none'; screen-wake-lock 'none'; speaker-selection 'none'; usb 'none'; xr-spatial-tracking 'none'",
  "Referrer-Policy": "same-origin",
  "Strict-Transport-Security": "max-age=15724800; includeSubDomains",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
};

export default defaultGlobalHeaders;
