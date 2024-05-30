import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { cn } from "~/lib/utils";

export function LinkToExternal({
  className,
  children,
  icon = true,
  target = "_blank",
  ...props
}: React.ComponentProps<typeof Link> & { icon?: boolean }) {
  return (
    <Link
      className={cn(
        className,
        "inline-flex flex-row items-center gap-2 text-[#482919] underline hover:text-opacity-80",
      )}
      target={target}
      {...props}
    >
      <span>{children}</span>
      {icon && <ExternalLink className="size-5" />}
    </Link>
  );
}
