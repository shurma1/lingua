import { User } from '../models/entities/User';
import { Language } from '../models/entities/Language';
import { ApiError } from '../error/apiError';
import { UserDTO } from '../dtos';

class UserService {
	/**
	 * Update user's selected language
	 */
	async setLanguage(userId: number, languageId: number): Promise<UserDTO> {
		const user = await User.findByPk(userId);
		if (!user) {
			throw ApiError.errorByType('USER_NOT_FOUND');
		}

		// Verify language exists
		const language = await Language.findByPk(languageId);
		if (!language) {
			throw ApiError.errorByType('LANGUAGE_NOT_FOUND');
		}

		user.languageId = languageId;
		await user.save();

		return UserDTO.fromUser(user);
	}

	/**
	 * Get user profile
	 */
	async getUserProfile(userId: number): Promise<UserDTO> {
		const user = await User.findByPk(userId);
		if (!user) {
			throw ApiError.errorByType('USER_NOT_FOUND');
		}

		return UserDTO.fromUser(user);
	}
}

export default new UserService();
