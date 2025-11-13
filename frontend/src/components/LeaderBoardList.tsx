import React from "react";

import VirtualList from "@components/ui/VirtualList";
import cls from "@utils/cls";

import styles from "../styles/components/LeaderBoardList.module.scss";

interface LeaderBoardListProps<T> {
	items: T[];
	itemHeight: number;
	containerHeight: number;
	renderItem: (item: T, index: number) => React.ReactNode;
	overscan?: number;
	className?: string;
}

export function LeaderBoardList<T>({
	items,
	itemHeight,
	containerHeight,
	renderItem,
	overscan = 3,
	className,
}: LeaderBoardListProps<T>) {
	return (
		<div className={cls(styles.leaderBoardList, className)}>
			<VirtualList
				items={items}
				itemHeight={itemHeight}
				containerHeight={containerHeight}
				renderItem={renderItem}
				overscan={overscan}
				className={styles.virtualListContainer}
			/>
		</div>
	);
}

export default LeaderBoardList;
