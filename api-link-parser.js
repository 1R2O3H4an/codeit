
// decodes cde.run links

// eg.
// https://cde.run/mrdoob/three.js/examples/physics_ammo_break.html
// or
// https://cde.run/https://github.com/mrdoob/three.js/blob/dev/examples/physics_ammo_break.html


// mrdoob/three.js/examples/physics_ammo_break.html
// mrdoob, three.js, examples, physics_ammo_break.html

// mrdoob/three.js:dev/examples/physics_ammo_break.html

// decode link
function decodeLink(url) {

  // save link data

  url = decodeURIComponent(url);

  const isEmbed = url.endsWith('&embed=true');
  if (isEmbed) url = url.slice(0, -('&embed=true'.length));

  const isDev = url.startsWith('https://dev.cde.run/');

  if (!isDev) url = url.slice('https://cde.run/'.length);
  else url = url.slice('https://dev.cde.run/'.length);
  
  const isGithub = url.startsWith('https://github.com/');
  if (isGithub) url = url.slice('https://github.com/'.length);
  
  
  let baseURL = 'https://dev.codeit.codes';
  if (isDev) baseURL = 'https://dev.codeit.codes';


  let linkData = {};
  let link = url.split('/');


  // if link exists
  if (link.length > 1) {

    linkData.user = link[0];
    linkData.repo = link[1];

    linkData.contents = url.slice((linkData.user + '/' + linkData.repo).length);
    
    if (linkData.contents.endsWith('/')) {
      
      linkData.contents = linkData.contents.slice(0, -1);
      
    }
    
    
    // if link includes a Github URL
    if (isGithub) {
      
      linkData.contents = linkData.contents.slice('/blob'.length);
      
      // if link includes a branch
      if (link[3]) {
        
        linkData.repo += ':' + link[3];
        
        linkData.contents = linkData.contents.slice(('/' + link[3]).length);
        
      }
      
    }


    const lastEntry = link[link.length - 1];

    // if linking to file
    if (lastEntry.split('.').length > 1) {

      linkData.file = lastEntry;
      linkData.contents = linkData.contents.slice(0, (-lastEntry.length - 1));

      // if linked file can be viewed live
      if (lastEntry.endsWith('.html') || lastEntry.endsWith('.svg')) {

        // show file in live view
        linkData.openLive = true;

      } // else, show the file's code

    } else { // if linking to directory

      // if link is embed
      if (!isEmbed) {

        // show directory link
        linkData.redirect = baseURL + '/full?dir=' +
          linkData.user + ',' + linkData.repo +
          ',' + linkData.contents;

      } // else, show directory

    }

  } else {

    // show codeit link
    linkData.redirect = baseURL.slice(0, -('/full'.length));

  }
  
  
  // build link from data
  
  let resp = baseURL;
  
  // if redirect exists
  if (linkData.redirect) {
    
    resp += '/api/redirect?to=' + linkData.redirect;
    
  } else {

    resp += '/full?dir=' +
            linkData.user + ',' + linkData.repo +
            ',' + linkData.contents;
    
    // if file exists
    if (linkData.file) {
      
      resp += '&file=' + linkData.file;
      
      // if live view flag exists
      if (linkData.openLive) {
        
        resp += '&openLive=true';
        
      }
      
    }
    
  }
  
  
  return resp;

}

