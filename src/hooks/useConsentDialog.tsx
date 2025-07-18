import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ConsentDialog } from '@/src/components/ConsentDialog';

interface ConsentDialogContextType {
  showConsentDialog: () => Promise<boolean>;
  instagramConsentGiven: boolean;
  resetConsentState: () => void;
}

const ConsentDialogContext = createContext<ConsentDialogContextType | undefined>(undefined);

interface ConsentDialogProviderProps {
  children: ReactNode;
}

export function ConsentDialogProvider({ children }: ConsentDialogProviderProps) {
  const [instagramConsentGiven, setInstagramConsentGiven] = useState<boolean>(false);
  const [dialogState, setDialogState] = useState<{
    visible: boolean;
    resolve: ((value: boolean) => void) | null;
  }>({
    visible: false,
    resolve: null,
  });

  const showConsentDialog = (): Promise<boolean> => {
    console.log('🔍 showConsentDialog called');
    console.log('🔍 instagramConsentGiven:', instagramConsentGiven);
    
    // If consent has already been given in this session, return true immediately
    if (instagramConsentGiven) {
      console.log('🔍 Consent already given, returning true');
      return Promise.resolve(true);
    }

    console.log('🔍 Setting dialog visible to true');
    return new Promise((resolve) => {
      setDialogState({
        visible: true,
        resolve,
      });
    });
  };

  const resetConsentState = () => {
    setInstagramConsentGiven(false);
  };

  const handleClose = () => {
    setDialogState(prev => ({
      ...prev,
      visible: false,
    }));
  };

  const handleConsent = (consent: boolean) => {
    console.log('🔍 handleConsent called with:', consent);
    // Store consent state for the session
    if (consent) {
      setInstagramConsentGiven(true);
    }

    if (dialogState.resolve) {
      console.log('🔍 Resolving dialog promise with:', consent);
      dialogState.resolve(consent);
    } else {
      console.log('🔍 No resolve function available!');
    }
    handleClose();
  };

  console.log('🔍 ConsentDialogProvider rendering with dialogState.visible:', dialogState.visible);

  return (
    <ConsentDialogContext.Provider value={{ showConsentDialog, instagramConsentGiven, resetConsentState }}>
      {children}
      {/* Portal the dialog to ensure it appears above all other content */}
      <ConsentDialog
        visible={dialogState.visible}
        onClose={handleClose}
        onConsent={handleConsent}
      />
    </ConsentDialogContext.Provider>
  );
}

export function useConsentDialog() {
  const context = useContext(ConsentDialogContext);
  if (context === undefined) {
    throw new Error('useConsentDialog must be used within a ConsentDialogProvider');
  }
  return context;
}
