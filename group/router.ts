import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import GroupCollection from './collection';
import * as userValidator from '../user/middleware';
import * as groupValidator from '../group/middleware';
import * as freetValidator from '../freet/middleware';
import * as util from './util';
import FreetCollection from '../freet/collection';

const router = express.Router();

/**
 * Get all the groups
 *
 * @name GET /api/groups
 *
 * @return {GroupResponse[]} - A list of all the groups sorted in descending
 *                      order by date modified
 */
/**
 * Get groups by group name.
 *
 * @name GET /api/groups?groupName=name
 *
 * @return {GroupResponse[]} - An array of groups with group name, groupName
 *
 */
/**
 * Get groups by creator.
 *
 * @name GET /api/groups?creator=id
 *
 * @return {GroupResponse[]} - An array of groups created by user with id, creatorId
 * @throws {400} - If creatorId is not given
 * @throws {404} - If no user has given creatorId
 *
 */
router.get(
  '/',
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.query.creator) next();
    else if (req.query.member) next('route');
    else if (req.query.groupName) {
      const groups = await GroupCollection.findAllByName(req.query.groupName as string);
      const response = groups.map(util.constructGroupResponse);
      res.status(200).json(response);
    }
    else {
      const allGroups = await GroupCollection.findAll();
      const response = allGroups.map(util.constructGroupResponse);
      res.status(200).json(response);
    }
  },
  [
    groupValidator.isCreatorExists
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.query.member !== undefined) {
      next();
      return;
    }
    const creatorGroups = await GroupCollection.findAllByCreator(req.query.creator as string);
    const response = creatorGroups.map(util.constructGroupResponse);
    res.status(200).json(response);
  }
);

/**
 * Get groups by member.
 *
 * @name GET /api/member?member=id
 *
 * @return {GroupResponse[]} - An array of groups with user as a member
 * @throws {400} - If memberId is not given
 * @throws {404} - If no user has given memberId
 *
 */
router.get(
  '/',
  [
    userValidator.isValidUsername
  ],
  async (req: Request, res: Response) => {
    const creatorGroups = await GroupCollection.findAllByMember(req.query.member as string);
    const response = creatorGroups.map(util.constructGroupResponse);
    res.status(200).json(response);
  }
);

/**
 * Create a new group.
 *
 * @name POST /api/groups
 *
 * @param {string} name - The name of the group
 * @return {GroupResponse} - The created group
 * @throws {403} - If the user is not logged in
 * @throws {400} - If the group name is empty or a stream of empty spaces
 * @throws {413} - If the group name is more than 50 characters long
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    groupValidator.isValidGroupName
  ],
  async (req: Request, res: Response) => {
    const userId = (req.session.userId as string) ?? '';
    const group = await GroupCollection.createOne(userId, req.body.name as string);

    res.status(201).json({
      message: 'Your group was created successfully.',
      group: util.constructGroupResponse(group)
    });
  }
);

/**
 * Delete a group
 *
 * @name DELETE /api/groups/:id
 *
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in or is not the author of
 *                 the group
 * @throws {404} - If the groupId is not valid
 */
router.delete(
  '/:groupId?',
  [
    userValidator.isUserLoggedIn,
    groupValidator.isGroupExists,
    groupValidator.isValidGroupModifier
  ],
  async (req: Request, res: Response) => {
    await GroupCollection.deleteOne(req.params.groupId);
    res.status(200).json({
      message: 'Your group was deleted successfully.'
    });
  }
);

/**
 * Modify group name
 *
 * @name PUT /api/groups/:id
 *
 * @param {string} name - the new name for the group
 * @return {GroupResponse} - the updated group
 * @throws {403} - if the user is not logged in or not the creator of
 *                 of the group
 * @throws {404} - If the groupId is not valid
 * @throws {400} - If the group name is empty or a stream of empty spaces
 * @throws {413} - If the group name is more than 50 characters long
 */
 router.put(
  '/:groupId?',
  [
    userValidator.isUserLoggedIn,
    groupValidator.isGroupExists,
    groupValidator.isValidGroupModifier,
    groupValidator.isValidGroupName,
  ],
  async (req: Request, res: Response) => {
    const group = await GroupCollection.updateOne(req.params.groupId, req.body.name);
    res.status(200).json({
      message: 'Your group was updated successfully.',
      group: util.constructGroupResponse(group)
    });
  }
);

