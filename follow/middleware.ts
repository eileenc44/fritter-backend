import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import UserCollection from '../user/collection';
import FollowerCollection from './collection';

/**
 * Checks if a follower with followerId is req.params exists
 */
const isValidFolloweeFollower = async (req: Request, res: Response, next: NextFunction) => {
  const followee = req.query.followee ? await UserCollection.findOneByUsername(req.query.followee as string) : "";
  const follower = req.query.follower ? await UserCollection.findOneByUsername(req.query.follower as string): "";
  if (!follower && !followee) {
    const user = req.params.followee ? req.params.followee : req.params.follower;
    res.status(404).json({
      error: {
        followerNotFound: `User with with ID ${user} does not exist.`
      }
    });
    return;
  }
  next();
};

/**
 * Checks that Followee is a valid user, is not self, and not already following
 */
 const isValidFollow = async (req: Request, res: Response, next: NextFunction) => {
  const {followeeName} = req.body as {followeeName: string};
  if (!followeeName) {
    res.status(400).json({
      error: 'Provided username must be nonempty.'
    });
    return;
  }
  const followee = await UserCollection.findOneByUsername(followeeName);
  if (!followee) {
    res.status(404).json({
      error: {
        followerNotFound: `Follower with Follower ID ${req.body.followeeName} does not exist.`
      }
    });
    return;
  }
  if (followee._id.toString() == req.session.userId as string) {
    res.status(400).json({
      error: {
        followingSelf: `Can not follow yourself.`
      }
    });
    return;
  }
  const isAlreadyFollowing = await FollowerCollection.findFollowerFolloweePair(req.session.userId, followee._id);
  if (isAlreadyFollowing) {
    res.status(400).json({
      error: {
        alreadyFollowing: `Already following this user.`
      }
    });
    return;
  }
  next();
};

/**
 * Checks that Followee is a valid user
 */
 const isValidUnfollow = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.params.followeeName) {
    res.status(400).json({
      error: 'Provided username must be nonempty.'
    });
    return;
  }
  const followee = await UserCollection.findOneByUsername(req.params.followeeName as string);
  if (!followee) {
    res.status(404).json({
      error: {
        followerNotFound: `User with User ID ${req.params.followeeName} does not exist.`
      }
    });
    return;
  }

  next();
};

export {
  isValidFolloweeFollower,
  isValidFollow,
  isValidUnfollow
};
