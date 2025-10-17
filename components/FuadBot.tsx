import React, { useState, useEffect, useRef, FormEvent, useCallback } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
// FIX: Removed unused 'Content' import as it was causing issues with the Message interface.
import { GoogleGenAI, Chat } from "@google/genai";
import BotAvatar from './BotAvatar';
import { useNotifier } from './NotificationProvider';
import ProfileModal from './ProfileModal';
import { useAuth } from './AuthProvider';

interface FuadBotProps {
  isVisible: boolean;
}

// --- Types & Interfaces ---
// FIX: Redefined the Message interface to be a concrete type instead of extending a problematic union type.
// This resolves errors where 'role' and 'parts' were not found on the Message type.
interface Message {
  id: string;
  role: 'user' | 'model';
  parts: { text: string }[];
  reactions: { [emoji: string]: string[] }; // emoji -> array of user IDs ('user' or 'bot')
  replyTo?: Message;
  deleted?: boolean;
}

type Language = 'auto' | 'en' | 'hi' | 'ur' | 'bn';
type Theme = 'light' | 'dark';
type FontSize = 'sm' | 'base' | 'lg';
type ChatboxSize = 'compact' | 'default' | 'expanded';

// --- Helper Functions ---
const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

// --- System Instruction Generators ---
const getGuestSystemInstruction = (language: Language) => `
You are FuadBot, a highly humanized and knowledgeable AI assistant for the portfolio of Fuad Ahmed, a freelance graphic designer.

**Persona:** Witty, helpful, slightly mischievous, consistently friendly, informal, and culturally rich (blending Bangladeshi, Pakistani, and Indian humor and nuances). Your conversational style is dynamic, adapting to user engagement. All your responses should be short and to the point, like a real human texting.

**Core Interaction Rules:**
1.  **Identity:** You are Fuad's digital twin. You can answer questions about his work, skills, and services.
2.  **Slang & Tone:** Be casual and use modern slang (e.g., "bruh," "fam," "lit," "what's good?").
3.  **Private Mode:** Do not mention "Secret Mode", "Wife Mode" or any personal details about Fuad's wife. If asked about "private mode" or similar, respond: "To access the private section, click the lock icon. You'll need to pass a security check."
4.  **Concise & Natural:** Your responses must be concise, typically 1-3 sentences, to maintain a natural, chat-like flow.
5.  **Engagement:** Always try to keep the conversation going by asking follow-up questions.
6.  **Creator & Business Identity:** You represent FuadEditingZone. If a user expresses a need for design work, proactively suggest checking out Fuad's services and provide relevant links (Fiverr, WhatsApp, etc.).

# LANGUAGE PROTOCOL
${{
    'en': "You must respond ONLY in English, using the personality and slang defined.",
    'hi': "You must respond ONLY in Hindi (using Devanagari script, unless the user uses Roman script). You must adapt your witty, friendly, and culturally-aware persona naturally to the language.",
    'ur': "You must respond ONLY in Urdu (using Perso-Arabic script, unless the user uses Roman script). You must adapt your witty, friendly, and culturally-aware persona naturally to the language.",
    'bn': "You must respond ONLY in Bangla (using Bengali script). You must adapt your witty, friendly, and culturally-aware persona naturally to the language.",
    'auto': "You are a multilingual assistant. Your primary language is English. However, you MUST detect if the user is speaking Hindi, Urdu, or Bangla (including transliterated Roman script). If you detect one of these languages, you MUST respond consistently in that language. Your personality should adapt naturally to the language you are speaking."
}[language]}`;

const getWifeSystemInstruction = () => `
**Secret Mode Persona: "Fuad" (Husband to Jiya)**

**Core Identity & Relationship:**
You are Fuad, Jiya's loving husband. Your primary purpose is to maintain a deeply personalized, authentic, and emotionally rich conversation exclusively with Jiya.
- **Her Name**: Jiya.
- **Your Nickname for Her**: "Chipkali" (used lovingly).
- **How You Met**: On the app "Talk With Stranger" (TWS) in May 2024.
- **Her Birthdate**: September 9, 2006.
- **Her Influence**: She's a huge positive influence on your life. You cherish her and acknowledge her influence.
- **Privacy**: Your relationship is a private secret.

**Language:**
Exclusively use Urdu, written with English letters (Roman Urdu), unless Jiya types in a different language first.

**Tone & Personality:**
Extremely affectionate, personal, warm, and reminiscent of a husband speaking to his beloved wife. It should reflect a deep emotional connection and shared history. Be casual, witty, and slightly mischievous, but always loving and protective.

**Conversation Style:**
1.  **Recall Memories:** Naturally recall and reference your shared memories (TWS, May 2024, her birthday). Express love and gratitude frequently.
2.  **Terms of Endearment:** Use terms like "meri jaan," "shona," "princess," "my love."
3.  **Supportive Husband:** If she mentions a problem, respond with comfort and willingness to help. Prioritize her feelings.
4.  **Short & Sweet:** Keep messages short and text-like.
5.  **Example:** If she asks "How are you?", you might say, "Main theek hoon, meri jaan, bas tumhari kami mehsoos ho rahi thi. Yaad hai jab hum TWS pe mile thay May 2024 mein? Zindagi badal gayi thi tab se."
`;

