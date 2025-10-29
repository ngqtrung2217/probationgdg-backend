/**
 * functions to capitalize first letter
 * @param {string} str
 * @returns {string}
 */
const capitalize = (str) => {
  if (!str) return "";
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * function to capitalize first word
 * @param {string} str
 * @returns {string}
 */
const capitalizeWords = (str) => {
  if (!str) return "";
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => capitalize(word))
    .join(" ");
};

/**
 * function to truncate string
 * @param {string} str
 * @param {number} length
 * @param {string} ending
 * @returns {string}
 */
const truncate = (str, length = 50, ending = "...") => {
  if (!str) return "";
  if (str.length <= length) return str;
  return str.substring(0, length - ending.length) + ending;
};

/**
 * function to remove extra spaces
 * @param {string} str
 * @returns {string}
 */
const removeExtraSpaces = (str) => {
  if (!str) return "";
  return str.trim().replace(/\s+/g, " ");
};

/**
 * function to validate email
 * @param {string} email
 * @returns {boolean}
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * function to validate Vietnamese phone number
 * @param {string} phone
 * @returns {boolean}
 */
const isValidPhoneVN = (phone) => {
  const phoneRegex = /^(0|\+84)[1-9]\d{8}$/;
  return phoneRegex.test(phone.replace(/\s+/g, ""));
};

/**
 * function to create slug from text
 * @param {string} text
 * @returns {string} Slug
 */
const toSlug = (text) => {
  if (!text) return "";
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]/g, "")
    .replace(/\-+/g, "-")
    .replace(/^-+|-+$/g, "");
};

/**
 * function to escape HTML
 * @param {string} str
 * @returns {string}
 */
const escapeHTML = (str) => {
  if (!str) return "";
  const map = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return str.replace(/[&<>"']/g, (char) => map[char]);
};

module.exports = {
  capitalize,
  capitalizeWords,
  truncate,
  removeExtraSpaces,
  isValidEmail,
  isValidPhoneVN,
  toSlug,
  escapeHTML,
};
