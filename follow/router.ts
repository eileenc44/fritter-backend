import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import * as userValidator from '../user/middleware';
import * as followerValidator from './middleware';
import FollowerCollection from './collection';
import UserCollection from '../user/collection';

const router = express.Router();

/**
 * Get all the user's followers
 *
 * @name GET /api/follow?followee=USERNAME
 *
 * @return {Followers[]} - An array of followers of a user
 * @throws {400} - If authorId is not given
 * @throws {404} - If no user has given authorId
 *
 */
/**
 * Get all the users that this user follows
 *
 * @name GET /api/follow?follower=USERNAME
 *
 * @return {followers} - A list of all the users that the `follower` follows
 */
 router.get(
  '/',
  [
    followerValidator.isValidFolloweeFollower
  ],
  async (req: Request, res: Response) => {
    if (req.query.followee !== undefined) {
      const followee = await UserCollection.findOneByUsername(req.query.followee as string);
      const response = await FollowerCollection.findAllFollowersOfUser(followee._id);
      res.status(200).json(response);
    }
    else if (req.query.follower !== undefined) {
      const follower = await UserCollection.findOneByUsername(req.query.follower as string);
      const response = await FollowerCollection.findAllUsersFollowersByUser(follower._id);
      res.status(200).json(response);
    }
  }
);

/**
 * Follow a user
 *
 * @name POST /api/follow
 *
 * @param {string} followeeName - The name of the user to follow
 * @return {FreetResponse} - The created Follow Object
 * @throws {403} - If the user is not logged in or is not following the followee
 * @throws {400} - If the `followee` is not given
 * @throws {404} - If the `followee` is not found
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    followerValidator.isValidFollow
  ],
  async (req: Request, res: Response) => {
    const followerId = (req.session.userId as string) ?? '';
    const followeeId = (await UserCollection.findOneByUsername(req.body.followeeName))._id;
    await FollowerCollection.addOne(followerId, followeeId);
    res.status(201).json({
      message: 'You have followed successfully.',
    });
  }
);

/**
 * Unfollow a user
 *
 * @name DELETE /api/follow?followee=USERNAME
 *
 * @param {string} followee - The name of the user to unfollow
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the `followee` is not given or is not following the followee
 * @throws {404} - If the `followee` is not found
 */
router.delete(
  '/:followeeName?',
  [
    userValidator.isUserLoggedIn,
    followerValidator.isValidUnfollow
  ],
  async (req: Request, res: Response) => {
    const followerId = (req.session.userId as string) ?? '';
    const followeeId = (await UserCollection.findOneByUsername(req.params.followeeName))._id;
    await FollowerCollection.deleteOne(followerId, followeeId);
    res.status(200).json({
      message: 'You have unfollowed successfully.'
    });
  }
);

export {router as followerRouter};
