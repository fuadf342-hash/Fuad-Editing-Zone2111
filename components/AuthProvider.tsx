import React, { createContext, useState, useContext, ReactNode, useRef, useCallback } from 'react';
import SecretCodeModal from './SecretCodeModal';
import { useNotifier } from './NotificationProvider';

interface AuthContextType {
  isUnlocked: boolean;
  isModalOpen: boolean;
  isPrankRevealed: boolean;
  unlock: () => void;
  lock: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MAX_ATTEMPTS = 3;

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [isPrankRevealed, setIsPrankRevealed] = useState(false);
  const { notify } = useNotifier();
  const secretModalRef = useRef<HTMLDivElement>(null);

  const unlock = useCallback(() => {
    if (isUnlocked || isPrankRevealed) return;
    setAttempts(0); // Reset attempts when opening the modal
    setIsModalOpen(true);
  }, [isUnlocked, isPrankRevealed]);

  const lock = useCallback(() => {
    setIsUnlocked(false);
    // Note: We don't reset the prank state here, so it persists for the session.
  }, []);
  
  const handleUnlockSuccess = useCallback(() => {
    setIsModalOpen(false);
    setIsUnlocked(true);
    setAttempts(0);
  }, []);
  
  const handleUnlockFailure = useCallback(() => {
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (newAttempts >= MAX_ATTEMPTS) {
      setIsModalOpen(false);
      setIsPrankRevealed(true);
      notify("Prank Mode Activated!", { type: 'warning' });
    }
  }, [attempts, notify]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <AuthContext.Provider value={{ isUnlocked, isPrankRevealed, unlock, lock, isModalOpen }}>
      {children}
      <SecretCodeModal 
        ref={secretModalRef}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleUnlockSuccess}
        onFailure={handleUnlockFailure}
        attemptsLeft={MAX_ATTEMPTS - attempts}
      />
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};