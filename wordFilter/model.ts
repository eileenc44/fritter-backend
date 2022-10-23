import type {Types} from 'mongoose';
import {Schema, model} from 'mongoose';
import type {User} from '../user/model';

export type WordFilter = {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  word: string;
};

export type PopulatedFollow = {
    _id: Types.ObjectId;
    user: User;
    word: string;
  };

const WordFilterSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true
  },
  word: {
    type: String,
    required: true
  }
});

const WordFilterModel = model<WordFilter>('WordFilter', WordFilterSchema);
export default WordFilterModel;
