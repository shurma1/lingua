import sequelize from './db';

import { Language } from './entities/Language';
import { Module } from './entities/Module';
import { Level } from './entities/Level';
import { Lesson } from './entities/Lesson';
import { Quest } from './entities/Quest';
import { QuestMatchWords } from './entities/QuestMatchWords';
import { QuestDictation } from './entities/QuestDictation';
import { QuestTranslate } from './entities/QuestTranslate';
import { Sentence } from './entities/Sentence';
import { Words } from './entities/Words';
import { SentenceWords } from './entities/SentenceWords';
import { User } from './entities/User';
import { UserLevel } from './entities/UserLevel';
import { FriendInvite } from './entities/FriendInvite';
import { Friends } from './entities/Friends';
import { Duel } from './entities/Duel';
import { AudioMedia } from './entities/AudioMedia';
import { Distractor } from './entities/Distractor';
import { DistractorWords } from './entities/DistractorWords';

const initAssociations = () => {
	// Language associations
	Language.hasMany(Module, { foreignKey: 'languageId', as: 'modules' });
	Language.hasMany(User, { foreignKey: 'languageId', as: 'users' });

	// Module associations
	Module.belongsTo(Language, { foreignKey: 'languageId', as: 'language' });
	Module.hasMany(Level, { foreignKey: 'moduleId', as: 'levels' });
	Module.hasMany(Lesson, { foreignKey: 'moduleId', as: 'lessons' });

	// Lesson associations
	Lesson.belongsTo(Module, { foreignKey: 'moduleId', as: 'module' });

	// Level associations
	Level.belongsTo(Module, { foreignKey: 'moduleId', as: 'module' });
	Level.hasMany(Quest, { foreignKey: 'levelId', as: 'quests' });
	Level.hasMany(UserLevel, { foreignKey: 'levelId', as: 'userLevels' });

	// Quest associations
	Quest.belongsTo(Level, { foreignKey: 'levelId', as: 'level' });
	Quest.hasMany(QuestMatchWords, { foreignKey: 'questId', as: 'matchWords' });
	Quest.hasOne(QuestDictation, { foreignKey: 'questId', as: 'dictation' });
	Quest.hasOne(QuestTranslate, { foreignKey: 'questId', as: 'translate' });

	// Quest subtype associations
	QuestMatchWords.belongsTo(Quest, { foreignKey: 'questId', as: 'quest' });
	QuestDictation.belongsTo(Quest, { foreignKey: 'questId', as: 'quest' });
	QuestDictation.belongsTo(Sentence, { foreignKey: 'correctSentenceId', as: 'correctSentence' });
	QuestDictation.belongsTo(AudioMedia, { foreignKey: 'audioMediaId', as: 'audioMedia' });
	QuestDictation.belongsTo(Distractor, { foreignKey: 'distractorId', as: 'distractor' });
	QuestTranslate.belongsTo(Quest, { foreignKey: 'questId', as: 'quest' });
	QuestTranslate.belongsTo(Sentence, { foreignKey: 'correctSentenceId', as: 'correctSentence' });
	QuestTranslate.belongsTo(Distractor, { foreignKey: 'distractorId', as: 'distractor' });

	// Sentence associations
	Sentence.belongsTo(AudioMedia, { foreignKey: 'audioMediaId', as: 'audioMedia' });
	Sentence.hasMany(SentenceWords, { foreignKey: 'sentenceId', as: 'sentenceWords' });
	Sentence.belongsToMany(Words, { through: SentenceWords, foreignKey: 'sentenceId', otherKey: 'wordId', as: 'words' });
	Sentence.hasMany(QuestDictation, { foreignKey: 'correctSentenceId', as: 'dictationQuests' });
	Sentence.hasMany(QuestTranslate, { foreignKey: 'correctSentenceId', as: 'translateQuests' });

	// Words associations
	Words.belongsTo(AudioMedia, { foreignKey: 'audioMediaId', as: 'audioMedia' });
	Words.hasMany(SentenceWords, { foreignKey: 'wordId', as: 'sentenceWords' });
	Words.belongsToMany(Sentence, { through: SentenceWords, foreignKey: 'wordId', otherKey: 'sentenceId', as: 'sentences' });

	// AudioMedia associations
	AudioMedia.hasMany(Sentence, { foreignKey: 'audioMediaId', as: 'sentences' });
	AudioMedia.hasMany(Words, { foreignKey: 'audioMediaId', as: 'words' });
	AudioMedia.hasMany(QuestDictation, { foreignKey: 'audioMediaId', as: 'dictationQuests' });

	// Distractor associations
	Distractor.hasMany(DistractorWords, { foreignKey: 'distractorId', as: 'distractorWords' });
	Distractor.hasMany(QuestDictation, { foreignKey: 'distractorId', as: 'dictationQuests' });
	Distractor.hasMany(QuestTranslate, { foreignKey: 'distractorId', as: 'translateQuests' });
	DistractorWords.belongsTo(Distractor, { foreignKey: 'distractorId', as: 'distractor' });
	DistractorWords.belongsTo(Words, { foreignKey: 'wordId', as: 'word' });
	Words.hasMany(DistractorWords, { foreignKey: 'wordId', as: 'distractorWords' });

	// SentenceWords associations
	SentenceWords.belongsTo(Sentence, { foreignKey: 'sentenceId', as: 'sentence' });
	SentenceWords.belongsTo(Words, { foreignKey: 'wordId', as: 'word' });

	// User associations
	User.belongsTo(Language, { foreignKey: 'languageId', as: 'language' });
	User.hasMany(UserLevel, { foreignKey: 'userId', as: 'userLevels' });
	User.hasMany(FriendInvite, { foreignKey: 'userId', as: 'friendInvites' });
	User.hasMany(Duel, { foreignKey: 'winnerId', as: 'wonDuels' });
	User.hasMany(Duel, { foreignKey: 'loserId', as: 'lostDuels' });

	// UserLevel associations
	UserLevel.belongsTo(User, { foreignKey: 'userId', as: 'user' });
	UserLevel.belongsTo(Level, { foreignKey: 'levelId', as: 'level' });

	// FriendInvite associations
	FriendInvite.belongsTo(User, { foreignKey: 'userId', as: 'user' });

	// Friends associations
	Friends.belongsTo(User, { foreignKey: 'user1Id', as: 'user1' });
	Friends.belongsTo(User, { foreignKey: 'user2Id', as: 'user2' });

	// Duel associations
	Duel.belongsTo(User, { foreignKey: 'winnerId', as: 'winner' });
	Duel.belongsTo(User, { foreignKey: 'loserId', as: 'loser' });
};

initAssociations();

export {
	sequelize,
	Language,
	Module,
	Level,
	Lesson,
	Quest,
	QuestMatchWords,
	QuestDictation,
	QuestTranslate,
	Sentence,
	Words,
	SentenceWords,
	User,
	UserLevel,
	FriendInvite,
	Friends,
	Duel,
	AudioMedia,
	Distractor,
	DistractorWords,
};

export * from './types/QuestType';
export * from './types/UserRole';

export default {
	sequelize,
	Language,
	Module,
	Level,
	Lesson,
	Quest,
	QuestMatchWords,
	QuestDictation,
	QuestTranslate,
	Sentence,
	Words,
	SentenceWords,
	User,
	UserLevel,
	FriendInvite,
	Friends,
	Duel,
	AudioMedia,
	Distractor,
	DistractorWords,
	initAssociations,
};
