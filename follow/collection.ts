import type { HydratedDocument, Types } from 'mongoose';
import type { Follow } from './model';
import FollowModel from './model';

class FollowerCollection {
    /**
     * Follow a user
     *
     * @param {string} followerId - The id of the follower
     * @param {string} followeeId - The id of the followee
     * @return {Promise<HydratedDocument<Follow>>} - The newly created follower relationship
     */
    static async addOne(followerId: Types.ObjectId | string, followeeId: Types.ObjectId | string): Promise<HydratedDocument<Follow>> {
        const follow = new FollowModel({followerId: followerId, followeeId: followeeId})
        await follow.save();
        return (await follow.populate('followerId')).populate('followeeId');
    }

    /**
     * Find a Follower/Followee Pair
     *
     * @param {string} followerId - The id of the follower
     * @param {string} followeeId - The id of the followee
     * @return {Promise<HydratedDocument<Follow>[]> | Promise<null>} - The newly created follower relationship
     */
     static async findFollowerFolloweePair(followerId: Types.ObjectId | string, followeeId: Types.ObjectId | string): Promise<HydratedDocument<Follow>[]> {
        return FollowModel.findOne({followerId: followerId, followeeId: followeeId}).populate('followerId').populate('followeeId');
    }

    /**
     * Find a user's followers by id.
     *
     * @param {string} followeeId - The id of the followee
     * @return {Promise<HydratedDocument<Follow>[]> | Promise<null>} - An array of followers
     */
    static async findAllFollowersOfUser(followeeId: Types.ObjectId | string): Promise<HydratedDocument<Follow>[]> {
        return FollowModel.find({ followeeId: followeeId }).populate('followerId').populate('followeeId');
    }

    /**
     * Find who a user follows by id.
     *
     * @param {string} followerId - The id of the follower
     * @return {Promise<HydratedDocument<Follow>[]> | Promise<null>} - An array of users that are followed by followerId
     */
    static async findAllUsersFollowersByUser(followerId: Types.ObjectId | string): Promise<HydratedDocument<Follow>[]> {
        return FollowModel.find({ followerId: followerId }).populate('followerId').populate('followeeId');
    }

    /**
     * Unfollow a user
     *
     * @param {string} followerId - The id of the follower
     * @param {string} followeeId - The id of the followee
     */
    static async deleteOne(followerId: Types.ObjectId | string, followeeId: Types.ObjectId | string): Promise<void> {
        await FollowModel.deleteOne({ followerId: followerId, followeeId: followeeId });
    }

    /**
     * Unfollow everyone
     *
     * @param {string} followerId - The id of the follower
     */
     static async deleteAllFollowersOfUser(followerId: Types.ObjectId | string): Promise<void> {
        await FollowModel.deleteOne({ followerId: followerId});
    }

    /**
     * All followees of user unfollow user
     *
     * @param {string} followeeId - The id of the followee
     */
     static async deleteAllFolloweesOfUser(followeeId: Types.ObjectId | string): Promise<void> {
        await FollowModel.deleteOne({ followeeId: followeeId});
    }
}

export default FollowerCollection;