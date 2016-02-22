//(function() { // DON'T EDIT BELOW THIS LINE
//var d = document, s = d.createElement('script');
//
//s.src = '//localtest24.disqus.com/embed.js';
//
//s.setAttribute('data-timestamp', +new Date());
//(d.head || d.body).appendChild(s);
//})();


// Enable or reset Disqus for this page as required, with optional SSO.
// There must be a div with id "disqus_thread" when called.
//
// config is required and should have the format:
//
//  {
//    shortname:  "..",
//    title:      "..",
//    identifier: "..",
//    url:        ".."
//  }
//
//  config.shortname *should not* change between invocations.
//

function enableDisqus(config) {

  if (enableDisqus.loaded) {

    DISQUS.reset({
      reload: true,
      config: function () {
        this.page.identifier = config.identifier;
        this.page.url        = config.url;
        this.page.title      = config.title;
      }
    });
    console.log(config);
  } else {
    var body = "var disqus_shortname  = \"" + config.shortname  + "\";\n" +
               "var disqus_title      = \"" + config.title      + "\";\n" +
               "var disqus_identifier = \"" + config.identifier + "\";\n" +
               "var disqus_url        = \"" + config.url        + "\";\n";
    if (config.developer) {
      body +=  "var disqus_developer  = 1;\n"
    }
    appendScriptTagWithBody(body);

    (function() {
      var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
      dsq.src = 'http://' + disqus_shortname + '.disqus.com/embed.js';
      (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
    })();


    enableDisqus.loaded = true;
  }
}

function appendScriptTagWithBody(body) {
  var dso   = document.createElement("script");
  dso.type  = "text/javascript";
  dso.async = true;
  dso.text  = body;
  console.log(body);
  document.getElementsByTagName('body')[0].appendChild(dso);
}
