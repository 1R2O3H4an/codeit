
let modifiedFiles, selectedFile;

// create a file
function createFile(dir, sha, name, content, lang,
                    caretPos, scrollPos, eclipsed) {

  return {
    dir: dir,
    sha: sha,
    name: name,
    content: content,
    lang: lang,
    caretPos: caretPos,
    scrollPos: scrollPos,
    eclipsed: eclipsed
  }

}


// selected file

function changeSelectedFile(dir, sha, name, content, lang,
                            caretPos, scrollPos, eclipsed) {

  selectedFile = createFile(dir, sha, name, content, lang,
                            caretPos, scrollPos, eclipsed);

  updateSelectedFileLS();

}

function saveSelectedFileContent() {

  selectedFile.content = encodeUnicode(cd.textContent);

  updateSelectedFileLS();

}

function saveSelectedFileCaretPos() {

  const codeSel = cd.getSelection();
  selectedFile.caretPos = [codeSel.start, codeSel.end];

  updateSelectedFileLS();

}

function saveSelectedFileScrollPos() {

  selectedFile.scrollPos = [cd.scrollLeft, cd.scrollTop];

  updateSelectedFileLS();

}

function saveSelectedFileLang() {

  selectedFile.lang = cd.lang;

  updateSelectedFileLS();

}


// modified files

function addSelectedFileToModFiles() {

  modifiedFiles[selectedFile.sha] = selectedFile;

  updateModFilesLS();

}

function updateModFileContent(sha, content) {

  modifiedFiles[sha].content = content;

  updateModFilesLS();

}

function updateModFileCaretPos(sha, caretPos) {

  modifiedFiles[sha].caretPos = caretPos;

  updateModFilesLS();

}

function updateModFileScrollPos(sha, scrollPos) {

  modifiedFiles[sha].scrollPos = scrollPos;

  updateModFilesLS();

}

// when Git file is eclipsed (not updated) in browser private cache,
// store the updated file under old sha as key
// and store the updated file under new sha as key
// in modifiedFiles object for 1 minute after commit
function onFileEclipsedInCache(oldSha, newSha) {
  
  // if file element under old sha exists in HTML,
  // update it to the new sha
  const fileEl = fileWrapper.querySelector('.file[sha="' + oldSha + '"]');
  if (fileEl) setAttr(fileEl, 'sha', newSha);
  
  
  // store the updated file under old sha as key
  
  // find the eclipsed file
  let fileToUpdate = modifiedFiles[oldSha];

  fileToUpdate.sha = newSha;
  fileToUpdate.caretPos = [0, 0];
  fileToUpdate.eclipsed = true;
  
  // if file to update is selected
  if (selectedFile.sha === oldSha) {
    
    // update its content
    // to the selected file contents
    updateModFileContent(oldSha, selectedFile.content);
    
    // update selected file sha to the new sha
    selectedFile.sha = newSha;
     
    updateSelectedFileLS();
    
  }
  
  
  // store the updated file under new sha as key
  modifiedFiles[newSha] = fileToUpdate;
  
  
  // update modified files in local storage
  updateModFilesLS();
  
  
  // set 1 minute timeout to remove updated files
  window.setTimeout(() => {
    
    // remove the updated file under old sha as key
    // from modifiedFiles
    deleteModFile(oldSha);
    
    // if not edited updated file under new sha as key
    // while in timeout (file is still eclipsed)
    if (modifiedFiles[newSha] &&
        modifiedFiles[newSha].eclipsed) {
      
      // remove the updated file under new sha as key
      // from modifiedFiles
      deleteModFile(newSha);
      
    }
    
  }, 65 * 1000); // 65s

}

function deleteModFile(fileSha) {

  delete modifiedFiles[fileSha];

  updateModFilesLS();

}

// follow breadcrumb trail of file versions until
// reached latest version
function getLatestVersion(item) {
  
  function followTrail(crumb) {
    
    // if version sha matches its key
    // (it dosen't point to another version)
    if (modifiedFiles[crumb].sha === crumb) {
      
      // reached the most recent version
      return modifiedFiles[crumb];
      
    } else {
      
      // version sha points to another version,
      // follow the trail
      return followTrail(modifiedFiles[crumb].sha);
      
    }
    
  }
  
  // if item is in modifiedFiles object
  if (modifiedFiles[item.sha]) {
    
    // get latest version
    return followTrail(item.sha);
    
  } else {
    
    return item;
    
  }
  
}
