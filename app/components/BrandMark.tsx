"use client";

import { HardHat, ShieldCheck } from "lucide-react";
import { useState } from "react";

export function BrandMark({
  className = "",
  size = 44,
  login = false
}: {
  className?: string;
  size?: number;
  login?: boolean;
}) {
  const [failed, setFailed] = useState(false);

  if (!failed) {
    return (
      <img
        alt="Logo empresa"
        className={`brand-logo ${className}`.trim()}
        height={size}
        onError={() => setFailed(true)}
        src="/branding/logo"
        width={size}
      />
    );
  }

  return login ? <ShieldCheck className={className} size={size} /> : <HardHat className={className} size={size} />;
}
