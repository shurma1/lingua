import { create } from "zustand";

import { LessonDTO } from "@/types/api";

interface LessonsState {
	lessonsByModule: Record<number, LessonDTO>;
	isLoading: boolean;
	error: string | null;
	
	setLesson: (moduleId: number, lesson: LessonDTO) => void;
	removeLesson: (moduleId: number) => void;
	setLoading: (isLoading: boolean) => void;
	setError: (error: string | null) => void;
	clearLessons: () => void;
}

export const useLessonsStore = create<LessonsState>((set) => ({
	lessonsByModule: {},
	isLoading: false,
	error: null,

	setLesson: (moduleId, lesson) => set((state) => ({
		lessonsByModule: {
			...state.lessonsByModule,
			[moduleId]: lesson,
		},
		error: null,
	})),
	
	removeLesson: (moduleId) => set((state) => {
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { [moduleId]: _, ...rest } = state.lessonsByModule;
		return { lessonsByModule: rest, error: null };
	}),
	
	setLoading: (isLoading) => set({ isLoading }),
	
	setError: (error) => set({ error, isLoading: false }),
	
	clearLessons: () => set({
		lessonsByModule: {},
		error: null,
	}),
}));
