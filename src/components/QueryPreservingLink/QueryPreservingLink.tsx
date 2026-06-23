"use client";

import Link from "next/link";
import { type AnchorHTMLAttributes, type ReactNode } from "react";
import { buildHref } from "@/lib/queryParams";
import { useQueryString } from "../QueryParamsProvider/QueryParamsProvider";

type Props = {
  href: string;
  external?: boolean;
  children: ReactNode;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">;

/** Link that preserves the current query string (internal: full; external: tracked only). */
export function QueryPreservingLink({ href, external, children, ...rest }: Props) {
  const search = useQueryString();
  const finalHref = buildHref(href, search, { external });

  if (external) {
    return (
      <a href={finalHref} rel="noopener noreferrer" {...rest}>
        {children}
      </a>
    );
  }

  return (
    <Link href={finalHref} {...rest}>
      {children}
    </Link>
  );
}
