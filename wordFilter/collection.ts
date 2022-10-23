import type { HydratedDocument, Types } from 'mongoose';
import type { WordFilter } from './model';
import WordFilterModel from './model';

class WordFilterCollection {
    /**
     * Follow a user
     *
     * @param {string} userId - The id of the user
     * @param {string} word - The word to add
     * @return {Promise<HydratedDocument<WordFilter>>} - The newly created follower relationship
     */
    static async addOne(userId: Types.ObjectId | string, word: string): Promise<HydratedDocument<WordFilter>> {
        const wordFilter = new WordFilterModel({user: userId, word: word})
        await wordFilter.save();
        return wordFilter;
    }

    /**
     * Find all the words in a user's Word Filter
     *
     * @param {string} userId - The id of the user
     * @return {Promise<HydratedDocument<Follow>[]> | Promise<null>} - An array of followers
     */
    static async findAllWords(userId: Types.ObjectId | string): Promise<HydratedDocument<WordFilter>[]> {
        return await WordFilterModel.find({ user: userId });
    }

    /**
     * Find one word in a user's Word Filter
     *
     * @param {string} userId - The id of the user
     * @param {string} word - The word to add
     * @return {Promise<HydratedDocument<Follow>[]> | Promise<null>} - An array of followers
     */
     static async findOneWord(userId: Types.ObjectId | string, word: string): Promise<HydratedDocument<WordFilter>[]> {
        return await WordFilterModel.findOne({ user: userId, word: word });
    }

    /**
     * Remove a word from a user's Word Filter
     *
     * @param {string} userId - The id of the user
     * @param {string} word - The word to add
     */
    static async deleteOne(userId: Types.ObjectId | string, word: string): Promise<void> {
        await WordFilterModel.deleteOne({ user: userId, word: word });
    }

    /**
     * Delete all words in a user's Word Filter
     *
     * @param {string} userId - The id of the user
     */
     static async deleteAll(userId: Types.ObjectId | string): Promise<void> {
        await WordFilterModel.deleteOne({ user: userId});
    }
}

export default WordFilterCollection;