/**
 * Add a member to a group
 *
 * @name PUT /api/groups/:id
 *
 * @return {GroupResponse} - the updated group
 * @throws {403} - if the user is not logged in
 * @throws {404} - if the groupId is not valid
 * @throws {400} - if the user is already a member of the group
 */
router.put(
  '/:groupId?/join',
  [
    userValidator.isUserLoggedIn,
    groupValidator.isGroupExists,
    groupValidator.isNotGroupMember
  ],
  async (req: Request, res: Response) => {
    const group = await GroupCollection.addGroupMember(req.params.groupId as string, req.session.userId as string);
    res.status(200).json({
      message: 'You have joined the group.',
      group: util.constructGroupResponse(group)
    });
  }
);

/**
 * Remove a member from a group
 *
 * @name PUT /api/groups/:id
 *
 * @return {GroupResponse} - the updated group
 * @throws {403} - if the user is not logged in
 * @throws {404} - If the groupId is not valid
 */
router.put(
  '/:groupId?/leave',
  [
    userValidator.isUserLoggedIn,
    groupValidator.isGroupExists,
    groupValidator.isValidGroupMember
  ],
  async (req: Request, res: Response) => {
    const group = await GroupCollection.removeGroupMember(req.params.groupId as string, req.session.userId as string);
    res.status(200).json({
      message: 'You have left the group.',
      group: util.constructGroupResponse(group)
    });
  }
);

/**
 * Add a freet to a group
 *
 * @name PUT /api/groups/:id/addFreet
 *
 * @param {string} content - the content of the freet to add
 * @param {boolean} anonymous - if freet is boolean
 * @return {GroupResponse} - the updated group
 * @throws {403} - if the user is not logged in
 * @throws {404} - if the groupId is not valid
 * @throws {403} - If the user is not the author of the freet or is not a member of the group
 */
 router.put(
  '/:groupId?/addFreet',
  [
    userValidator.isUserLoggedIn,
    groupValidator.isGroupExists,
    groupValidator.isValidGroupMember,
    freetValidator.isValidFreetContent
  ],
  async (req: Request, res: Response) => {
    const freet = await FreetCollection.addOne(req.session.userId, req.body.content, req.body.anonymous ? true : false, true);
    const group = await GroupCollection.addFreet(req.params.groupId, freet._id);
    res.status(200).json({
      message: 'You have joined the group.',
      group: util.constructGroupResponse(group)
    });
  }
);

/**
 * Delete a freet from a group
 *
 * @name PUT /api/groups/:id/deleteFreet/:freetId?
 *
 * @return {GroupResponse} - the updated group
 * @throws {403} - if the user is not logged in
 * @throws {404} - If the groupId is not valid
 * @throws {403} - If the user is not the author of the freet or is not a member of the group
 */
router.put(
  '/:groupId?/deleteFreet/:freetId',
  [
    userValidator.isUserLoggedIn,
    groupValidator.isGroupExists,
    groupValidator.isValidGroupMember,
    freetValidator.isFreetExists,
    freetValidator.isValidFreetModifier,
    groupValidator.isFreetInGroup
  ],
  async (req: Request, res: Response) => {
    const group = await GroupCollection.removeFreet(req.params.groupId, req.params.freetId);
    await FreetCollection.deleteOne(req.params.freetId); // synchoronized with deleting freet
    res.status(200).json({
      message: 'You have deleted the freet.',
      group: util.constructGroupResponse(group)
    });
  }
);

export {router as groupRouter};
