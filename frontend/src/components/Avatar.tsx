import {FC} from "react";


import {Avatar as MaxAvatar} from "@maxhub/max-ui";
import cls from "@utils/cls";

import styles from "../styles/components/Avatar.module.scss";

interface OwnProps {
	url?: string | null;
	initials: string;
	className?: string;
}

const Avatar: FC<OwnProps> = ({url, initials, className}) => {
	return (
		<MaxAvatar.Container className={cls(styles.Avatar, className)}>
			{
				!!url
				&& <MaxAvatar.Image
					fallback={initials}
					fallbackGradient="green"
					src={url}
				/>
				|| <MaxAvatar.Text gradient="red">
					{initials}
				</MaxAvatar.Text>
			}
			
		</MaxAvatar.Container>
	);
};

export default Avatar;
