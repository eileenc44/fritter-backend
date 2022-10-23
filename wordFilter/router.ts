import type {NextFunction, Request, Response} from 'express';
import express from 'express';
import * as userValidator from '../user/middleware';
import * as wordFilterValidator from './middleware';
import WordFilterCollection from './collection';

const router = express.Router();

/**
 * Get all words in a user's word filter
 *
 * @name GET /api/wordFilter
 *
 * @return {WordFilter[]} - An array of words in a user's word filter
 * @throws {403} - If user is not logged in
 *
 */
 router.get(
  '/',
  [
    userValidator.isUserLoggedIn
  ],
  async (req: Request, res: Response) => {
    const response = await WordFilterCollection.findAllWords(req.session.userId);
    res.status(200).json(response);
  }
);

/**
 * Add a new word
 *
 * @name POST /api/wordFilter
 *
 * @return {WordFilterResponse} - The created Follow Object
 * @throws {403} - If the user is not logged in
 * @throws {400} - If thew new word is empty or a stream of empty spaces
 * @throws {400} - If word is already in word filter
 * @throws {413} - If the new word is more than 30 characters long
 */
router.post(
  '/',
  [
    userValidator.isUserLoggedIn,
    wordFilterValidator.isValidWord
  ],
  async (req: Request, res: Response) => {
    await WordFilterCollection.addOne(req.session.userId, req.body.word);
    res.status(201).json({
      message: 'You have added a word successfully.',
    });
  }
);

/**
 * Remove a word
 *
 * @name DELETE /api/wordFilter/:word?
 *
 * @param {string} word - The word to remove
 * @return {string} - A success message
 * @throws {403} - If the user is not logged in
 * @throws {400} - If `word` is not already in word filter
 */
router.delete(
  '/:word?',
  [
    userValidator.isUserLoggedIn,
    wordFilterValidator.isWordInWordFilter
  ],
  async (req: Request, res: Response) => {
    await WordFilterCollection.deleteOne(req.session.userId, req.params.word);
    res.status(200).json({
      message: 'You have removed a word successfully.'
    });
  }
);

export {router as wordFilterRouter};