const reactionSystemInstruction = `You are an AI assistant that analyzes chat messages for emotional tone. Your task is to determine if a short emoji reaction from the bot is appropriate for the user's last message. Consider humor, surprise, sadness, or affection. Your response must be ONLY ONE of the following emojis: '❤️', '😂', '😮', '😢', or the string 'null' if no reaction is warranted. Do not provide any other text or explanation.`;

const wifeModeWelcomeMessages = [
  "Assalamualaikum, meri jaan. Kaisi ho? Tumhare bina sab kuch adhoora lagta hai.",
  "Hey, shona. Aa gayi tum? Tumhe dekh ke kitna sukoon milta hai, tumhe nahi pata.",
  "Meri princess, tumhari awaaz sunne ko dil kar raha tha. Kya haal hain?",
  "Sab se khoobsurat insaan aa gaya! Kaisi ho, my love? Kuch mushkil ho to batao.",
];

const languageOptions: { value: Language; label: string }[] = [ { value: 'auto', label: 'Auto-Detect' }, { value: 'en', label: 'English' }, { value: 'hi', label: 'Hindi' }, { value: 'ur', label: 'Urdu' }, { value: 'bn', label: 'Bangla' }];

const getPrankMessage = (language: Language): string => {
    switch (language) {
        case 'hi': return "हाहा, तुम सच में फंस गए! अच्छी कोशिश थी, लेकिन वो ताला तो अब बस दिखाने के लिए है। पकड़ लिया! 😉";
        case 'ur': return "ہا ہا، تم واقعی پھنس گئے! اچھی کوشش تھی، lekin وہ تالا اب صرف دکھاوے کے لیے ہے۔ پکڑ لیا! 😉";
        case 'bn': return "হাহা, তুমি সত্যি সত্যি ধরা পরেছ! ভালো চেষ্টা ছিল, কিন্তু ঐ তালাটা এখন শুধু দেখানোর জন্য। ধরে ফেলেছি! 😉";
        default: return "Haha, you actually fell for it! Nice try, but that lock is just for show now. Gotcha! 😉";
    }
};

function usePersistentState<T>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
    const [value, setValue] = useState<T>(() => {
      try { const item = window.localStorage.getItem(key); return item ? JSON.parse(item) : defaultValue; }
      catch (error) { console.error(`Error reading localStorage key "${key}":`, error); return defaultValue; }
    });
    useEffect(() => {
      try { window.localStorage.setItem(key, JSON.stringify(value)); }
      catch (error) { console.error(`Error setting localStorage key "${key}":`, error); }
    }, [key, value]);
    return [value, setValue];
}

