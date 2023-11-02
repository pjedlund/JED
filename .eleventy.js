const pluginRss = require('@11ty/eleventy-plugin-rss')
const pluginNavigation = require('@11ty/eleventy-navigation')
const pluginSyntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight')
const pluginEmbedEverything = require('eleventy-plugin-embed-everything')
const pluginEleventyTOC = require('eleventy-plugin-nesting-toc')
const pluginSvgSprite = require('eleventy-plugin-svg-sprite')
const { minify } = require('terser')

const markdownIt = require('markdown-it')
const markdownItAttrs = require('markdown-it-attrs')
const markdownItFootnote = require('markdown-it-footnote')
const markdownItAnchor = require('markdown-it-anchor')
const markdownItToCDoneRight = require('markdown-it-toc-done-right')

const shortcodes = require('./utils/shortcodes.js')
const filters = require('./utils/filters.js')
const transforms = require('./utils/transforms.js')

const IS_PRODUCTION = process.env.ELEVENTY_ENV === 'production'

const CONTENT_GLOBS = {
  posts: 'src/posts/**/*.md',
  photos: 'src/photos/**/*.md',
  drafts: 'src/drafts/**/*.md',
  notes: 'src/notes/**/*.md',
  media: '*.jpg|*.jpeg|*.png|*.gif|*.mp4|*.webp|*.webm|*.avif'
}

module.exports = function (eleventyConfig) {
  // Collection: posts
  eleventyConfig.addCollection('allposts', function (collection) {
    return collection.getFilteredByGlob(CONTENT_GLOBS.posts)
  })
  // Collection: notes
  eleventyConfig.addCollection('allnotes', function (collection) {
    return collection.getFilteredByGlob(CONTENT_GLOBS.notes)
  })
  // Collection: notes
  eleventyConfig.addCollection('allpostsandnotes', function (collection) {
    return collection
      .getFilteredByGlob([CONTENT_GLOBS.posts, CONTENT_GLOBS.notes])
      .filter((item) => item.data.featured)
      .sort((a, b) => b.date - a.date)
  })

  // Collection: photos
  eleventyConfig.addCollection('allphotos', function (collection) {
    return collection.getFilteredByGlob(CONTENT_GLOBS.photos)
  })

  // Collection: All Posts and Notes and Photos
  eleventyConfig.addCollection('alltagsections', function (collection) {
    return (
      collection
        .getFilteredByGlob([
          CONTENT_GLOBS.posts,
          CONTENT_GLOBS.notes,
          CONTENT_GLOBS.photos
        ])
        //.filter((item) => item.data.featured)
        .sort((a, b) => b.date - a.date)
    )
  })

  // Return all the tags used in a collection
  eleventyConfig.addFilter('getAllTags', (collectionAPI) => {
    let tagSet = new Set()
    for (let item of collectionAPI) {
      ;(item.data.tags || []).forEach((tag) => tagSet.add(tag))
    }
    return Array.from(tagSet)
  })

  // Plugins
  eleventyConfig.addPlugin(pluginRss, {
    posthtmlRenderOptions: {
      closingSingleTag: 'default' // opt-out of <img/>-style XHTML single tags
    }
  })
  eleventyConfig.addPlugin(pluginNavigation)
  eleventyConfig.addPlugin(pluginSyntaxHighlight)
  eleventyConfig.addPlugin(pluginEmbedEverything)
  eleventyConfig.addPlugin(pluginEleventyTOC, {
    wrapper: 'div',
    tags: ['h2', 'h3', 'h4'],
    wrapperClass: 'toc'
  })

  eleventyConfig.addPlugin(
    pluginSvgSprite,
    {
      path: './src/_assets/icons/general',
      svgSpriteShortcode: 'iconsprite_general'
    },
    {
      path: './src/_assets/svg_2', // relative path to SVG directory
      svgSpriteShortcode: 'svgsprite2'
    }
  )

  // Shortcodes
  Object.keys(shortcodes).forEach((shortcodeName) => {
    eleventyConfig.addShortcode(shortcodeName, shortcodes[shortcodeName])
  })

  // Filters
  Object.keys(filters).forEach((filterName) => {
    eleventyConfig.addFilter(filterName, filters[filterName])
  })

  // Transforms
  Object.keys(transforms).forEach((transformName) => {
    eleventyConfig.addTransform(transformName, transforms[transformName])
  })

  // Markdown It and the myriad of plugins
  let markdownItOptions = {
    html: true,
    breaks: true,
    linkify: true,
    typographer: true
  }
  const anchorSlugify = (s) =>
    encodeURIComponent(
      'h-' +
        String(s)
          .trim()
          .toLowerCase()
          .replace(/[.,\/#!$%\^&\*;:{}=_`~()]/g, '')
          .replace(/\s+/g, '-')
    )
  let markdownLib = markdownIt(markdownItOptions)
    .use(markdownItAttrs)
    .use(markdownItFootnote)

    .use(markdownItAnchor, {
      //permalink: markdownItAnchor.permalink.headerLink({ safariReaderFix: true })
      permalink: true,
      permalinkSymbol: '#',
      permalinkClass: 'heading-anchor',
      permalinkBefore: true,
      permalinkAttrs: () => ({ 'aria-hidden': true }),
      level: 2,
      slugify: anchorSlugify
    })
    .use(markdownItToCDoneRight)
  //TODO:!! add [num] infront of footnotes
  markdownLib.renderer.rules.footnote_block_open = () =>
    '<section class="footnotes">\n' +
    '<h4 class="mt-3">Footnotes</h4>\n' +
    '<ol class="footnotes-list">\n'
  eleventyConfig.setLibrary('md', markdownLib)

  // Asset Watch Targets
  eleventyConfig.addWatchTarget('src/_assets')

  // Pass-through files
  eleventyConfig.addPassthroughCopy('src/robots.txt')
  eleventyConfig.addPassthroughCopy('src/humans.txt')
  eleventyConfig.addPassthroughCopy('src/site.webmanifest')
  eleventyConfig.addPassthroughCopy('src/_assets/fonts')
  eleventyConfig.addPassthroughCopy('src/_assets/images')
  eleventyConfig.addPassthroughCopy('src/_assets/icons')

  // Pass-through for post-images
  eleventyConfig.addPassthroughCopy(
    'src/posts/**/*.{jpg,jpeg,png,gif,mp4,webp,webm,avif,psd}',
    'src/notes/**/*.{jpg,jpeg,png,gif,mp4,webp,webm,avif}',
    'src/photos/**/*.{jpg,jpeg,png,gif,mp4,webp,webm,avif,psd}'
  )

  //investigate what the heck deep data merge is .:/.
  //eleventyConfig.setDataDeepMerge(false)
  //eleventyConfig.setQuietMode(true);

  return {
    passthroughFileCopy: true,

    dir: {
      input: 'src',
      output: '_site',
      includes: '_includes',
      layouts: '_layouts',
      data: '_data'
    },
    templateFormats: ['njk', 'md', '11ty.js'],
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk'
  }
}
