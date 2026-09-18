interface IconProps {
  size?: number;
  className?: string;
}

const base = (size: number, className?: string) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  className,
});

export const IconShield = ({ size = 20, className }: IconProps) => (
  <svg {...base(size, className)}>
    <path d="M12 2 4 5v7c0 5 3.5 9 8 10 4.5-1 8-5 8-10V5l-8-3Z" />
    <path d="M12 8v8" />
  </svg>
);

export const IconSword = ({ size = 20, className }: IconProps) => (
  <svg {...base(size, className)}>
    <path d="M14.5 17.5 3 6V3h3l11.5 11.5" />
    <path d="m13 19 6-6" />
    <path d="m16 16 4 4" />
    <path d="m19 21 2-2" />
  </svg>
);

export const IconBook = ({ size = 20, className }: IconProps) => (
  <svg {...base(size, className)}>
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" />
  </svg>
);

export const IconCrown = ({ size = 20, className }: IconProps) => (
  <svg {...base(size, className)}>
    <path d="M3 8l3 8h12l3-8-5 3-4-5-4 5-5-3Z" />
    <path d="M5 20h14" />
  </svg>
);

export const IconUser = ({ size = 20, className }: IconProps) => (
  <svg {...base(size, className)}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4 4-7 8-7s8 3 8 7" />
  </svg>
);

export const IconLogout = ({ size = 20, className }: IconProps) => (
  <svg {...base(size, className)}>
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <path d="m16 17 5-5-5-5" />
    <path d="M21 12H9" />
  </svg>
);

export const IconArrowLeft = ({ size = 20, className }: IconProps) => (
  <svg {...base(size, className)}>
    <path d="M19 12H5" />
    <path d="m12 19-7-7 7-7" />
  </svg>
);

export const IconArrowRight = ({ size = 20, className }: IconProps) => (
  <svg {...base(size, className)}>
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

export const IconPlus = ({ size = 20, className }: IconProps) => (
  <svg {...base(size, className)}>
    <path d="M12 5v14" />
    <path d="M5 12h14" />
  </svg>
);

export const IconDice = ({ size = 20, className }: IconProps) => (
  <svg {...base(size, className)}>
    <path d="M12 2 3 7v10l9 5 9-5V7l-9-5Z" />
    <path d="M3 7l9 5 9-5" />
    <path d="M12 12v10" />
  </svg>
);

export const IconScroll = ({ size = 20, className }: IconProps) => (
  <svg {...base(size, className)}>
    <path d="M6 2h11a2 2 0 0 1 2 2v14a2 2 0 0 0 2 2H8a2 2 0 0 1-2-2V2Z" />
    <path d="M6 2a2 2 0 0 0-2 2v14" />
    <path d="M10 8h6" />
    <path d="M10 12h6" />
    <path d="M10 16h4" />
  </svg>
);

export const IconUsers = ({ size = 20, className }: IconProps) => (
  <svg {...base(size, className)}>
    <circle cx="9" cy="8" r="3.5" />
    <path d="M2 21c0-3.5 3-6 7-6s7 2.5 7 6" />
    <path d="M17 5.5a3 3 0 0 1 0 5.5" />
    <path d="M22 21c0-2.5-1.5-4.5-4-5.5" />
  </svg>
);

export const IconTrash = ({ size = 18, className }: IconProps) => (
  <svg {...base(size, className)}>
    <path d="M3 6h18" />
    <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
  </svg>
);

export const IconEdit = ({ size = 18, className }: IconProps) => (
  <svg {...base(size, className)}>
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5Z" />
  </svg>
);
export const IconHome = ({ size = 20, className }: IconProps) => (
  <svg {...base(size, className)}>
    <path d="M3 11 12 3l9 8" />
    <path d="M5 10v11h14V10" />
    <path d="M10 21v-7h4v7" />
  </svg>
);