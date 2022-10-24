import type {HydratedDocument, Types} from 'mongoose';
import type {Group} from './model';
import GroupModel from './model';
import UserCollection from '../user/collection';

class GroupCollection {
  /**
   * Add a freet to the collection
   *
   * @param {string} creatorId - The id of the creator of the group
   * @param {string} name - The name of the gorup
   * @return {Promise<HydratedDocument<Group>>} - The newly created group
   */
  static async createOne(creatorId: Types.ObjectId | string, name: string): Promise<HydratedDocument<Group>> {
    const date = new Date();
    const group = new GroupModel({
      creatorId,
      name,
      dateCreated: date,
      dateModified: date,
      members: [creatorId]
    });
    await group.save();
    return (await group.populate('creatorId')).populate('members');
  }

  /**
   * Find a group by groupId
   *
   * @param {string} groupId - The id of the grouo to find
   * @return {Promise<HydratedDocument<Group>> | Promise<null> } - The group with the given groupId, if any
   */
  static async findOne(groupId: Types.ObjectId | string): Promise<HydratedDocument<Group>> {
    return GroupModel.findOne({_id: groupId}).populate('creatorId').populate('members').populate('freets');
  }

  /**
   * Get all the groups in the database
   *
   * @return {Promise<HydratedDocument<Group>[]>} - An array of all of the groups
   */
  static async findAll(): Promise<Array<HydratedDocument<Group>>> {
    return GroupModel.find({}).sort({dateModified: -1}).populate('creatorId').populate('members').populate('freets');
  }

  /**
   * Get all the groups with name
   *
   * @return {Promise<HydratedDocument<Group>[]>} - An array of all of the groups with name
   */
   static async findAllByName(groupName: string): Promise<Array<HydratedDocument<Group>>> {
    return GroupModel.find({name: groupName}).sort({dateModified: -1}).populate('creatorId').populate('members').populate('freets');
  }

  /**
   * Get all the groups by given creator
   *
   * @param {string} username - The username of creator of the freets
   * @return {Promise<HydratedDocument<Group>[]>} - An array of all of the groups
   */
  static async findAllByCreator(username: string): Promise<Array<HydratedDocument<Group>>> {
    const creator = await UserCollection.findOneByUsername(username);
    return GroupModel.find({creatorId: creator._id}).populate('creatorId').populate('members').populate('freets');
  }

  /**
   * Get all the groups by given member
   *
   * @param {string} username - The username of a member in groups
   * @return {Promise<HydratedDocument<Group>[]>} - An array of all of the groups that a member is in
   */
   static async findAllByMember(username: string): Promise<Array<HydratedDocument<Group>>> {
    const member = await UserCollection.findOneByUsername(username);
    return GroupModel.find({members: member._id}).populate('creatorId').populate('members').populate('freets');
  }
  
  /**
   * Find member in gorup
   *
   * @param {string} groupId - The id of the group
   * @param {string} userId - The id of the user
   * @return {Promise<HydratedDocument<Group>[]>} - An array of all of the groups that a member is in
   */
   static async findOneMemberInGroup(groupId: Types.ObjectId | string, userId: Types.ObjectId | string): Promise<Array<HydratedDocument<Group>>> {
    return GroupModel.findOne({_id: groupId, members: userId}).populate('creatorId').populate('members').populate('freets');
  }

  /**
   * Find member in group
   *
   * @param {string} groupId - The id of the group
   * @param {string} freetId - The id of the freet
   * @return {Promise<HydratedDocument<Group>[]>} - An array of all of the groups that a member is in
   */
   static async findOneFreetInGroup(groupId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<Array<HydratedDocument<Group>>> {
    return GroupModel.findOne({_id: groupId, freets: freetId}).populate('creatorId').populate('members').populate('freets');
  }

  /**
   * Update a group with new name
   *
   * @param {string} groupId - The id of the group to be updated
   * @param {string} name - The new name of the gorup
   * @return {Promise<HydratedDocument<Group>>} - The newly updated group
   */
  static async updateOne(groupId: Types.ObjectId | string, name: string): Promise<HydratedDocument<Group>> {
    const group = await GroupModel.findOne({_id: groupId});
    group.name = name;
    group.dateModified = new Date();
    await group.save();
    return (await (await group.populate('creatorId')).populate('members')).populate('freets');
  }

  /**
   * Add a member to a group
   *
   * @param {string} groupId - The id of the group to be updated
   * @param {string} userID - The id of the user to be added
   * @return {Promise<HydratedDocument<Group>>} - The newly updated group
   */
   static async addGroupMember(groupId: Types.ObjectId | string, userId: Types.ObjectId | string): Promise<HydratedDocument<Group>> {
    await GroupModel.updateOne({_id: groupId}, {$push: {members: userId}});
    return await GroupModel.findOne({_id: groupId}).populate('creatorId').populate('members').populate('freets');
  }

  /**
   * Add a member to a group
   *
   * @param {string} groupId - The id of the group to be updated
   * @param {string} userID - The id of the user to be added
   * @return {Promise<HydratedDocument<Group>>} - The newly updated group
   */
   static async removeGroupMember(groupId: Types.ObjectId | string, userId: Types.ObjectId | string): Promise<HydratedDocument<Group>> {
    await GroupModel.updateOne({_id: groupId}, {$pull: {members: userId}});
    return await GroupModel.findOne({_id: groupId}).populate('creatorId').populate('members').populate('freets');
  }

  /**
   * Add a freet to a group
   *
   * @param {string} groupId - The id of the group to be updated
   * @param {string} freetId - The id of the freet to be added
   * @return {Promise<HydratedDocument<Group>>} - The newly updated group
   */
   static async addFreet(groupId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<HydratedDocument<Group>> {
    await GroupModel.updateOne({_id: groupId}, {$push: {freets: freetId}});
    return await GroupModel.findOne({_id: groupId}).populate('creatorId').populate('members').populate('freets');
  }

  /**
   * Remove a freet from a group
   *
   * @param {string} groupId - The id of the group to be updated
   * @param {string} freetId - The id of the freet to be added
   * @return {Promise<HydratedDocument<Group>>} - The newly updated group
   */
   static async removeFreet(groupId: Types.ObjectId | string, freetId: Types.ObjectId | string): Promise<HydratedDocument<Group>> {
    await GroupModel.updateOne({_id: groupId}, {$pull: {freets: freetId}});
    return await GroupModel.findOne({_id: groupId}).populate('creatorId').populate('members').populate('freets');
  }

  /**
   * Delete a group with given groupId.
   *
   * @param {string} groupId - The groupId of group to delete
   * @return {Promise<Boolean>} - true if the group has been deleted, false otherwise
   */
  static async deleteOne(groupId: Types.ObjectId | string): Promise<boolean> {
    const freet = await GroupModel.deleteOne({_id: groupId});
    return freet !== null;
  }

  /**
   * Delete all the groups created by the given creator
   *
   * @param {string} creatorId - The id of creator of groups
   */
  static async deleteMany(creatorId: Types.ObjectId | string): Promise<void> {
    await GroupModel.deleteMany({creatorId});
  }
}

export default GroupCollection;
