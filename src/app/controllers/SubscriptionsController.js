import { Op } from 'sequelize';
import Subscriptions from '../models/Subscriptions';
import User from '../models/User';
import Meetups from '../models/Meetups';
import Queue from '../../lib/Queue';
import SubscriptionMail from '../jobs/SubscriptionMail';

class SubscriptionsController {
  async store(req, res) {
    const user = await User.findByPk(req.userId);
    const meetapp = await Meetups.findByPk(req.params.meetappId, {
      include: [
        {
          model: User,
          // attributes: ['name', 'email'],
        },
      ],
    });

    const dupeSubscriptions = await Subscriptions.findOne({
      where: {
        user_id: user.id,
      },
      include: [
        {
          model: Meetups,
          required: true,
          where: {
            date: meetapp.date,
          },
        },
      ],
    });

    if (meetapp.past) {
      return res
        .status(401)
        .json({ error: 'You cant subscribe at past meetups :(' });
    }

    if (dupeSubscriptions) {
      return res
        .status(401)
        .json({ error: 'you cant subscribe at two same meetups' });
    }
    if (user.id === meetapp.user_id) {
      return res
        .status(401)
        .json({ error: 'You cant subscrib at your own meetup' });
    }

    await Queue.add(SubscriptionMail.key, {
      meetapp,
      user,
    });

    await Subscriptions.create({
      user_id: user.id,
      meetapp_id: meetapp.id,
    });

    return res.json(meetapp);
  }

  async index(req, res) {
    const subscriptions = await Subscriptions.findAll({
      where: {
        user_id: req.userId,
      },
      include: [
        {
          model: Meetups,
          where: {
            date: {
              [Op.gt]: new Date(),
            },
          },
          required: true,
          attributes: ['id', 'date', 'description', 'location', 'title'],
        },
      ],
      order: [[Meetups, 'date']],
      attributes: ['id'],
    });

    return res.json(subscriptions);
  }
}

export default new SubscriptionsController();
