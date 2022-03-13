
// worker-side
// service worker/client communication channel


// update worker name when updating worker
const WORKER_NAME = 'codeit-worker-v387';


// internal paths
const INTERNAL_PATHS = {
    
  internal: 'https://codeit.codes/',
  internal_: 'https://dev.codeit.codes/',
  
  run: 'https://codeit.codes/run',
  run_: 'https://dev.codeit.codes/run'
  
}


// get path type
function getPathType(path) {
  
  let pathType = 'external';
  
  Object.entries(INTERNAL_PATHS).forEach(type => {
    
    if (path.startsWith(type[1])) {
      
      pathType = type[0].replace('_', '');
      
      return;
      
    }
    
  });
  
  return pathType;
  
}


// worker log
function workerLog(log) {
  
  workerChannel.postMessage({
    message: log,
    type: 'message'
  });
  
}


// create worker channel
const workerChannel = new BroadcastChannel('worker-channel');


// create Response from data
function createResponse(data, type, status) {
    
  // create Response from data
  const response = new Response(data, {
    headers: {'Content-Type': type},
    status: status
  });
    
  return response;

}


// send fetch request to client
function sendRequestToClient(request) {

  return new Promise((resolve, reject) => {

    // send request to client
    workerChannel.postMessage({
      url: request.url,
      type: 'request'
    });
    
    console.log('[ServiceWorker] Sent fetch request to client');
  
  
    // add worker/client channel listener
    
    function workerListener(event) {
      
      // if response url matches
      if (event.data.type === 'response' &&
        event.data.url === request.url) {
        
        console.log('[ServiceWorker] Recived response data from client', event.data);

        // remove channel listener
        workerChannel.removeEventListener('message', workerListener);

        // create Response from data
        const response = createResponse(event.data.resp, event.data.respType, event.data.respStatus);

        console.log('[ServiceWorker] Resolved request with client response');

        // resolve promise with Response
        resolve(response);

      }

    }
    
    workerChannel.addEventListener('message', workerListener);
    
  });

}


// handle fetch request
function handleFetchRequest(request) {
    
  return new Promise(async (resolve, reject) => {

    // get request path type
    const pathType = getPathType(request.url);
      
    // if fetch originated in codeit itself
    if (pathType === 'internal'
        && (getPathType(request.referrer) !== 'run')) {
  
      let url = request.url;
      
      // append .html to url if requesting full.html
      if (url.endsWith('/full')) url += '.html';
      
      // return response from cache
      resolve(caches.match(url));
  
    } else if (pathType === 'run'
               || (getPathType(request.referrer) === 'run')) { // if fetch originated in live view
  
      console.log('[ServiceWorker] Intercepted live fetch', request.url, request);
    
      // return response from client
      resolve(sendRequestToClient(request));
  
    } else { // if fetch is external
    
      // return response from network
      resolve(fetch(request));
  
    }
    
  });

}


// add fetch listener
self.addEventListener('fetch', (evt) => {
  
  evt.respondWith(handleFetchRequest(evt.request));

});

