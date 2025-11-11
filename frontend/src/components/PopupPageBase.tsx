import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

import PageTransition from "@components/PageTransition";
import { useHistory } from "@hooks/useHistory";

interface PopupPageBaseProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

const PopupPageBase = ({ isOpen, onClose, children }: PopupPageBaseProps) => {
	const { push } = useHistory();
	const onCloseRef = useRef(onClose);
	const hasBeenPushedRef = useRef(false);
	
	useEffect(() => {
		onCloseRef.current = onClose;
	}, [onClose]);

	useEffect(() => {
		if (isOpen && !hasBeenPushedRef.current) {
			push(onCloseRef.current);
			hasBeenPushedRef.current = true;
		} else if (!isOpen) {
			hasBeenPushedRef.current = false;
		}
	}, [isOpen, push]);
	return (
		<PageTransition isOpen={isOpen} onClose={onClose}>
			{children}
		</PageTransition>
	);
};

export default PopupPageBase;
