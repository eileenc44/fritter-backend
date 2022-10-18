/* eslint-disable @typescript-eslint/restrict-template-expressions */
  
  function viewFollowers(fields) {
    fetch(`/api/follow?followee=${fields.followee}`)
      .then(showResponse)
      .catch(showResponse);
  }
  
  function viewFollowees(fields) {
    fetch(`/api/follow?follower=${fields.follower}`)
      .then(showResponse)
      .catch(showResponse);
  }

  function followUser(fields) {
    fetch('/api/follow', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
      .then(showResponse)
      .catch(showResponse);
  }
  
  function unfollowUser(fields) {
    fetch(`/api/follow/${fields.followeeName}`, {method: 'DELETE'})
      .then(showResponse)
      .catch(showResponse);
  }
  