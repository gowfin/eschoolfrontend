import moment from 'moment';

const formatDate = (date) => {
  const dateFormat = moment.localeData().longDateFormat('L');
  // alert(dateFormat);
// const dateFormat = 'YYYY/MM/DD';
  date = moment().format(dateFormat);
//  alert(date);
  // Ensure the input date is correctly parsed into a moment object
  const parsedDate = moment(date, ['YYYY/MM/DD', 'YYYY-MM-DD']);
  if (!parsedDate.isValid()) {
    return ''; // Return an empty string for invalid dates
  }
  // return parsedDate.format('YYYY-MM-DD');
  return parsedDate.format('YYYY-MM-DD');
 
};
export default formatDate;