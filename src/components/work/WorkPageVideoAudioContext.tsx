"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type WorkPageVideoAudioContextValue = {
  /** `useId()` of the clip that may play with sound; all others stay muted. */
  activeUnmutedId: string | null;
  claimUnmuted: (id: string) => void;
  releaseUnmuted: (id: string) => void;
};

const WorkPageVideoAudioContext =
  createContext<WorkPageVideoAudioContextValue | null>(null);

export function WorkPageVideoAudioProvider({ children }: { children: ReactNode }) {
  const [activeUnmutedId, setActiveUnmutedId] = useState<string | null>(null);

  const claimUnmuted = useCallback((id: string) => {
    setActiveUnmutedId(id);
  }, []);

  const releaseUnmuted = useCallback((id: string) => {
    setActiveUnmutedId((cur) => (cur === id ? null : cur));
  }, []);

  const value = useMemo(
    () => ({ activeUnmutedId, claimUnmuted, releaseUnmuted }),
    [activeUnmutedId, claimUnmuted, releaseUnmuted],
  );

  return (
    <WorkPageVideoAudioContext.Provider value={value}>
      {children}
    </WorkPageVideoAudioContext.Provider>
  );
}

export function useWorkPageVideoAudioOptional() {
  return useContext(WorkPageVideoAudioContext);
}
