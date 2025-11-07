import { createContext, useState, useEffect, useCallback, useRef } from "react";
import type { ReactNode } from "react";

import WebApp from "@WebApp/WebApp";

interface HistoryItem {
  backFunction: () => void;
}

interface HistoryContextType {
  currentItem: HistoryItem | undefined;
  push: (backFunction: () => void) => void;
  pop: () => void;
  clear: () => void;
  canGoBack: boolean;
  length: number;
}

export const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export const HistoryProvider = ({ children }: { children: ReactNode }) => {
	const [history, setHistory] = useState<HistoryItem[]>([]);

	const currentItem = history[history.length - 1];

	const push = useCallback((backFunction: () => void) => {
		setHistory(prev => {
			const newHistory = [...prev, { backFunction }];
			return newHistory;
		});
	}, []);
 
	const pop = useCallback(() => {
		setHistory(prev => {
			if (prev.length === 0) return prev;
   
			const currentItem = prev[prev.length - 1];
			currentItem.backFunction();
   
			const newHistory = prev.slice(0, -1);
			return newHistory;
		});
	}, []);

	const clear = useCallback(() => {
		setHistory([]);
	}, []);
	
	const popRef = useRef(pop);
	popRef.current = pop;

	const handleBack = useCallback(() => {
		popRef.current();
	}, []);
	
	useEffect(() => {
		WebApp.BackButton.onClick(handleBack);

		return () => {
			WebApp.BackButton.offClick(handleBack);
		};
	}, [handleBack]);
	
	useEffect(() => {
		if (history.length > 0) {
			WebApp.BackButton.show();
		} else {
			WebApp.BackButton.hide();
		}
	}, [history.length]);

	return (
		<HistoryContext.Provider
			value={{
				currentItem,
				push,
				pop,
				clear,
				canGoBack: history.length > 0,
				length: history.length,
			}}
		>
			{children}
		</HistoryContext.Provider>
	);
};
