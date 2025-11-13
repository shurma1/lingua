import LanguagePanel from "@components/AdminPanel/LanguagePanel";
import LessonPanel from "@components/AdminPanel/LessonPanel";
import LevelPanel from "@components/AdminPanel/LevelPanel";
import ModulePanel from "@components/AdminPanel/ModulePanel";
import QuestPanel from "@components/AdminPanel/QuestPanel";
import TabbedContainer, { TabConfig } from "@components/TabbedContainer";


const AdminPage = () => {
	const tabConfig: TabConfig[] = [
		{ id: "languages", label: "Язык", component: LanguagePanel },
		{ id: "modules", label: "Модуль", component: ModulePanel },
		{ id: "lessons", label: "Урок", component: LessonPanel },
		{ id: "levels", label: "Уровень", component: LevelPanel },
		{ id: "quests", label: "Квест", component: QuestPanel },
	];

	return <TabbedContainer config={tabConfig} />;
};

export default AdminPage;
