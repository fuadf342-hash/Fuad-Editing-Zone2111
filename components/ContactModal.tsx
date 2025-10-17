import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
    const whatsappLink = "https://wa.me/8801772723595?text=Hello%20Fuad!%20I%20found%20you%20through%20your%20portfolio%20and%20I%27m%20interested%20in%20ordering%20a%20design%20or%20video%20edit.%20Please%20share%20your%20pricing%20and%20project%20details.%20Here%20is%20some%20information%20about%20my%20order%3A%0A%0A-%20Type%20of%20Project%3A%20%0A-%20Style%20or%20Reference%20Link%3A%20%0A-%20Deadline%3A%20%0A-%20Additional%20Details%3A%20%0A%0AThank%20you%20Fuad%20%28SELECTED%20LEGEND%29%21";
    const emailLink = "mailto:selectedlegend@gmail.com";

    const socialLinks = [
        { icon: 'fa-brands fa-instagram', href: 'https://www.instagram.com/fuadeditingzone', label: 'Instagram' },
        { icon: 'fa-brands fa-behance', href: 'https://www.behance.net/fuadeditingzone', label: 'Behance' },
        { icon: 'fa-brands fa-fiverr', href: 'https://www.fiverr.com/fuadedits', label: 'Fiverr' },
        { icon: 'fa-brands fa-tiktok', href: 'https://www.tiktok.com/@fuadeditingzone', label: 'TikTok' },
        { icon: 'fa-brands fa-facebook-f', href: 'https://www.facebook.com/fuadeditingzone', label: 'Facebook' },
    ];

    const backdropVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
    };

    const modalVariants = {
        hidden: { opacity: 0, scale: 0.8, y: 50 },
        visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3 } },
        exit: { opacity: 0, scale: 0.8, y: 50, transition: { duration: 0.2 } },
    };

    const handleClose = () => {
      onClose();
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                    variants={backdropVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    onClick={handleClose}
                    aria-modal="true"
                    role="dialog"
                    aria-labelledby="contact-modal-title"
                    aria-describedby="contact-modal-desc"
                >
                    <motion.div
                        className="relative w-full max-w-lg bg-slate-950/90 border border-slate-800 rounded-lg shadow-2xl shadow-[#E34234]/10 flex flex-col text-center p-6 sm:p-8"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <motion.button
                            onClick={handleClose}
                            className="absolute top-3 right-3 text-slate-400 hover:text-white text-3xl leading-none transition-colors"
                            aria-label="Close contact modal"
                            whileHover={{ scale: 1.2, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                        >
                            &times;
                        </motion.button>

                        <h3 id="contact-modal-title" className="text-3xl md:text-4xl font-bold text-white mb-2">
                            Let's <span className="text-[#E34234]">Connect!</span>
                        </h3>
                        <p id="contact-modal-desc" className="text-slate-400 mb-8 max-w-md mx-auto">
                            I’m most active on WhatsApp and Email. Feel free to reach out for collaborations or orders.
                        </p>

                        <div className="flex flex-col gap-4 mb-8">
                             <motion.a
                                href={whatsappLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full flex items-center justify-center gap-3 bg-green-500/90 text-white font-bold py-3 px-6 rounded-lg text-lg tracking-wider
                                           shadow-[0_0_15px_rgb(34,197,94,0.5)] hover:shadow-[0_0_25px_rgb(34,197,94,0.5)]
                                           transition-all duration-300 transform hover:scale-105"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <i className="fa-brands fa-whatsapp text-2xl" aria-hidden="true"></i>
                                WhatsApp
                            </motion.a>
                            <motion.a
                                href={emailLink}
                                className="w-full flex items-center justify-center gap-3 bg-[#E34234] text-white font-bold py-3 px-6 rounded-lg text-lg tracking-wider
                                           shadow-[0_0_15px_#E34234] hover:shadow-[0_0_25px_#E34234]
                                           transition-all duration-300 transform hover:scale-105"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                <i className="fa-solid fa-envelope text-xl" aria-hidden="true"></i>
                                Email
                            </motion.a>
                        </div>

                        <div className="flex justify-center items-center space-x-5 md:space-x-6">
                            {socialLinks.map(({ icon, href, label }, index) => (
                                <motion.a
                                    key={label}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={label}
                                    className="text-slate-400 hover:text-[#E34234] transition-colors duration-300 text-3xl no-underline"
                                    whileHover={{ scale: 1.2, y: -5 }}
                                    whileTap={{ scale: 0.9 }}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0, transition: { duration: 0.3, delay: (index * 0.1) + 0.2 }}}
                                >
                                    <i className={icon}></i>
                                </motion.a>
                            ))}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ContactModal;