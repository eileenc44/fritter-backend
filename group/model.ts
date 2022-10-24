import type {Types, PopulatedDoc, Document} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';
import { Freet } from '../freet/model';

// Type definition for group on the backend
export type Group = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  creatorId: Types.ObjectId;
  name: string;
  dateCreated: Date;
  dateModified: Date;
  members: [Types.ObjectId];
  freets: [Types.ObjectId];
};

export type PopulatedGroup = {
  _id: Types.ObjectId; // MongoDB assigns each object this ID on creation
  creatorId: User;
  name: string;
  dateCreated: Date;
  dateModified: Date;
  members: [User];
  freets: [Freet];
};

const GroupSchema = new Schema<Group>({
  creatorId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  name: {
    type: String,
    required: true,
  },
  dateCreated: {
    type: Date,
    required: true
  },
  dateModified: {
    type: Date,
    required: true
  },
  members: {
    type: [{
        type: Schema.Types.ObjectId,
        ref: 'User'
    }],
    required: true,
  },
  freets: {
    type: [{
        type: Schema.Types.ObjectId,
        ref: 'Freet'
    }],
    required: true,
  },
});

const GroupModel = model<Group>('Group', GroupSchema);
export default GroupModel;
