import moment from 'moment';

const formatDate = (date) => {
  // Ensure the input date is correctly parsed into a moment object
  const parsedDate = moment(date, ['YYYY/MM/DD', 'YYYY-MM-DD']);
  if (!parsedDate.isValid()) {
    return ''; // Return an empty string for invalid dates
  }
  return parsedDate.format('YYYY-MM-DD');
 
};
export default formatDate;