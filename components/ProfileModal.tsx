import React from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import BotAvatar from './BotAvatar';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ProfileFieldProps {
    label: string;
    value?: string | number;
    isLocked?: boolean;
    children?: React.ReactNode;
}

const ProfileField: React.FC<ProfileFieldProps> = ({ label, value, isLocked = false, children }) => (
    <li className="flex justify-between items-start text-sm py-2.5 border-b border-slate-800/50 last:border-b-0">
        <span className="font-semibold text-slate-300 flex-shrink-0">{label}</span>
        {isLocked ? (
            <span className="flex items-center gap-2 text-slate-500">
                Locked <i className="fa-solid fa-lock text-xs"></i>
            </span>
        ) : (
            <div className="text-slate-400 text-right ml-4">{value || children}</div>
        )}
    </li>
);


const ProfileModal = React.forwardRef<HTMLDivElement, ProfileModalProps>(({ isOpen, onClose }, ref) => {

    const calculateAge = (birthDateString: string): number => {
        const birthDate = new Date(birthDateString);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const m = today.getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };
    
    const age = calculateAge('2003-07-23');
    const experience = new Date().getFullYear() - 2020;

    const socialLinks = [
        { icon: 'fa-brands fa-facebook-f', href: 'https://www.facebook.com/fuadeditingzone', label: 'Facebook' },
        { icon: 'fa-brands fa-instagram', href: 'https://www.instagram.com/fuadeditingzone', label: 'Instagram' },
        { icon: 'fa-brands fa-youtube', href: 'https://www.youtube.com/@SELECTEDLEGEND', label: 'YouTube' },
        { icon: 'fa-brands fa-tiktok', href: 'https://www.tiktok.com/@fuadeditingzone', label: 'TikTok' },
        { icon: 'fa-brands fa-behance', href: 'https://www.behance.net/fuadeditingzone', label: 'Behance' },
        { icon: 'fa-brands fa-fiverr', href: 'https://www.fiverr.com/fuadedits', label: 'Fiverr' },
    ];

    const backdropVariants: Variants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 }
    };

    const modalVariants: Variants = {
        hidden: { opacity: 0, scale: 0.8, y: 50 },
        visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3 } },
        exit: { opacity: 0, scale: 0.8, y: 50, transition: { duration: 0.2 } },
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                    variants={backdropVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    onClick={onClose}
                    aria-modal="true"
                    role="dialog"
                    aria-labelledby="profile-title"
                >
                    <motion.div
                        ref={ref}
                        className="relative w-full max-w-md bg-slate-950/90 border border-slate-800 rounded-2xl shadow-2xl shadow-[#E34234]/20 flex flex-col text-center"
                        variants={modalVariants}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <motion.button
                            onClick={onClose}
                            className="absolute top-2 right-2 text-slate-500 hover:text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors z-20"
                            aria-label="Close profile modal"
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            <i className="fa-solid fa-times"></i>
                        </motion.button>
                        
                        <div className="relative">
                            <div className="h-24 bg-gradient-to-br from-slate-800 to-slate-900 rounded-t-2xl"></div>
                            <div className="absolute -bottom-12 left-1/2 -translate-x-1/2">
                                <BotAvatar size="w-24 h-24" />
                            </div>
                        </div>

                        <div className="pt-16 pb-6 px-6">
                            <h3 id="profile-title" className="text-2xl font-bold text-white">
                                Fuad <span className="text-[#E34234]">Ahmed</span>
                            </h3>
                            <p className="text-sm text-slate-400 font-medium mb-6">
                                @fuadeditingzone
                            </p>
                            
                            <ul className="text-left mb-6">
                                <ProfileField label="Profession" value="Graphic Design & Video Editing" />
                                <ProfileField label="Gender" value="Male" />
                                <ProfileField label="Age" value={age} />
                                <ProfileField label="Experience" value={`${experience}+ Years`} />
                                <ProfileField label="Location" value="Sylhet, Bangladesh" />
                                <ProfileField label="Brother">
                                    <div className="flex flex-col items-end">
                                        <span>Muzammil Ahmed Fahad</span>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs text-slate-500">Also a Graphic Designer</span>
                                            <a 
                                               href="https://www.instagram.com/studio.muzammil?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" 
                                               target="_blank" 
                                               rel="noopener noreferrer"
                                               aria-label="Visit studio.muzammil on Instagram"
                                               className="flex items-center justify-center w-6 h-6 bg-slate-700/50 hover:bg-[#E34234] text-slate-300 hover:text-white rounded-md transition-colors"
                                            >
                                                <i className="fa-brands fa-instagram text-xs"></i>
                                            </a>
                                        </div>
                                    </div>
                                </ProfileField>
                            </ul>

                            <div className="flex justify-center items-center space-x-5">
                                {socialLinks.map(({ icon, href, label }, index) => (
                                    <motion.a
                                        key={label}
                                        href={href}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        aria-label={label}
                                        className="text-slate-400 hover:text-[#E34234] transition-colors duration-300 text-2xl no-underline"
                                        whileHover={{ scale: 1.2, y: -4 }}
                                        whileTap={{ scale: 0.9 }}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0, transition: { duration: 0.3, delay: (index * 0.05) + 0.2 }}}
                                    >
                                        <i className={icon}></i>
                                    </motion.a>
                                ))}
                            </div>

                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
});

export default ProfileModal;