import { usePopup } from "../../contexts/PopupContext";
import PopupPageBase from "../PopupPageBase/PopupPageBase";

const PopupContainer = () => {
	const { isOpen, closePopup, content } = usePopup();

	if (!content) {
		return null;
	}

	return (
		<PopupPageBase isOpen={isOpen} onClose={closePopup}>
			{content}
		</PopupPageBase>
	);
};

export default PopupContainer;
