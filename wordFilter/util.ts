import type {HydratedDocument} from 'mongoose';
import moment from 'moment';
import type {WordFilter, PopulatedWordFilter} from '../wordFilter/model';

type WordFilterResponse = {
    _id: string;
    user: string;
    word: string;
};

/**
 * Transform a raw Freet object from the database into an object
 * with all the information needed by the frontend
 *
 * @param {HydratedDocument<WordFilter>} wordFilter - A word filter
 * @returns {WordFilterResponse} - The word filter object formatted for the frontend
 */
 const constructWordFilterResponse = (wordFilter: HydratedDocument<WordFilter>): WordFilterResponse => {
    const wordFilterCopy: PopulatedWordFilter = {
      ...wordFilter.toObject({
        versionKey: false // Cosmetics; prevents returning of __v property
      })
    };
    const {username} = wordFilterCopy.userId;
    delete wordFilterCopy.userId;
    return {
      ...wordFilterCopy,
      _id: wordFilterCopy._id.toString(),
      user: username,
      word: wordFilter.word
    };
  };
  
  export {
    constructWordFilterResponse
  };