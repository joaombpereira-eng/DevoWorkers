import moment from 'moment';

export const formattedDate = (date?: Date) => {
  return moment(date).utc().format('DD/MM/YYYY');
};
