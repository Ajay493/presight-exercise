import { Request, Response } from 'express';
import { getFilteredPeople } from '../services/people.service';

export const getPeople = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const search = req.query.search as string || undefined;
    const hobbies = (req.query.hobbies as string)?.split(',') || undefined;
    const nationality = req.query.nationality as string || undefined;

    const result = await getFilteredPeople({ page, limit, search, hobbies, nationality });

    res.json(result);
  } catch (error) {
    console.error('Error fetching people:', error);
    res.status(500).json({ message: 'Error fetching people' });
  }
};