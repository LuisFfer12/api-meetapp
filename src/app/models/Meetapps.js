import Sequelize, { Model } from 'sequelize';
import { isBefore } from 'date-fns';

class Meetapps extends Model {
  static init(sequelize) {
    super.init(
      {
        date: Sequelize.DATE,
        description: Sequelize.STRING,
        location: Sequelize.STRING,
        title: Sequelize.STRING,
        past: {
          type: Sequelize.VIRTUAL,
          get() {
            return isBefore(this.date, new Date());
          },
        },
      },
      {
        sequelize,
      }
    );

    return this;
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id' });
    this.belongsTo(models.File, { foreignKey: 'file_id' });
  }
}

export default Meetapps;