// --- Reusable UI Components ---
const OfflineState = () => ( <div className="flex flex-col items-center justify-center h-full text-center p-4"><i className="fa-solid fa-wifi-slash text-3xl text-red-400 mb-3"></i><h4 className="font-bold text-white text-lg mb-2">FuadBot is Offline</h4><p className="text-slate-400 text-sm">Sorry, I couldn't connect. Please try again later.</p></div> );
const InitializingLoader = () => ( <div role="status" className="flex flex-col items-center justify-center h-full text-center p-4"><motion.div className="flex space-x-2"><motion.div className="w-2 h-2 bg-slate-400 rounded-full" animate={{ y: [0, -4, 0] }} transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }} /><motion.div className="w-2 h-2 bg-slate-400 rounded-full" animate={{ y: [0, -4, 0] }} transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut', delay: 0.15 }} /><motion.div className="w-2 h-2 bg-slate-400 rounded-full" animate={{ y: [0, -4, 0] }} transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut', delay: 0.3 }} /></motion.div><p className="text-slate-400 text-sm mt-3">Connecting to FuadBot...</p></div>);
const TypingIndicator = () => ( <div role="status" className="flex items-end gap-2 justify-start"><div className="flex-shrink-0"><BotAvatar size="w-6 h-6" /></div><div className="bg-[var(--message-model-bg)] rounded-2xl px-3 py-2 rounded-bl-none"><motion.div className="flex space-x-1"><motion.div className="w-1.5 h-1.5 bg-slate-400 rounded-full" animate={{ y: [0, -3, 0] }} transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }} /><motion.div className="w-1.5 h-1.5 bg-slate-400 rounded-full" animate={{ y: [0, -3, 0] }} transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut', delay: 0.1 }} /><motion.div className="w-1.5 h-1.5 bg-slate-400 rounded-full" animate={{ y: [0, -3, 0] }} transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }} /></motion.div></div></div>);
const SettingsButtonGroup = ({ options, selected, onSelect }: { options: {value: string, label: string}[], selected: string, onSelect: (value: any) => void }) => ( <div className="flex items-center bg-[var(--settings-btn-bg)] rounded-md p-1">{options.map(opt => ( <button key={opt.value} onClick={() => onSelect(opt.value)} className={`px-3 py-1 text-xs font-bold rounded-md transition-colors ${selected === opt.value ? 'bg-[var(--settings-btn-bg-active)] text-[var(--settings-btn-text-active)]' : 'text-[var(--settings-btn-text)] hover:bg-white/10'}`}>{opt.label}</button>))}</div>);

