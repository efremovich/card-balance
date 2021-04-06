import Vue from 'vue';
import { isToday } from './utils';

Vue.filter('formatDate', (value, withtime = true) => {
  value = new Date(value);
  let options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',

  };

  if (withtime) {
    options = {
      timeZone: 'UTC',
      hours: 'numeric',
      min: 'numeric',
    };
  }
  return value.toLocaleString('ru-RU', options);
});

Vue.filter('date', (value, fullDate = false) => {
  value = String(value);

  const date = value.slice(8, 10).trim();
  const month = value.slice(4, 7).trim();
  const year = value.slice(11, 15);

  if (!fullDate) return `${date} ${month}`;
  return `${date} ${month} ${year}`;
});

// eslint-disable-next-line consistent-return
Vue.filter('time', (value, is24HrFormat = true) => {
  if (value) {
    const date = new Date(Date.parse(value));
    let hours = date.getHours();
    const min = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
    if (!is24HrFormat) {
      const time = hours > 12 ? 'AM' : 'PM';
      hours = hours % 12 || 12;
      return `${hours}:${min} ${time}`;
    }
    return `${hours}:${min}`;
  }
});

Vue.filter('title', (value, replacer = '_') => {
  if (!value) return '';
  value = value.toString();

  const arr = value.split(replacer);
  // eslint-disable-next-line camelcase
  const capitalized_array = [];
  arr.forEach((word) => {
    const capitalized = word.charAt(0).toUpperCase() + word.slice(1);
    capitalized_array.push(capitalized);
  });
  return capitalized_array.join(' ');
});

export const kFormatter = (num) => (num > 999 ? `${(num / 1000).toFixed(1)} тыс` : num);

export const title = (value, replacer = ' ') => {
  if (!value) return '';
  const str = value.toString();

  const arr = str.split(replacer);
  const capitalizedArray = [];
  arr.forEach((word) => {
    const capitalized = word.charAt(0).toUpperCase() + word.slice(1);
    capitalizedArray.push(capitalized);
  });
  return capitalizedArray.join(' ');
};

export const avatarText = (value) => {
  if (!value) return '';
  const nameArray = value.split(' ');
  return nameArray.map((word) => word.charAt(0).toUpperCase()).join('');
};

/**
 * Format and return date in Humanize format
 * Intl docs: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/format
 * Intl Constructor: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat/DateTimeFormat
 * @param {String} value date to format
 * @param {Object} formatting Intl object to format with
 */
export const formatDate = (value, formatting = { month: 'long', year: 'numeric' }, locale = 'ru-RU') => {
  if (!value) return value;
  return new Intl.DateTimeFormat(locale, formatting).format(new Date(value));
};

/**
 * Return short human friendly month representation of date
 * Can also convert date to only time if date is of today (Better UX)
 * @param {String} value date to format
 * @param {Boolean} toTimeForCurrentDay Shall convert to time if day is today/current
 */
export const formatDateToMonthShort = (value, toTimeForCurrentDay = true) => {
  const date = new Date(value);
  let formatting = {
    month: 'short',
    day: 'numeric',
  };

  if (toTimeForCurrentDay && isToday(date)) {
    formatting = {
      hour: 'numeric',
      minute: 'numeric',
    };
  }

  return new Intl.DateTimeFormat('en-US', formatting).format(new Date(value));
};

// Strip all the tags from markup and return plain text
export const filterTags = (value) => value.replace(/<\/?[^>]+(>|$)/g, '');
