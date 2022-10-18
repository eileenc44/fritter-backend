import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

export type Follow = {
  _id: Types.ObjectId;
  follower: Types.ObjectId;
  followee: Types.ObjectId;
};

export type PopulatedFollow = {
    _id: Types.ObjectId;
    follower: User;
    followee: User;
  };

const FollowSchema = new Schema({
  follower: {
    type: Schema.Types.ObjectId,
    required: true
  },
  // The user's password
  followee: {
    type: Schema.Types.ObjectId,
    required: true
  }
});

const FollowModel = model<Follow>('Follower', FollowSchema);
export default FollowModel;
