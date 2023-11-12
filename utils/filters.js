const { DateTime } = require('luxon')
const CleanCSS = require('clean-css')

module.exports = {
  dateToFormat: function (date, format) {
    return DateTime.fromJSDate(date, { zone: 'utc' }).toFormat(String(format))
  },

  readableDate: function (date, format) {
    // stockholm timezone
    const dt = DateTime.fromJSDate(date, { zone: 'UTC+1' })
    if (!format) {
      format = dt.hour + dt.minute > 0 ? 'dd LLL yyyy - HH:mm' : 'dd LLL yyyy'
    }
    return dt.toFormat(format)
  },

  dateToISO: function (date) {
    return DateTime.fromJSDate(date, { zone: 'utc' }).toISO({
      includeOffset: false,
      suppressMilliseconds: true
    })
  },

  obfuscate: function (str) {
    const chars = []
    for (var i = str.length - 1; i >= 0; i--) {
      chars.unshift(['&#', str[i].charCodeAt(), ';'].join(''))
    }
    return chars.join('')
  },

  //Inline and minify stylesheet
  cssmin: function (code) {
    return new CleanCSS({
      level: 2
    }).minify(code).styles
  },

  // Return all the tags used in a collection
  getAllTags: function (collection) {
    let tagSet = new Set()
    for (let item of collection) {
      ;(item.data.tags || []).forEach((tag) => tagSet.add(tag))
    }
    return Array.from(tagSet)
  },

  // Filter away page tags etc.
  filterTagList: function filterTagList(tags) {
    return (tags || []).filter((tag) => ['link', 'sdf'].indexOf(tag) === -1)
  },

  // Add file extension
  setExt: function (path, ext) {
    if (!ext) {
      return path
    }
    return path.substr(0, path.lastIndexOf('.')) + `.${ext}`
  }
}
