import React from 'react';

const commonIconProps = {
    strokeWidth: 1.5,
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor"
};

type IconProps = {
    className?: string;
}

export const FilmIcon: React.FC<IconProps> = ({ className = "w-12 h-12" }) => (
  <svg {...commonIconProps} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.63 2.18a14.98 14.98 0 00-5.84 7.38m5.84 2.58a14.98 14.98 0 00-5.84 2.58m5.84-2.58v-4.8m0 4.8a14.98 14.98 0 015.84 2.58m-5.84-2.58L12 12m9 3l-3-3m-3 3l-3-3m-3 3l3-3m6 6l-3-3" />
  </svg>
);

export const PhotoIcon: React.FC<IconProps> = ({ className = "w-12 h-12" }) => (
  <svg {...commonIconProps} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

export const ThumbnailIcon: React.FC<IconProps> = ({ className = "w-12 h-12" }) => (
    <svg {...commonIconProps} className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 5h14a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2zm5 5l4 2.5-4 2.5V10z" />
    </svg>
);

export const ThreeDotsIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg {...commonIconProps} className={className} fill="currentColor">
        <path d="M6 12a2 2 0 11-4 0 2 2 0 014 0zm8 0a2 2 0 11-4 0 2 2 0 014 0zm8 0a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
);

export const LogoIcon: React.FC<IconProps> = ({ className = "w-12 h-12" }) => (
    <svg {...commonIconProps} className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zm-7.518-.267A8.25 8.25 0 1120.25 10.5M8.288 14.212A8.25 8.25 0 1117.25 10.5" />
    </svg>
);

export const BrandingIcon: React.FC<IconProps> = ({ className = "w-12 h-12" }) => (
    <svg {...commonIconProps} className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62m-5.043-.025a15.998 15.998 0 013.388-1.62" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3s4.5 4.03 4.5 9-2.015 9-4.5 9z" />
    </svg>
);

export const SocialMediaIcon: React.FC<IconProps> = ({ className = "w-12 h-12" }) => (
    <svg {...commonIconProps} className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.17 48.17 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
    </svg>
);

export const PrintIcon: React.FC<IconProps> = ({ className = "w-12 h-12" }) => (
    <svg {...commonIconProps} className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6 3.129M6.72 13.829l2.28 2.28m7.5-7.5l2.28 2.28M3 18.75l1.5-1.5m1.49-1.49L7.5 18v-2.25m7.5 2.25l1.5-1.5m1.5-1.5l-1.5-1.5M3 18.75l1.5-1.5" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 1.5v2.25m6.75.75l-1.5 1.5M3.75 4.5l1.5 1.5M21 12h-2.25m-15 0H1.5M12 22.5v-2.25m-6.75-.75l1.5-1.5M18.75 19.5l-1.5-1.5" />
    </svg>
);

export const WebBannerIcon: React.FC<IconProps> = ({ className = "w-12 h-12" }) => (
    <svg {...commonIconProps} className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9M20.25 20.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
    </svg>
);

export const YouTubeIcon: React.FC<IconProps> = ({ className = "w-12 h-12" }) => (
    <svg {...commonIconProps} className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
    </svg>
);

export const PromoAdIcon: React.FC<IconProps> = ({ className = "w-12 h-12" }) => (
    <svg {...commonIconProps} className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);