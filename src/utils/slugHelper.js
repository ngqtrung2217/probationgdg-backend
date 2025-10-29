/**
 * functions to generate slugs and unique codes
 * @param {string} text
 * @returns {string}
 *
 */
const generateSlug = (text) => {
  if (!text) return "";

  return text
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]/g, "")
    .replace(/\-+/g, "-")
    .replace(/^-+|-+$/g, "");
};

/**
 * function to generate unique slug
 * @param {string} text
 * @returns {string}
 */
const generateUniqueSlug = (text) => {
  const baseSlug = generateSlug(text);
  const timestamp = Date.now();
  return `${baseSlug}-${timestamp}`;
};

/**
 * function to generate unique code
 * @param {string} prefix
 * @returns {string}
 */
const generateCode = (prefix = "") => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9).toUpperCase();
  return `${prefix}-${timestamp}-${random}`.replace(/^-/, "");
};

module.exports = {
  generateSlug,
  generateUniqueSlug,
  generateCode,
};
