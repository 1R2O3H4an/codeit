
export default function handler(request, response) {
  
  const query = request.query;

  let title = 'Codeit | Mobile code editor connected to Git';

  if (query.url) {
    
    // parse URL
    let url = query.url.replace('https://cde.run/', '').replace('https://dev.cde.run/', '');
    
    url = url.split('/');
    
    if (url[0] && url[1]) {
      
      if (url[url.length-1].endsWith('.html')
          || url[url.length-1].endsWith('.svg')) {
            
        title = 'Run ' + url[0] + '/' + url[1] + ' with Codeit';
      
      } else {
        
        title = 'Open ' + url[0] + '/' + url[1] + ' with Codeit';
        
      }
      
    }
    
  }



const html = `
<!DOCTYPE html>
<html style="background: #313744" translate="no">
<head>
  
  <title>Codeit</title>

  <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no,viewport-fit=cover,shrink-to-fit=no">

  <meta name="mobile-web-app-capable" content="yes">
  <meta name="theme-color" content="#313744">

  <meta name="apple-mobile-web-app-status-bar-style" content="#313744">
  <meta name="apple-mobile-web-app-title" content="Codeit">

  <meta http-equiv="origin-trial" content="At6bIDqQqUBcNVY46zIFOhsfQekTjYXogHK35lCdfrpna6/wqhxQsIh+kfTDRcLVPP0jyfFX5gTbBM4trLnn4g0AAABqeyJvcmlnaW4iOiJodHRwczovL2NvZGVpdC5jb2Rlczo0NDMiLCJmZWF0dXJlIjoiV2ViQXBwVXJsSGFuZGxpbmciLCJleHBpcnkiOjE2NDMxNTUxOTksImlzU3ViZG9tYWluIjp0cnVlfQ==">

  <meta charset="utf-8">
  <meta name="description" content="Codeit runs on the web, open source, and free. Supports HTML, CSS, JavaScript, Python, Bootstrap, XML and more. Easy to use without how to.">
  
  <meta property="og:title" content="Codeit | Mobile code editor connected to Git">
  <meta property="og:description" content="Codeit runs on the web, open source, and free. Supports HTML, CSS, JavaScript, Python, Bootstrap, XML and more. Easy to use without how to.">
  <meta property="og:url" content="https://codeit.codes">
  <meta property="og:image" content="https://codeit.codes/images/banner-og.png">
  <meta property="og:type" content="application">
  <meta property="og:site_name" content="Codeit Code Editor">
  
  <meta property="twitter:title" content="Codeit | Mobile code editor connected to Git">
  <meta property="twitter:account_id" content="1484271514543345665">
  <meta name="twitter:card" content="summary_large_image">
  <meta property="twitter:domain" content="codeit.codes">
  <meta property="twitter:url" content="https://codeit.codes">
  <meta name="twitter:description" content="Codeit runs on the web, open source, and free. Supports HTML, CSS, JavaScript, Python, Bootstrap, XML and more. Easy to use without how to.">
  <meta name="twitter:image" content="https://codeit.codes/images/banner-og.png">
  
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="referrer" content="origin-when-cross-origin">
  <meta name="keywords" content="code editor, version control tools, source code versioning, source code management tools, python, jquery demo, html, git, how to, bootstrap, jquery, javascript, javascript tutorial, javascript tutorial for beginners, javascript programming, html web form, create form in html, responsive web design, html web design, html design, responsive website development, html5 tutorial, html5 css3, html5 development, web design software, web development software, git tutorial, git howto, git repository, git command, git source code, top programming languages to learn, best programming language, best computer language, open source, open source code, open source applications, source code editor, software development tools, development tool, software developer tools list, programmer tool, web application development software">
  <link rel="canonical" href="https://codeit.codes/">
  <meta name="next-head-count" content="24">
  <meta name="robots" content="all">
  
  <link rel="shortcut icon" href="https://codeit.codes/icons/android-app-512.png">
  <link rel="apple-touch-icon" href="https://codeit.codes/icons/iphone-app-180.png">
  
  <script src="/api-link-parser.js"></script>
  
  <script>

  // decode link
  const link = (new URL(window.location.href)).searchParams.get('url');
  
  if (link) {
    
    const resp = decodeLink(link);

    // redirect to decoded URL
    //window.location.href = resp;
    console.log(resp);
    
  } else {
    
    window.location.href = window.location.origin;
    
  }

  /*
  (() => {

    let openGraphTitle = 'Codeit - Mobile code editor';

    // update open graph title
    if (linkData.openLive) {

      openGraphTitle = 'Run ' + linkData.dir[0] + '/' + linkData.dir[1].split(':')[0] + ' with Codeit.';

    } else if (linkData.dir) {

      openGraphTitle = 'Open ' + linkData.dir[0] + '/' + linkData.dir[1].split(':')[0] + ' with Codeit.';

    }

    const titleEl1 = document.head.querySelector('meta[property="og:title"]');
    const titleEl2 = document.head.querySelector('meta[property="twitter:title"]');

    titleEl1.content = openGraphTitle;
    titleEl2.content = openGraphTitle;

  })();*/
  </script>
  
</head>
</html>
`;



  response.status(200).send(html);
  
}

