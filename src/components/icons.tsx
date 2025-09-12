import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M3 10v4" />
      <path d="M9 6v12" />
      <path d="M3 12h6" />
      <path d="M15 12h5" />
      <path d="M15 6v12" />
      <path d="M20 10v4" />
    </svg>
  );
}
