import { FC } from "react";

import Avatar from "@components/ui/Avatar";
import Icon from "@components/ui/Icon";
import cls from "@utils/cls";
import {formatNumber} from "@utils/formatNumber";
import {motion, Variants} from "framer-motion";

import {
	firstPlaceVariants,
	secondPlaceVariants,
	thirdPlaceVariants,
	firstNumberVariants,
	secondNumberVariants,
	thirdNumberVariants,
	firstUserVariants,
	secondUserVariants,
	thirdUserVariants,
} from "@/animations/podium";
import {RatingUser} from "@/types/RatingUser";

import styles from "../styles/components/Podium.module.scss";

interface OwnProps {
	users: RatingUser[];
}

interface UserInfoProps {
	user: RatingUser;
	variants: Variants;
}

const Podium: FC<OwnProps> = ({users}) => {
	const getInitials = (username: string) => {
		return username.slice(0, 2).toUpperCase();
	};
	
	const [firstPlace, secondPlace, thirdPlace] = users;
	
	const UserInfo: FC<UserInfoProps> = ({user, variants}) => {
		return (
			<motion.div
				className={styles.podiumUser}
				variants={variants}
				initial="hidden"
				animate="visible"
			>
				<Avatar
					url={user.photoUrl}
					initials={getInitials(user.username)}
					className={styles.podiumAvatar}
				/>
				<div className={styles.podiumUsername}>{user.username}</div>
				<div className={styles.podiumStars}>
					<Icon name="star-16" size={10}/>
					{formatNumber(user.stars)}
				</div>
			</motion.div>
		);
	};
	
	return (
		<div className={styles.podiumContainer}>
			<div className={styles.podiumStandContainer}>
				{secondPlace && <UserInfo user={secondPlace} variants={secondUserVariants}/>}
				<motion.div
					className={cls(styles.podiumStand, styles.podiumSecondPlace)}
					variants={secondPlaceVariants}
					initial="hidden"
					animate="visible"
					style={{originY: 1}}
				>
					<motion.span
						variants={secondNumberVariants}
						initial="hidden"
						animate="visible"
					>
						2
					</motion.span>
				</motion.div>
			</div>
			<div className={styles.podiumStandContainer}>
				{firstPlace && <UserInfo user={firstPlace} variants={firstUserVariants}/>}
				<motion.div
					className={cls(styles.podiumStand, styles.podiumFirstPlace)}
					variants={firstPlaceVariants}
					initial="hidden"
					animate="visible"
					style={{ originY: 1 }}
				>
					<motion.span
						variants={firstNumberVariants}
						initial="hidden"
						animate="visible"
					>
						1
					</motion.span>
				</motion.div>
			</div>
			<div className={styles.podiumStandContainer}>
				{thirdPlace && <UserInfo user={thirdPlace} variants={thirdUserVariants}/>}
				<motion.div
					className={cls(styles.podiumStand, styles.podiumThirdPlace)}
					variants={thirdPlaceVariants}
					initial="hidden"
					animate="visible"
					style={{ originY: 1 }}
				>
					<motion.span
						variants={thirdNumberVariants}
						initial="hidden"
						animate="visible"
					>
						3
					</motion.span>
				</motion.div>
			</div>
		</div>
	);
};

export default Podium;
