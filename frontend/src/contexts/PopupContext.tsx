import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface PopupContextType {
  openPopup: (content: ReactNode) => void;
  closePopup: () => void;
  isOpen: boolean;
  content: ReactNode | null;
}

const PopupContext = createContext<PopupContextType | undefined>(undefined);

export const usePopup = () => {
	const context = useContext(PopupContext);
	if (!context) {
		throw new Error("usePopup must be used within PopupProvider");
	}
	return context;
};

interface PopupProviderProps {
  children: ReactNode;
}

export const PopupProvider = ({ children }: PopupProviderProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [content, setContent] = useState<ReactNode | null>(null);

	const openPopup = useCallback((newContent: ReactNode) => {
		setContent(newContent);
		setIsOpen(true);
	}, []);

	const closePopup = useCallback(() => {
		setIsOpen(false);
		// Очищаем контент после закрытия анимации
		setTimeout(() => setContent(null), 300);
	}, []);

	return (
		<PopupContext.Provider value={{ openPopup, closePopup, isOpen, content }}>
			{children}
		</PopupContext.Provider>
	);
};
