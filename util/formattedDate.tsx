import moment from 'moment';

export function formattedDate(date?: Date) {
  return moment(date).utc().format('DD/MM/YYYY');
}
