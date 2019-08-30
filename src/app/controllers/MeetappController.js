import * as Yup from 'yup';
import { isBefore, parseISO } from 'date-fns';
import Meetapps from '../models/Meetapps';

class MeetappControler {
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

    const meetup = await Meetapps.create({
      ...req.body,
      user_id,
    });

    return res.json(meetup);
  }

  async update(req, res) {
    const meetapp = await Meetapps.findByPk(req.params.meetappId);

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
    const meetapps = await Meetapps.findAll({
      where: {
        user_id: req.userId,
      },
      attributes: ['id', 'description', 'title', 'location', 'date'],
    });
    return res.json(meetapps);
  }

  async delete(req, res) {
    const meetapp = await Meetapps.findByPk(req.params.meetappId);

    if (!meetapp || meetapp.past) {
      return res.json({ error: 'meetapp does not exist or happened' });
    }

    if (meetapp.user_id !== req.userId) {
      return res.json({
        error: 'you dont have permission to edit this meetapp',
      });
    }

    await meetapp.destroy();
    return res.json({ ok: 'true' });
  }
}

export default new MeetappControler();