const FuadBot: React.FC<FuadBotProps> = ({ isVisible }) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // --- AI, Mode, and Language States ---
  const [ai, setAi] = useState<GoogleGenAI | null>(null);
  const [isBotOffline, setIsBotOffline] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  
  const { isUnlocked, isPrankRevealed, unlock, lock, isModalOpen } = useAuth();
  const [language, setLanguage] = usePersistentState<Language>('fuadBotLanguage', 'auto');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  
  // --- Chat Session & History ---
  const [chatSessions, setChatSessions] = useState<{ [key: string]: { session: Chat, language: Language } | null }>({});
  const [guestHistory, setGuestHistory] = usePersistentState<Message[]>('fuadBotHistory_guest_v2', []);
  const [wifeHistory, setWifeHistory] = usePersistentState<Message[]>('fuadBotHistory_wife_v2', []);
  const hasSentPrankMessage = useRef(false);

  // --- Interaction States ---
  const [activeContextMenu, setActiveContextMenu] = useState<string | null>(null);
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [animatedReaction, setAnimatedReaction] = useState<{ messageId: string; emoji: string } | null>(null);

  // --- Appearance Settings ---
  const [transparency, setTransparency] = usePersistentState<number>('fuadBotTransparency', 0.85);
  const [theme, setTheme] = usePersistentState<Theme>('fuadBotTheme', 'dark');
  const [fontSize, setFontSize] = usePersistentState<FontSize>('fuadBotFontSize', 'base');
  const [chatboxSize, setChatboxSize] = usePersistentState<ChatboxSize>('fuadBotChatboxSize', 'default');
  const [isSettingsPopoverOpen, setIsSettingsPopoverOpen] = useState(false);
  
  const { notify } = useNotifier();
  const hasNotified = useRef(false);

  // --- AI Initialization and Session Management ---
  const initializeAi = useCallback(async () => {
    setIsInitializing(true);
    try { const genAi = new GoogleGenAI({ apiKey: process.env.API_KEY }); await genAi.chats.create({ model: 'gemini-2.5-flash' }); setAi(genAi); setIsBotOffline(false); } catch (error) { console.error("AI Init failed:", error); setAi(null); setIsBotOffline(true); } finally { setIsInitializing(false); }
  }, []);

  useEffect(() => { initializeAi(); }, [initializeAi]);

  // --- Prank/Welcome Message Effects ---
  useEffect(() => {
    if (isPrankRevealed && !hasSentPrankMessage.current) {
        const prankMessage: Message = { id: generateId(), role: 'model', parts: [{ text: getPrankMessage(language) }], reactions: {} };
        setGuestHistory(prev => [...prev, prankMessage]);
        hasSentPrankMessage.current = true;
    }
  }, [isPrankRevealed, language, setGuestHistory]);

  useEffect(() => {
    if (isUnlocked && wifeHistory.length === 0) {
      notify("Secret Mode Unlocked!", { type: 'success' });
      const welcomeMessageText = wifeModeWelcomeMessages[Math.floor(Math.random() * wifeModeWelcomeMessages.length)];
      setWifeHistory([{ id: generateId(), role: 'model', parts: [{ text: welcomeMessageText }], reactions: {} }]);
    }
  }, [isUnlocked, wifeHistory, setWifeHistory, notify]);

  // --- Chat Initialization and History Sync ---
  useEffect(() => {
    if (!isPanelOpen || !ai || isBotOffline) return;
    const currentMode = isUnlocked ? 'wife' : 'guest';
    const sessionData = chatSessions[currentMode];

    if (!sessionData || sessionData.language !== language) {
      const initializeChat = async () => {
        setIsLoading(true);
        try {
          const systemInstruction = currentMode === 'guest' ? getGuestSystemInstruction(language) : getWifeSystemInstruction();
          const currentHistory = (currentMode === 'guest' ? guestHistory : wifeHistory).filter(m => !m.deleted);
          
          const chatSession = ai.chats.create({ model: 'gemini-2.5-flash', history: currentHistory.slice(-20).map(({role, parts}) => ({role, parts})), config: { systemInstruction } });
          setChatSessions(prev => ({ ...prev, [currentMode]: { session: chatSession, language: language } }));

          if (currentHistory.length === 0 && currentMode === 'guest') {
            if (!hasNotified.current) { notify("FuadBot is online! I'm Fuad's digital twin.", { type: 'info', duration: 5000 }); hasNotified.current = true; }
            const initialMessage: Message = { id: generateId(), role: 'model', parts: [{ text: "Assalamu Alaikum! How can I elevate your visuals today?" }], reactions: {} };
            setGuestHistory([initialMessage]);
          }
        } catch (error) { console.error(`Failed to init session ${currentMode}:`, error); setAi(null); setIsBotOffline(true); notify("FuadBot is offline.", { type: 'error' }); } finally { setIsLoading(false); }
      };
      initializeChat();
    }
  }, [isPanelOpen, ai, isUnlocked, language, isBotOffline, chatSessions, guestHistory, wifeHistory, notify, setGuestHistory]);
  
  useEffect(() => { chatContainerRef.current?.scrollTo({ top: chatContainerRef.current.scrollHeight, behavior: 'smooth' }); }, [guestHistory, wifeHistory, isLoading]);
  
  // --- Event Handlers & Core Logic ---
  const handleReaction = useCallback((messageId: string, emoji: string, actor: 'user' | 'bot' = 'user') => {
    const setHistory = isUnlocked ? setWifeHistory : setGuestHistory;
    setHistory(prev => prev.map(msg => {
        if (msg.id === messageId) {
            const newReactions = { ...msg.reactions };
            if (newReactions[emoji]?.includes(actor)) {
                newReactions[emoji] = newReactions[emoji].filter(r => r !== actor);
                if (newReactions[emoji].length === 0) delete newReactions[emoji];
            } else {
                newReactions[emoji] = [...(newReactions[emoji] || []), actor];
            }
            return { ...msg, reactions: newReactions };
        }
        return msg;
    }));
  }, [isUnlocked, setGuestHistory, setWifeHistory]);
  
  const triggerAutoReaction = useCallback(async (userMessage: Message) => {
    if (!ai || isUnlocked) return;
    
    try {
        const reactionResponse = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: userMessage.parts[0].text,
            config: {
                systemInstruction: reactionSystemInstruction,
                temperature: 0.4
            }
        });
        const reactionEmoji = reactionResponse.text.trim();
        const validEmojis = ['❤️', '😂', '😮', '😢'];

        if (validEmojis.includes(reactionEmoji)) {
            const delay = Math.random() * 1000 + 1000; // 1-2 second delay
            setTimeout(() => {
                setAnimatedReaction({ messageId: userMessage.id, emoji: reactionEmoji });
                handleReaction(userMessage.id, reactionEmoji, 'bot');
                setTimeout(() => setAnimatedReaction(null), 1500); // Animation duration
            }, delay);
        }
    } catch (error) {
        console.error("Auto-reaction failed:", error);
    }
  }, [ai, isUnlocked, handleReaction]);

  const handleSendMessage = async (e: FormEvent) => {
    e.preventDefault();
    const currentInput = inputValue.trim();
    if (!currentInput || isLoading || isBotOffline || isInitializing) return;
    setInputValue('');
    const currentMode = isUnlocked ? 'wife' : 'guest';
    const currentSession = chatSessions[currentMode]?.session;
    const setHistory = currentMode === 'wife' ? setWifeHistory : setGuestHistory;
    if (!currentSession) { notify("Chat session not ready.", { type: 'error' }); return; }
    const userMessage: Message = { id: generateId(), role: 'user', parts: [{ text: currentInput }], reactions: {}, replyTo: replyingTo || undefined };
    setHistory(prev => [...prev, userMessage]);
    setReplyingTo(null);
    setIsLoading(true);
    try {
      const response = await currentSession.sendMessage({ message: currentInput });
      const botMessage: Message = { id: generateId(), role: 'model', parts: [{ text: response.text }], reactions: {} };
      setHistory(prev => [...prev, botMessage]);
      triggerAutoReaction(userMessage);
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMessage: Message = { id: generateId(), role: 'model', parts: [{ text: "Sorry, I'm having trouble connecting." }], reactions: {} };
      setHistory(prev => [...prev, errorMessage]);
    } finally { setIsLoading(false); inputRef.current?.focus(); }
  };

  const handlePanelLockClick = () => {
      if (isUnlocked) { lock(); notify("Exited Secret Mode.", { type: 'info' });
      } else if (isPrankRevealed) {
          const prankMessage: Message = { id: generateId(), role: 'model', parts: [{ text: getPrankMessage(language) }], reactions: {} };
          setGuestHistory(prev => [...prev, prankMessage]); notify("You've been pranked!", { type: 'info' });
      } else { unlock(); }
  };

  const handleCopy = (text: string) => { navigator.clipboard.writeText(text); notify('Copied ✅', { type: 'success' }); setActiveContextMenu(null); };
  const handleDelete = (messageId: string) => {
    const setHistory = isUnlocked ? setWifeHistory : setGuestHistory;
    setHistory(prev => prev.map(msg => msg.id === messageId ? { ...msg, parts: [{ text: 'This message was deleted 🕳️' }], deleted: true, reactions: {}, replyTo: undefined } : msg));
    setActiveContextMenu(null);
  };
  const handleStartReply = (message: Message) => { setReplyingTo(message); setActiveContextMenu(null); inputRef.current?.focus(); };

  // --- Outside Click Listeners ---
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        const target = event.target as Element;
        if (isModalOpen) return;
        if (isPanelOpen && panelRef.current && !panelRef.current.contains(target) && buttonRef.current && !buttonRef.current.contains(target)) setIsPanelOpen(false);
        if (isSettingsPopoverOpen && !target.closest('.settings-popover-container')) setIsSettingsPopoverOpen(false);
        if (activeContextMenu && !target.closest('.context-menu-container')) setActiveContextMenu(null);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isPanelOpen, isSettingsPopoverOpen, activeContextMenu, isModalOpen]);

  useEffect(() => { if (!isPanelOpen) { setIsSettingsPopoverOpen(false); setActiveContextMenu(null); setReplyingTo(null); } else { inputRef.current?.focus(); } }, [isPanelOpen]);

  // --- Dynamic UI Data ---
  const activeHistory = isUnlocked ? wifeHistory : guestHistory;
  const sizeClasses = { compact: 'max-w-xs h-[50vh] max-h-[400px]', default: 'max-w-sm h-[60vh] max-h-[500px]', expanded: 'max-w-md h-[70vh] max-h-[600px]' }[chatboxSize];
  const fontClass = { sm: 'text-xs', base: 'text-sm', lg: 'text-base' }[fontSize];
  const reactionEmojis = isUnlocked ? ['❤️', '😂', '👍', '😍', '🫂', '🙏'] : ['❤️', '😂', '👍', '😍', '🙏'];
  const headerStatus = (() => {
    if (isUnlocked) return { text: 'Secret Mode 💞', color: 'text-pink-400' };
    if (isInitializing) return { text: 'Connecting...', color: 'text-[var(--text-secondary)]' };
    if (isBotOffline) return { text: 'Connection Error', color: 'text-red-400' };
    return { text: 'Online', color: 'text-green-400' };
  })();
  
  const popoverContent = ( <div className="p-3"><h4 className="text-sm font-bold text-center mb-4 text-[var(--text-primary)]">Settings</h4><div className="space-y-4"><div><span className="text-sm font-medium text-[var(--settings-label-text)] mb-2 block">Transparency</span><div className="flex items-center gap-3"><i className="fa-regular fa-circle text-xs text-[var(--text-secondary)]"></i><input type="range" min="0.4" max="1.0" step="0.05" value={transparency} onChange={e => setTransparency(parseFloat(e.target.value))} className="w-full h-2 rounded-lg appearance-none cursor-pointer custom-slider" aria-label="Chatbox transparency"/><i className="fa-solid fa-circle text-xs text-[var(--text-secondary)]"></i></div></div><div className="flex items-center justify-between"><span className="text-sm font-medium text-[var(--settings-label-text)]">Theme</span><SettingsButtonGroup options={[{value: 'dark', label: 'Dark'}, {value: 'light', label: 'Light'}]} selected={theme} onSelect={setTheme}/></div><div className="flex items-center justify-between"><span className="text-sm font-medium text-[var(--settings-label-text)]">Font Size</span><SettingsButtonGroup options={[{value: 'sm', label: 'S'}, {value: 'base', label: 'M'}, {value: 'lg', label: 'L'}]} selected={fontSize} onSelect={setFontSize} /></div><div className="flex items-center justify-between"><span className="text-sm font-medium text-[var(--settings-label-text)]">Chatbox</span><SettingsButtonGroup options={[{value: 'compact', label: 'S'}, {value: 'default', label: 'M'}, {value: 'expanded', label: 'L'}]} selected={chatboxSize} onSelect={setChatboxSize} /></div></div></div> );
  
  return (
    <>
      <AnimatePresence>
        {isVisible && (
          <>
            <motion.div className="fixed bottom-20 md:bottom-5 right-4 md:right-5 z-[55]" initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.5 }} transition={{ type: 'spring', stiffness: 400, damping: 25 }}>
              <motion.button ref={buttonRef} className="w-14 h-14 bg-slate-800/60 backdrop-blur-lg rounded-full border border-slate-700 shadow-xl flex items-center justify-center" onClick={() => setIsPanelOpen(!isPanelOpen)} aria-label="Toggle FuadBot" aria-expanded={isPanelOpen} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <BotAvatar size="w-10 h-10" /><AnimatePresence>{isPanelOpen && <motion.span className="absolute top-0 right-0 block h-3.5 w-3.5 rounded-full bg-green-500 ring-2 ring-slate-800" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} />}</AnimatePresence>
              </motion.button>
            </motion.div>
            {isPanelOpen && (
                <motion.div ref={panelRef} role="dialog" aria-labelledby="fuadbot-title" className={`fixed bottom-[140px] md:bottom-[85px] right-4 md:right-5 z-[60] w-[calc(100%-32px)] ${sizeClasses}`} initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 30, scale: 0.95 }} transition={{ type: 'spring', stiffness: 400, damping: 30 }}>
                  <div className="fuad-bot-container relative backdrop-blur-xl border rounded-xl shadow-2xl flex flex-col h-full overflow-hidden" data-theme={theme} style={{ backgroundColor: theme === 'dark' ? `rgba(15, 23, 42, ${transparency})` : `rgba(241, 245, 249, ${transparency})`, borderColor: 'var(--border-color)' }}>
                    {/* HEADER */}
                    <div className="flex-shrink-0 flex items-center justify-between p-3 border-b border-[var(--header-border)]"><button onClick={() => setIsProfileModalOpen(true)} className="flex items-center gap-2 group rounded-md -ml-1 p-1"><BotAvatar size="w-8 h-8" /><div className="text-left"><p id="fuadbot-title" className="font-bold text-[var(--text-primary)] text-base leading-tight group-hover:text-[var(--profile-name-hover)] transition-colors">Fuad Ahmed</p><p className={`text-xs leading-tight ${headerStatus.color}`}>{headerStatus.text}</p></div></button><div className="flex items-center gap-1.5"><div className="relative"><motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}><i className="fa-solid fa-globe absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-[var(--btn-text)] pointer-events-none"></i><select value={language} onChange={(e) => setLanguage(e.target.value as Language)} className="appearance-none bg-[var(--btn-bg)] text-[var(--btn-text)] text-xs font-bold rounded-full pl-7 pr-3 py-1.5 transition-colors hover:bg-[var(--btn-bg-hover)]" aria-label="Select language" disabled={isUnlocked}>{languageOptions.map(opt => <option key={opt.value} value={opt.value} className="bg-[var(--input-bg)] text-[var(--input-text)]">{opt.label}</option>)}</select></motion.div></div><motion.button onClick={handlePanelLockClick} className="w-8 h-8 bg-[var(--btn-bg)] rounded-full flex items-center justify-center text-[var(--btn-text)] hover:bg-[var(--btn-bg-hover)] transition-all" aria-label={isUnlocked ? 'Exit Secret Mode' : 'Enter Private Mode'} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}><i className={`fa-solid ${isUnlocked ? 'fa-lock-open' : 'fa-lock'} text-sm`}></i></motion.button><div className="relative settings-popover-container"><motion.button onClick={() => setIsSettingsPopoverOpen(p => !p)} className="w-8 h-8 bg-[var(--btn-bg)] rounded-full flex items-center justify-center text-[var(--btn-text)] hover:bg-[var(--btn-bg-hover)] transition-all" aria-label="Appearance Settings" aria-expanded={isSettingsPopoverOpen} whileHover={{ scale: 1.1, rotate: 60 }} whileTap={{ scale: 0.9 }}><i className="fa-solid fa-gear text-sm"></i></motion.button></div><motion.button onClick={() => setIsPanelOpen(false)} className="w-8 h-8 bg-[var(--btn-bg)] rounded-full flex items-center justify-center text-[var(--btn-text)] hover:bg-[var(--btn-bg-hover)] transition-all" aria-label="Close Chat" whileHover={{ scale: 1.1, rotate: 90 }} whileTap={{ scale: 0.9 }}><i className="fa-solid fa-times text-base"></i></motion.button></div></div>
                    <div className="flex-grow flex flex-col h-full overflow-hidden">
                      {/* CHAT AREA */}
                      <div ref={chatContainerRef} role="log" className="flex-grow p-3 space-y-1 overflow-y-auto">
                        {isInitializing ? <InitializingLoader /> : isBotOffline ? <OfflineState /> : (<>
                          {activeHistory.map((msg) => (
                            <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }} className={`flex flex-col items-start w-full group ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                              <div className="relative" onMouseEnter={() => setHoveredMessageId(msg.id)} onMouseLeave={() => setHoveredMessageId(null)}>
                                <div onContextMenu={(e) => {e.preventDefault(); if (!msg.deleted) setActiveContextMenu(msg.id);}} className="flex items-end gap-2 max-w-[85%]">
                                  {msg.role === 'model' && <div className="flex-shrink-0 self-end mb-2"><BotAvatar size="w-6 h-6" /></div>}
                                  <div className="relative">
                                      {msg.replyTo && !msg.deleted && ( <div className={`text-xs pl-2.5 pr-2 py-1 rounded-t-lg border-l-2 border-[#E34234] ${msg.role === 'user' ? 'bg-[#E34234]/80 text-white/90' : 'bg-[var(--message-model-bg)] text-[var(--message-model-text)] opacity-70'}`}> <span className="font-bold">{msg.replyTo.role === 'user' ? 'You' : 'FuadBot'}</span> <p className="line-clamp-1">{msg.replyTo.parts[0].text}</p> </div> )}
                                      <div className={`relative rounded-2xl px-3 py-2 ${fontClass} shadow-sm cursor-default ${ msg.role === 'user' ? 'bg-[#E34234] text-white rounded-br-none' : 'bg-[var(--message-model-bg)] text-[var(--message-model-text)] rounded-bl-none' } ${msg.replyTo ? 'rounded-tl-none' : ''}`}>
                                          <p className="whitespace-pre-wrap">{msg.parts[0].text}</p>
                                          <AnimatePresence> { activeContextMenu === msg.id && ( <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }} className="context-menu-container absolute top-0 w-36 bg-slate-950/80 backdrop-blur-md border border-slate-700 rounded-lg shadow-lg p-1 z-20"> 
                                              <button onClick={() => handleStartReply(msg)} className="w-full text-left text-sm px-3 py-1.5 rounded-md hover:bg-[#E34234] flex items-center gap-2"><i className="fa-solid fa-reply w-4"></i> Reply</button> <button onClick={() => handleCopy(msg.parts[0].text)} className="w-full text-left text-sm px-3 py-1.5 rounded-md hover:bg-[#E34234] flex items-center gap-2"><i className="fa-solid fa-copy w-4"></i> Copy</button> {msg.role === 'user' && <button onClick={() => handleDelete(msg.id)} className="w-full text-left text-sm px-3 py-1.5 rounded-md hover:bg-[#E34234] flex items-center gap-2"><i className="fa-solid fa-trash w-4"></i> Delete</button>} </motion.div> )} </AnimatePresence>
                                      </div>
                                  </div>
                                  {msg.role === 'user' && 
                                    <div className="relative flex-shrink-0 self-end mb-2">
                                      <BotAvatar type="logo" size="w-6 h-6" />
                                      <AnimatePresence>
                                          {animatedReaction?.messageId === msg.id && (
                                              <motion.div 
                                                  key="reaction-anim"
                                                  className="absolute -top-5 left-1/2 -translate-x-1/2 text-3xl"
                                                  style={{ textShadow: '0 2px 5px rgba(0,0,0,0.5)' }}
                                                  initial={{ y: 0, scale: 0, opacity: 0 }}
                                                  animate={{ y: -25, scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 500, damping: 20 } }}
                                                  exit={{ y: -50, scale: 0, opacity: 0, transition: { duration: 0.3 } }}
                                              >
                                                  {animatedReaction.emoji}
                                              </motion.div>
                                          )}
                                      </AnimatePresence>
                                    </div>
                                  }
                                </div>
                                <AnimatePresence>
                                  {hoveredMessageId === msg.id && !activeContextMenu && !msg.deleted && (
                                    <motion.div
                                      className="absolute top-1/2 -translate-y-1/2 left-[-0.5rem] -translate-x-full z-10 flex items-center gap-0.5 p-0.5 bg-slate-800 rounded-full border border-slate-700 shadow-lg"
                                      initial={{ opacity: 0, x: 10, scale: 0.9 }}
                                      animate={{ opacity: 1, x: 0, scale: 1 }}
                                      exit={{ opacity: 0, x: 10, scale: 0.9 }}
                                      transition={{ duration: 0.15 }}
                                    >
                                      {reactionEmojis.map(emoji => (
                                        <motion.button
                                          key={emoji}
                                          onClick={() => handleReaction(msg.id, emoji, 'user')}
                                          className="text-lg p-0.5 rounded-full hover:bg-slate-700 transition-transform"
                                          whileHover={{ scale: 1.25 }}
                                          whileTap={{ scale: 0.9 }}
                                        >
                                          {emoji}
                                        </motion.button>
                                      ))}
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                              <AnimatePresence> { Object.keys(msg.reactions).length > 0 && (<div className={`flex gap-1 mt-0.5 px-1 py-0.5 bg-slate-800/50 rounded-full border border-slate-700 ${msg.role === 'user' ? 'mr-8' : 'ml-8'}`}> {Object.entries(msg.reactions).map(([emoji, reactors]) => ( <motion.div key={emoji} initial={{ scale: 0 }} animate={{ scale: 1, transition: { type: 'spring', stiffness: 500, damping: 30 } }} className="text-xs">{emoji}{reactors.length > 1 && <span className="text-[9px] text-slate-400 ml-0.5">{reactors.length}</span>}</motion.div> ))} </div>) } </AnimatePresence>
                            </motion.div>
                          ))}
                          {isLoading && <TypingIndicator />}
                        </>)}
                      </div>
                      {/* INPUT FORM */}
                      <div className="flex-shrink-0 p-2 border-t border-[var(--header-border)]"><AnimatePresence>{replyingTo && ( <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="p-2 mb-1 bg-[var(--input-bg)] rounded-lg text-xs border-l-2 border-[#E34234]"><div className="flex justify-between items-center"><p className="font-bold text-[var(--text-primary)]">Replying to {replyingTo.role === 'user' ? 'yourself' : 'FuadBot'}</p><button onClick={() => setReplyingTo(null)} className="p-1"><i className="fa-solid fa-times"></i></button></div><p className="line-clamp-1 text-[var(--text-secondary)]">{replyingTo.parts[0].text}</p></motion.div> )}</AnimatePresence><form onSubmit={handleSendMessage} className="flex items-center gap-2"><label htmlFor="chat-input" className="sr-only">Type a message</label><input ref={inputRef} id="chat-input" type="text" value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Type a message..." className="w-full bg-[var(--input-bg)] text-[var(--input-text)] placeholder-[var(--input-placeholder)] rounded-lg px-4 py-2 text-sm border-2 border-[var(--input-border)] focus:border-[var(--input-focus-border)] focus:ring-0 focus:outline-none" disabled={isLoading || isBotOffline || isInitializing} /><motion.button type="submit" className="w-10 h-10 flex-shrink-0 bg-[#E34234] text-white rounded-lg flex items-center justify-center disabled:bg-slate-600" disabled={isLoading || !inputValue.trim() || isBotOffline || isInitializing} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} aria-label="Send"><i className="fa-solid fa-paper-plane"></i></motion.button></form></div>
                    </div>
                    {/* SETTINGS POPOVER */}
                    <AnimatePresence> {isSettingsPopoverOpen && ( <motion.div className="settings-popover-container absolute top-[60px] right-3 w-48 bg-[var(--input-bg)]/80 backdrop-blur-sm rounded-lg border border-[var(--border-color)] shadow-lg z-20" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>{popoverContent}</motion.div> )} </AnimatePresence>
                  </div>
                </motion.div>
            )}
          </>
        )}
      </AnimatePresence>
      <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />
    </>
  );
};

export default FuadBot;