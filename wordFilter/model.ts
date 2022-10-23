import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

export type WordFilter = {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  word: string;
};

export type PopulatedWordFilter = {
  _id: Types.ObjectId;
  userId: User;
  word: string;
};

const WordFilterSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref:'User'
  },
  word: {
    type: String,
    required: true
  }
});

const WordFilterModel = model<WordFilter>('WordFilter', WordFilterSchema);
export default WordFilterModel;
