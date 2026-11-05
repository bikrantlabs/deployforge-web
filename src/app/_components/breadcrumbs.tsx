import Link from "next/link";

import { CaretRightIcon } from "@phosphor-icons/react/dist/ssr";

export type Breadcrumb = {
  label: string;
  href?: string;
};

export function Breadcrumbs({ items }: { items: Breadcrumb[] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="mb-6 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground"
    >
      {items.map((item, index) => (
        <span
          key={`${item.label}-${index}`}
          className="inline-flex min-w-0 items-center gap-1.5"
        >
          {index > 0 ? (
            <CaretRightIcon aria-hidden="true" className="size-3 shrink-0" />
          ) : null}
          {item.href ? (
            <Link
              href={item.href}
              className="truncate transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ) : (
            <span aria-current="page" className="truncate text-foreground">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
