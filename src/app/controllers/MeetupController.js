import * as Yup from 'yup';
import { isBefore, parseISO } from 'date-fns';
import Meetups from '../models/Meetups';

class MeetupControler {
  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      file_id: Yup.number().required(),
      description: Yup.string().required(),
      location: Yup.string().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    if (isBefore(parseISO(req.body.date), new Date())) {
      return res.status(400).json({ error: 'Past dates are not permited' });
    }

    const user_id = req.userId;

    const meetup = await Meetups.create({
      ...req.body,
      user_id,
    });

    return res.json(meetup);
  }

  async update(req, res) {
    const meetapp = await Meetups.findByPk(req.params.meetappId);

    if (!meetapp || meetapp.past) {
      return res.json({ error: 'meetapp does not exist or happened' });
    }

    if (meetapp.user_id !== req.userId) {
      return res.json({
        error: 'you dont have permission to edit this meetapp',
      });
    }

    const { title, description } = await meetapp.update(req.body);
    return res.json({
      title,
      description,
    });
  }

  async index(req, res) {
    const meetups = await Meetups.findAll({
      where: {
        user_id: req.userId,
      },
      attributes: ['id', 'past', 'description', 'title', 'location', 'date'],
    });
    return res.json(meetups);
  }

  async delete(req, res) {
    const meetup = await Meetups.findByPk(req.params.meetappId);

    if (!meetup || meetup.past) {
      return res.json({ error: 'meetup does not exist or happened' });
    }

    if (meetup.user_id !== req.userId) {
      return res.json({
        error: 'you dont have permission to edit this meetapp',
      });
    }

    await meetup.destroy();
    return res.send();
  }
}

export default new MeetupControler();
