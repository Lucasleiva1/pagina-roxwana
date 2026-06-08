import Link from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";

type RoxButtonProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string;
  children: ReactNode;
  variant?: "bone" | "ghost" | "red";
};

export function RoxButton({ href, children, variant = "ghost", className = "", ...props }: RoxButtonProps) {
  const variants = {
    bone: "border-bone bg-bone text-charcoal hover:text-bone",
    ghost: "border-bone/45 bg-transparent text-bone hover:border-roxred",
    red: "border-roxred bg-roxred text-bone hover:border-bone"
  };

  const isExternal = href.startsWith("http");
  const classes = `group relative inline-flex min-h-11 items-center justify-center overflow-hidden border px-5 py-3 text-xs font-bold uppercase tracking-rox transition duration-300 ${variants[variant]} ${className}`;
  const content = (
    <>
      <span className="absolute inset-y-0 left-0 w-1 bg-roxred transition-all duration-300 group-hover:w-full" />
      <span className="relative z-10 flex items-center gap-3">
        <span className="text-roxred transition group-hover:text-bone">/</span>
        {children}
      </span>
    </>
  );

  if (isExternal) {
    return (
      <a href={href} className={classes} {...props}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} {...props}>
      {content}
    </Link>
  );
}
