import React from 'react';
import { motion, Variants } from 'framer-motion';
import SectionWrapper from './SectionWrapper';

const Contact: React.FC = () => {
    const gmailLink = 'https://mail.google.com/mail/?view=cm&fs=1&to=fuadeditingzone@gmail.com&su=Work%20Inquiry%20%2F%20Order%20Request&body=Hello%20Fuad%2C%0A%0AI%20hope%20you%20are%20doing%20well.%20I%20recently%20came%20across%20your%20portfolio%20and%20was%20very%20impressed%20by%20your%20work%20in%20photo%20manipulation%2C%20VFX%2C%20and%20thumbnail%20design.%20I%20am%20interested%20in%20placing%20an%20order%20for%20a%20custom%20design%20project.%0A%0AHere%20are%20some%20details%20about%20what%20I%27m%20looking%20for%3A%0A-%20Project%20Type%3A%20%5BThumbnail%20%2F%20Photo%20Manipulation%20%2F%20VFX%5D%0A-%20Project%20Description%3A%20%5BBriefly%20describe%20what%20you%20need%5D%0A-%20Preferred%20Deadline%3A%20%5BAdd%20date%5D%0A-%20Additional%20Notes%3A%20%5BAnything%20else%5D%0A%0AI%20would%20love%20to%20discuss%20pricing%20and%20any%20additional%20details%20you%20might%20need.%0A%0AThank%20you%20for%20your%20time%20and%20I%20look%20forward%20to%20working%20with%20you.%0A%0AKind%20regards%2C%0A%5BYour%20Full%20Name%5D%0A%5BYour%20Social%20Link%20or%20Website%5D';
    
    const socialLinks = [
        { icon: 'fa-brands fa-facebook-f', href: 'https://www.facebook.com/fuadeditingzone', label: 'Facebook' },
        { icon: 'fa-brands fa-instagram', href: 'https://www.instagram.com/fuadeditingzone', label: 'Instagram' },
        { icon: 'fa-brands fa-youtube', href: 'https://www.youtube.com/@SELECTEDLEGEND', label: 'YouTube' },
        { icon: 'fa-brands fa-tiktok', href: 'https://www.tiktok.com/@fuadeditingzone', label: 'TikTok' },
        { icon: 'fa-brands fa-behance', href: 'https://www.behance.net/fuadeditingzone', label: 'Behance' },
        { icon: 'fa-brands fa-fiverr', href: 'https://www.fiverr.com/fuadedits', label: 'Fiverr' },
    ];

    const wordContainer: Variants = {
        hidden: {},
        show: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } }
    };

    const wordChild: Variants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100, damping: 14 } }
    };

    const contactText = "Have a project in mind or just want to say hello? Feel free to reach out. I'm always open to discussing new creative ideas and opportunities.";

    return (
        <SectionWrapper id="contact">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.h2 
                    className="text-3xl md:text-4xl font-bold text-white mb-4"
                    variants={wordContainer}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.5 }}
                >
                    {"Get In ".split(' ').map((w,i) => <motion.span variants={wordChild} className="inline-block mr-2" key={i}>{w}</motion.span>)}
                    <span className="text-[#E34234]">
                        {"Touch".split(' ').map((w,i) => <motion.span variants={wordChild} className="inline-block" key={i}>{w}</motion.span>)}
                    </span>
                </motion.h2>

                <motion.p 
                    className="text-slate-400 mb-10 max-w-xl mx-auto"
                    variants={wordContainer}
                    initial="hidden"
                    whileInView="show"
                    viewport={{ once: true, amount: 0.5 }}
                >
                    {contactText.split(' ').map((word, i) => (
                        <motion.span variants={wordChild} className="inline-block mr-1.5" key={i}>{word}</motion.span>
                    ))}
                </motion.p>

                <div className="flex flex-col items-center gap-8">
                    <motion.a
                        href={gmailLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block border border-slate-700 hover:border-[#E34234] bg-slate-900/50 hover:bg-slate-900 text-slate-300 font-medium py-3 px-6 rounded-lg text-base tracking-wide transition-all duration-300 shadow-sm hover:shadow-md hover:shadow-[#E34234]/20"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.5 }}
                        transition={{ duration: 0.3 }}
                    >
                        fuadeditingzone@gmail.com
                    </motion.a>
                    <div className="flex justify-center items-center space-x-6 md:space-x-8">
                        {socialLinks.map(({ icon, href, label }, index) => (
                            <motion.a
                                key={index}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={label}
                                className="text-slate-400 hover:text-[#E34234] transition-colors duration-300 text-3xl no-underline"
                                whileHover={{ scale: 1.2, y: -5 }}
                                whileTap={{ scale: 0.9 }}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.5 }}
                                transition={{ duration: 0.3, delay: (index * 0.1) + 0.1 }}
                            >
                            <i className={icon}></i>
                            </motion.a>
                        ))}
                    </div>
                </div>
            </div>
        </SectionWrapper>
    );
};

export default Contact;