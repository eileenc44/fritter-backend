import type {Request, Response, NextFunction} from 'express';
import {Types} from 'mongoose';
import WordFilterCollection from './collection';

/**
 * Checks that the word in req.body is not already in word filter
 * Checks if the word in req.body is valid, i.e not a stream of empty
 * spaces and not more than 30 characters
 */
const isValidWord = async (req: Request, res: Response, next: NextFunction) => {
  const {word} = req.body as {word: string};
  const foundWord = await WordFilterCollection.findOneWord(req.session.userId as string, word);
  if (foundWord) {
    res.status(400).json({
      error: 'Word is already in your word filter'
    });
    return;
  }

  if (!word.trim()) {
    res.status(400).json({
      error: 'Word must be at least one character long.'
    });
    return;
  }

  if (word.length > 30) {
    res.status(413).json({
      error: 'Word must be no more than 30 characters.'
    });
    return;
  }

  next();
};

/**
 * Checks that the word is in word filter
 */
const isWordInWordFilter = async (req: Request, res: Response, next: NextFunction) => {
  const wordFound = await WordFilterCollection.findOneWord(req.session.userId as string, req.params.word);
  if (!wordFound) {
    res.status(400).json({
      error: 'Word is not in your word filter'
    });
    return;
  }

  next();
};

export {
  isValidWord,
  isWordInWordFilter
};
