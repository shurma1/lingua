import { createContext, useState, useEffect, useCallback } from "react";
import type { ReactNode } from "react";

import WebApp from "../WebApp/WebApp";

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
		setHistory(prev => [...prev, { backFunction }]);
	}, []);
  
	const pop = useCallback(() => {
		setHistory(prev => {
			if (prev.length === 0) return prev;
      
			const currentItem = prev[prev.length - 1];
			currentItem.backFunction();
      
			return prev.slice(0, -1);
		});
	}, []);

	const clear = useCallback(() => {
		setHistory([]);
	}, []);
  
	useEffect(() => {
		const handleBack = () => {
			pop();
		};

		if (history.length > 0) {
			WebApp.BackButton.show();
			WebApp.BackButton.onClick(handleBack);
		} else {
			WebApp.BackButton.hide();
		}

		return () => {
			WebApp.BackButton.offClick(handleBack);
		};
	}, [history.length, pop]);

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
