/**
 * functions to get date
 * @returns {Date}
 */
const getCurrentDate = () => new Date();

/**
 * function to add days to a date
 * @param {Date} date
 * @param {number} days
 * @returns {Date}
 */
const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

/**
 * function to subtract days from a date
 * @param {Date} date
 * @param {number} days
 * @returns {Date}
 */
const subtractDays = (date, days) => {
  return addDays(date, -days);
};

/**
 * function to check if a date is expired
 * @param {Date} expireDate
 * @returns {boolean}
 */
const isExpired = (expireDate) => {
  return new Date() > new Date(expireDate);
};

/**
 * function to format date to string
 * @param {Date} date
 * @param {string} format - Format ('DD/MM/YYYY', 'YYYY-MM-DD')
 * @returns {string}
 */
const formatDate = (date, format = "YYYY-MM-DD") => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  const seconds = String(d.getSeconds()).padStart(2, "0");

  const replacements = {
    YYYY: year,
    MM: month,
    DD: day,
    HH: hours,
    mm: minutes,
    ss: seconds,
  };

  let result = format;
  Object.entries(replacements).forEach(([key, value]) => {
    result = result.replace(new RegExp(key, "g"), value);
  });

  return result;
};

/**
 * function to get time remaining
 * @param {Date} targetDate
 * @returns {object}
 */
const getTimeRemaining = (targetDate) => {
  const target = new Date(targetDate).getTime();
  const now = new Date().getTime();
  const difference = target - now;

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
};

module.exports = {
  getCurrentDate,
  addDays,
  subtractDays,
  isExpired,
  formatDate,
  getTimeRemaining,
};
