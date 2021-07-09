import Link, { LinkProps } from "next/link";
import React, { FC } from "react";

/**
 * Same as {@link https://nextjs.org/docs/api-reference/next/link|next/link},
 * but with passHref prop pre-set.
 *
 * @remarks
 * The passHref prop needs to be set for any Next.js Link wrapping an element
 * with the Emotion css prop (because it turns the styled element into custom
 * component). This is an unintuitive restriction that’s likely to cause
 * unexpected mistakes/regressions, so it’s safest to always use AslLink over
 * Link.
 */
const AslLink: FC<LinkProps> = (props) => <Link passHref {...props} />;

export default AslLink;
