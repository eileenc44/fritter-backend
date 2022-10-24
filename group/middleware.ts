import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import GroupCollection from '../group/collection';
import UserCollection from '../user/collection';

/**
 * Checks if a group with groupId in req.params exists
 */
const isGroupExists = async (req: Request, res: Response, next: NextFunction) => {
  const validFormat = Types.ObjectId.isValid(req.params.groupId);
  const group = validFormat ? await GroupCollection.findOne(req.params.groupId) : '';
  if (!group) {
    res.status(404).json({
      error: {
        groupNotFound: `Group with group ID ${req.params.groupId} does not exist.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if the name of the group in req.body is valid, i.e not a stream of empty
 * spaces and not more than 50 characters
 */
const isValidGroupName = (req: Request, res: Response, next: NextFunction) => {
  const {name} = req.body as {name: string};
  if (!name.trim()) {
    res.status(400).json({
      error: 'Group name must be at least one character long.'
    });
    return;
  }

  if (name.length > 50) {
    res.status(413).json({
      error: 'Group name must be no more than 50 characters.'
    });
    return;
  }

  next();
};

/**
 * Checks if a user with userId as creator id in req.query exists
 */
 const isCreatorExists = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.query.creator) {
    res.status(400).json({
      error: 'Provided creator username must be nonempty.'
    });
    return;
  }

  const user = await UserCollection.findOneByUsername(req.query.creator as string);
  if (!user) {
    res.status(404).json({
      error: `A creator with username ${req.query.creator as string} does not exist.`
    });
    return;
  }

  next();
};

/**
 * Checks if the current user is the creator of the group whose groupId is in req.params
 */
const isValidGroupModifier = async (req: Request, res: Response, next: NextFunction) => {
  const group = await GroupCollection.findOne(req.params.groupId);
  const userId = group.creatorId._id;
  if (req.session.userId !== userId.toString()) {
    res.status(403).json({
      error: 'Cannot modify other users\' groups.'
    });
    return;
  }

  next();
};

/**
 * Checks if a user can join
 */
const isValidJoin = async (req: Request, res: Response, next: NextFunction) => {
  const group = await GroupCollection.findOne(req.params.groupId);
  if (group.members.includes(req.session.userId)) {
    res.status(400).json({
      error: {
        groupNotFound: `You are already a member of this group.`
      }
    });
    return;
  }

  next();
};

/**
 * Checks if a user can join
 */
const isValidLeave = async (req: Request, res: Response, next: NextFunction) => {
  const group = await GroupCollection.findOne(req.params.groupId);
  if (!group.members.indexOf(req.session.userId)) {
    res.status(400).json({
      error: {
        groupNotFound: `You are not a member of this group.`
      }
    });
    return;
  }

  next();
};

export {
  isValidGroupName,
  isGroupExists,
  isCreatorExists,
  isValidGroupModifier,
  isValidJoin,
  isValidLeave
};
