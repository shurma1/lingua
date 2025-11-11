import { AuthApiClient } from "./AuthApiClient";
import { FriendsApiClient } from "./FriendsApiClient";
import { LanguagesApiClient } from "./LanguagesApiClient";
import { LessonsApiClient } from "./LessonsApiClient";
import { LevelsApiClient } from "./LevelsApiClient";
import { MediaApiClient } from "./MediaApiClient";
import { ModulesApiClient } from "./ModulesApiClient";
import { QuestsApiClient } from "./QuestsApiClient";
import { StatsApiClient } from "./StatsApiClient";
import { UserApiClient } from "./UserApiClient";

export class ApiClient {
	public readonly auth: AuthApiClient;
	public readonly friends: FriendsApiClient;
	public readonly languages: LanguagesApiClient;
	public readonly modules: ModulesApiClient;
	public readonly levels: LevelsApiClient;
	public readonly quests: QuestsApiClient;
	public readonly lessons: LessonsApiClient;
	public readonly stats: StatsApiClient;
	public readonly user: UserApiClient;
	public readonly media: MediaApiClient;

	constructor() {
		this.auth = new AuthApiClient();
		this.friends = new FriendsApiClient();
		this.languages = new LanguagesApiClient();
		this.modules = new ModulesApiClient();
		this.levels = new LevelsApiClient();
		this.quests = new QuestsApiClient();
		this.lessons = new LessonsApiClient();
		this.stats = new StatsApiClient();
		this.user = new UserApiClient();
		this.media = new MediaApiClient();
	}

	// Set auth token for all API clients
	public setAuthToken(token: string | null): void {
		this.auth.setAuthToken(token);
		this.friends.setAuthToken(token);
		this.languages.setAuthToken(token);
		this.modules.setAuthToken(token);
		this.levels.setAuthToken(token);
		this.quests.setAuthToken(token);
		this.lessons.setAuthToken(token);
		this.stats.setAuthToken(token);
		this.user.setAuthToken(token);
		this.media.setAuthToken(token);
	}
}

export const apiClient = new ApiClient();

export default apiClient;
