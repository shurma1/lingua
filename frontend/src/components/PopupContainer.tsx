import { usePopup } from "@contexts/PopupContext";

import PopupPageBase from "./PopupPageBase";

const PopupContainer = () => {
	const { popups, closePopup } = usePopup();

	return (
		<>
			{popups.map((popup) => (
				<PopupPageBase key={popup.id} isOpen={popup.isOpen} onClose={closePopup}>
					{popup.content}
				</PopupPageBase>
			))}
		</>
	);
};

export default PopupContainer;
