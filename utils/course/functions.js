// @ts-check

const { GetValue, Update, GetTable, Delete } = require("../../db/local");

/**
 * It takes in a title, url, price, description, and photo, and then it saves it to the database
 * @param {string} id - course id
 * @param {string} title - course title
 * @param {string} url - https://www.udemy.com/course/the-complete-javascript-course/
 * @param {string} price - number
 * @param {string} description - "This is a description"
 * @param {string} photo - https://www.google.com/url?sa=i&amp;url=https%3A%2F%2Fwww.pexels.com%2Fsearch%2Fcourse%2F&amp;psig=AOvVaw3-_Q
 * @returns an object with a status and data property.
 */
const save = async (id, title, url, price, description, photo) => {
  try {
    let courseData = GetValue("courses", id.toLowerCase());
    courseData = { title, url, price, description, photo };
    Update("courses", id.toLocaleLowerCase(), courseData);
    return { status: 200, data: { id, title, url, price, description, photo } };
  } catch (err) {
    return { error: String(err) };
  }
};

/**
 * It takes a title as an argument, and returns an object with a status code and data property.
 * @param {string} title - The title of the course you want to fetch.
 * @returns An object with a status property and a data property.
 */
const fetch = async (title) => {
  try {
    const titleData = GetValue("courses", title.toLowerCase());
    if (titleData) {
      const { title, url, price, description, photo } = titleData;
      return {
        status: 200,
        data: {
          title,
          url,
          price,
          description,
          photo,
        },
      };
    }
    return { error: "not found" };
  } catch (err) {
    return { error: String(err) };
  }
};

/**
 * @param {string} id - course id
 * @returns An object with a status property and a data property.
 */
const deleteCourse = async (id) => {
  try {
    const titleData = GetValue("courses", id.toLowerCase());
    console.log(titleData, id);
    if (titleData) {
      Delete("courses", id.toLowerCase());
      return {
        status: 200,
        data: { id },
      };
    }
    return { error: "not found" };
  } catch (err) {
    return { error: String(err) };
  }
};

/**
 *
 * @returns all menus data
 */
const fetchAll = async () => {
  try {
    const courses = GetTable("courses");
    return {
      status: 200,
      data: {
        courses,
      },
    };
  } catch (err) {
    return { error: String(err) };
  }
};

module.exports = {
  save,
  fetch,
  fetchAll,
  deleteCourse,
};
