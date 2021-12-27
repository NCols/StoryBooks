// Handlebar helpers

const moment = require('moment');

module.exports = {
  formatDate: function (date, format) {
    return moment(date).format(format);
  },
  // Truncate the body of a story to display snippet on cards
  truncate: function (str, len) {
    if (str.length > len && str.length > 0) {
      let new_str = str + ' '
      new_str = str.substr(0, len)
      new_str = str.substr(0, new_str.lastIndexOf(' '))
      new_str = new_str.length > 0 ? new_str : str.substr(0, len)
      return new_str + '...'
    }
    return str
  },
  stripTags: function (input) {
    // Remove all html tags (search with regex and replace with '')
    return input.replace(/<(?:.|\n)*?>/gm, '')
  },
  editIcon: function (storyUser, loggedUser, storyId, floating = true) { // 'floating' in Materialize applies to a floating button only on the cards. So we want to check if the floating param is true, meaning we're on the dashboard with all the stories/cards, so display more stylish floating button, but if we're on the individual story, no need for floating button -> 'else return ...'
    if (storyUser._id.toString() == loggedUser._id.toString()) {
      if (floating) {
        return `<a href="/stories/edit/${storyId}" class="btn-floating halfway-fab blue"><i class="fas fa-edit fa-small"></i></a>`;
      } else {
        return `<a href="/stories/edit/${storyId}"><i class="fas fa-edit"></i></a>`;
      }
    } else {
      return '';
    }
  },
  // used in edit.hbs to put the status of the story in the selector on the edit form. This is the handler, on edit.hbs use it with {{#select}}
  select: function (selected, options) {
    return options
      .fn(this)
      .replace(
        new RegExp(' value="' + selected + '"'),
        '$& selected="selected"'
      )
      .replace(
        new RegExp('>' + selected + '</option>'),
        ' selected="selected"$&'
      )
  },
}