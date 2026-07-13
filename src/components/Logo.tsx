type LogoProps = {
  /** color of the wordmark text (mascot itself is unchanged) */
  variant?: "brand" | "white";
  className?: string;
  /** show the "klix" wordmark next to the mascot (default: false) */
  showWordmark?: boolean;
  /** height of the mascot in px (default 44) */
  size?: number;
};

/**
 * Klix logo — the eagle/kite mascot on its own (transparent PNG, no backdrop).
 * Lives at /logo-klix.png (public/). Best on dark/red backgrounds; on light
 * backgrounds the mostly-white mascot has low contrast.
 */
export function Logo({
  variant = "brand",
  className = "",
  showWordmark = false,
  size = 44,
}: LogoProps) {
  const onWhite = variant === "white";
  return (
    <span className={`inline-flex items-center gap-3 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo-klix.png?v=5"
        alt="Klix"
        className="w-auto object-contain drop-shadow-md"
        style={{ height: size }}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />
      {showWordmark && (
        <span
          className={`text-xl font-extrabold tracking-tight ${
            onWhite ? "text-white" : "text-foreground"
          }`}
        >
          klix
        </span>
      )}
    </span>
  );
}
