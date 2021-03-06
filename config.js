$(function() {

  CMS.init({

    // Name of your site or location of logo file ,relative to root directory (img/logo.png)
    siteName: 'James Pryor',

    // Tagline for your site
    siteTagline: '',

    // Email address
    siteEmail: 'james@geekwagon.net',

    // Name
    siteAuthor: 'James Pryor',

    // Navigation items
    siteNavItems: [
      {name: 'Blog',  href: '/', newWindow: false},
      {name: 'Resume', href: 'http://deplicator.github.io', newWindow: false},
      {name: 'About', href: '/?page=about', newWindow: false}
    ],

    // Posts folder name
    postsFolder: 'blog',

    // Homepage posts snippet length
    postSnippetLength: 120,

    // Pages folder name
          pagesFolder: 'pages',

          // Order of sorting (true for newest to oldest)
          sortDateOrder: true,

    // Site fade speed
    fadeSpeed: 300,

    // Site footer text
    footerText: '',

    // Mode 'Github' for Github Pages, 'Apache' for Apache server. Defaults
    // to Github
    mode: 'Apache',

    // If Github mode is set, your Github username and repo name. Defaults
    // to Github pages branch (gh-pages)
    githubUserSettings: {
      username: 'yourusername',
      repo: 'yourrepo'
    }

  });

  // Markdown settings
  marked.setOptions({
    renderer: new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: false,
    smartLists: true,
    smartypants: false
  });

});
