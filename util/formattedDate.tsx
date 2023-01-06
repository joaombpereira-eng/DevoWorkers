import moment from 'moment';

export function formattedDate(date?: Date) {
  return moment(date).utc().format('MM/DD/YYYY');
}
