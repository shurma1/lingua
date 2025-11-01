import { useEffect } from "react";
import type { ReactNode } from "react";

import { useHistory } from "../../hooks/useHistory";
import PageTransition from "../PageTransition/PageTransition";

interface PopupPageBaseProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

/**
 * Базовый компонент-обертка для popup'ов
 * Предоставляет анимацию открытия/закрытия и интеграцию с историей навигации
 */
const PopupPageBase = ({ isOpen, onClose, children }: PopupPageBaseProps) => {
	const { push } = useHistory();

	useEffect(() => {
		if (isOpen) {
			push(onClose);
		}
	}, [isOpen, onClose, push]);

	return (
		<PageTransition isOpen={isOpen} onClose={onClose}>
			{children}
		</PageTransition>
	);
};

export default PopupPageBase;
