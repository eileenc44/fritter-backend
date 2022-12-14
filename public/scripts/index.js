// Show an object on the screen.
function showObject(obj) {
  const pre = document.getElementById('response');
  const preParent = pre.parentElement;
  pre.innerText = JSON.stringify(obj, null, 4);
  preParent.classList.add('flashing');
  setTimeout(() => {
    preParent.classList.remove('flashing');
  }, 300);
}

function showResponse(response) {
  response.json().then(data => {
    showObject({
      data,
      status: response.status,
      statusText: response.statusText
    });
  });
}

/**
 * IT IS UNLIKELY THAT YOU WILL WANT TO EDIT THE CODE ABOVE.
 * EDIT THE CODE BELOW TO SEND REQUESTS TO YOUR API.
 *
 * Native browser Fetch API documentation to fetch resources: https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
 */

// Map form (by id) to the function that should be called on submit
const formsAndHandlers = {
  'create-user': createUser,
  'delete-user': deleteUser,
  'change-username': changeUsername,
  'change-password': changePassword,
  'sign-in': signIn,
  'sign-out': signOut,
  'view-all-freets': viewAllFreets,
  'view-all-not-group-freets': viewAllNotGroupFreets,
  'view-freets-by-author': viewFreetsByAuthor,
  'view-not-group-freets-by-author': viewNotGroupFreetsByAuthor,
  'create-freet': createFreet,
  'edit-freet': editFreet,
  'delete-freet': deleteFreet,
  'view-followers': viewFollowers,
  'view-followees': viewFollowees,
  'follow-user': followUser,
  'unfollow-user': unfollowUser,
  'view-all-filtered-words': viewAllFilteredWords,
  'add-word-to-filter': addWordToFilter,
  'delete-word-from-filter': deleteWordFromFilter,
  'view-all-groups': viewAllGroups,
  'view-groups-by-name': viewGroupsByName,
  'view-groups-by-creator': viewGroupsByCreator,
  'view-groups-by-member': viewGroupsByMember,
  'create-group': createGroup,
  'edit-group': editGroup,
  'delete-group': deleteGroup,
  'join-group': joinGroup,
  'leave-group': leaveGroup,
  'create-group-freet': createGroupFreet,
  'delete-freet-from-group': deleteFreetFromGroup
};

// Attach handlers to forms
function init() {
  Object.entries(formsAndHandlers).forEach(([formID, handler]) => {
    const form = document.getElementById(formID);
    form.onsubmit = e => {
      e.preventDefault();
      const formData = new FormData(form);
      handler(Object.fromEntries(formData.entries()));
      return false; // Don't reload page
    };
  });
}

// Attach handlers once DOM is ready
window.onload = init;
