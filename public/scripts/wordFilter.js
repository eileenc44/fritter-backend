/* eslint-disable @typescript-eslint/restrict-template-expressions */

/**
 * Fields is an object mapping the names of the form inputs to the values typed in
 * e.g. for createUser, fields has properites 'username' and 'password'
 */

 function viewAllFilteredWords(fields) {
    fetch('/api/wordFilter')
      .then(showResponse)
      .catch(showResponse);
  }
  
  function addWordToFilter(fields) {
    fetch('/api/wordFilter', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
      .then(showResponse)
      .catch(showResponse);
  }
  
  function deleteWordFromFilter(fields) {
    fetch(`/api/wordFilter/${fields.word}`, {method: 'DELETE'})
      .then(showResponse)
      .catch(showResponse);
  }
  