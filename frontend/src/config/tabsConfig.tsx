import groupAnimation from "../assets/lottie/group.json";
import puzzleAnimation from "../assets/lottie/puzzle.json";
import starAnimation from "../assets/lottie/star.json";
import GamePage from "../pages/GamePage/GamePage";
import CoursePage from "../pages/CoursePage/CoursePage";
import StatsPage from "../pages/StatsPage/StatsPage";

import type {TabNavigatorConfig} from "../comsponents/TabNavigator/TabNavigator";

export const tabsConfig: TabNavigatorConfig[] = [
	{
		id: "puzzle",
		label: "Курс",
		animation: puzzleAnimation,
		component: <CoursePage />,
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
		component: <StatsPage />,
	},
];
