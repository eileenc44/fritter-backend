import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {Group, PopulatedGroup} from '../group/model';
import type {Freet} from '../freet/model';

type GroupResponse = {
  _id: string;
  creator: string;
  name: string;
  dateCreated: string;
  dateModified: string;
  members: string[];
  freets: Freet[];
};

/**
 * Encode a date as an unambiguous string
 *
 * @param {Date} date - A date object
 * @returns {string} - formatted date as string
 */
const formatDate = (date: Date): string => moment(date).format('MMMM Do YYYY, h:mm:ss a');

/**
 * Transform a raw Group object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<Group>} group - A group
 * @returns {GroupResponse} - The group object formatted for the frontend
 */
const constructGroupResponse = (group: HydratedDocument<Group>): GroupResponse => {
  const groupCopy: PopulatedGroup = {
    ...group.toObject({
      versionKey: false // Cosmetics; prevents returning of __v property
    })
  };
  const {username} = groupCopy.creatorId;
  delete groupCopy.creatorId;
  return {
    ...groupCopy,
    _id: groupCopy._id.toString(),
    creator: username,
    dateCreated: formatDate(group.dateCreated),
    dateModified: formatDate(group.dateModified),
    members: groupCopy.members.map(member => member ? member.username.toString() : "error"),
    freets: groupCopy.freets
  };
};

export {
  constructGroupResponse
};
