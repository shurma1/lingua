import LeaderboardPage from "@pages/LeaderboardPage/LeaderboardPage";
import { useAuthStore } from "@store/authStore";

import groupAnimation from "../assets/lottie/group.json";
import puzzleAnimation from "../assets/lottie/puzzle.json";
import starAnimation from "../assets/lottie/star.json";
import AdminPage from "../pages/AdminPage/AdminPage";
import CoursePage from "../pages/CoursePage/CoursePage";
import GamePage from "../pages/GamePage/GamePage";

import type {TabNavigatorConfig} from "@components/TabBar/TabNavigator";

export const getTabsConfig = (openPopup: (content: JSX.Element) => void): TabNavigatorConfig[] => {
	const { user } = useAuthStore();
	
	return [
		{
			id: "puzzle",
			label: "Курс",
			animation: puzzleAnimation,
			component: <CoursePage />,
			onMultiplyClick: () => {
				if (user?.role === "admin") {
					openPopup(<AdminPage />);
				}
			},
		
		},
		{
			id: "puzzle2",
			label: "Матчи",
			animation: groupAnimation,
			component: <GamePage />,
		},
		{
			id: "puzzle3",
			label: "Лидеры",
			animation: starAnimation,
			component: <LeaderboardPage />,
		},
	];
};
