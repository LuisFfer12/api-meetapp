import { Op } from 'sequelize';
import { startOfDay, endOfDay, parseISO } from 'date-fns';
import Meetups from '../models/Meetups';
import User from '../models/User';

class ListAllMeetups {
  async index(req, res) {
    const { page } = req.query;

    const searchDate = parseISO(req.query.date);

    const meetups = await Meetups.findAll({
      where: {
        date: {
          [Op.between]: [startOfDay(searchDate), endOfDay(searchDate)],
        },
      },
      order: ['date'],
      limit: 10,
      offset: (page - 1) * 10,
      attributes: ['id', 'description', 'location', 'title', 'date'],
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'email'],
        },
      ],
    });
    return res.json(meetups);
  }
}

export default new ListAllMeetups();
