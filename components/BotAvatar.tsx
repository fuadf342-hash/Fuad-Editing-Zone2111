import React from 'react';
import { LogoIcon } from './Icons';

interface BotAvatarProps {
  size?: string;
  type?: 'image' | 'logo';
  src?: string;
}

const BotAvatar: React.FC<BotAvatarProps> = ({ size = 'w-12 h-12', type = 'image', src }) => {
  if (type === 'logo') {
    let iconSizeClass = 'w-5 h-5'; // Default for w-9 h-9
    if (size === 'w-24 h-24') {
      iconSizeClass = 'w-12 h-12';
    } else if (size === 'w-10 h-10') { // FuadBot size
      iconSizeClass = 'w-6 h-6';
    }

    return (
      <div className={`relative ${size} rounded-full bg-slate-800 flex items-center justify-center border-2 border-[#E34234]/50 shadow-inner shadow-black/50`}>
        <LogoIcon className={`${iconSizeClass} text-[#E34234]`} />
      </div>
    );
  }
  
  // Default is 'image'
  const previewSrc = src || "https://drive.google.com/file/d/1dgI__-9PxQHwc4ckX5zzBe3WGD6j1uls/preview";

  return (
    <div className={`relative ${size} rounded-full bg-slate-900 flex items-center justify-center border-2 border-[#E34234]/50 shadow-inner shadow-black/50 overflow-hidden`}>
      <iframe
        src={previewSrc}
        className="w-full h-full pointer-events-none"
        frameBorder="0"
        scrolling="no"
        allow="autoplay"
        title="Bot Avatar Preview"
      />
    </div>
  );
};

export default BotAvatar;