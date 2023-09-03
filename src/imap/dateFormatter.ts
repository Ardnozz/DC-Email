function getDaysBefore(date: Date, days: number) {
  const dateBefore = date;

  dateBefore.setHours(0, 0, 0, 0);
  dateBefore.setDate(dateBefore.getDate() - days);

  return dateBefore;
}

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function dateToIMAPFormat(date: Date) {
  const day = date.getDate();
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  
  return `${day}-${month}-${year}`;
}

export { getDaysBefore, dateToIMAPFormat }