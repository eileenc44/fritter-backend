/* eslint-disable @typescript-eslint/restrict-template-expressions */

function viewAllGroups(fields) {
  fetch('/api/groups')
    .then(showResponse)
    .catch(showResponse);
}

function viewGroupsByName(fields) {
  fetch(`/api/groups?groupName=${fields.groupName}`)
    .then(showResponse)
    .catch(showResponse);
}

function viewGroupsByCreator(fields) {
  fetch(`/api/groups?creator=${fields.creator}`)
    .then(showResponse)
    .catch(showResponse);
}

function viewGroupsByMember(fields) {
  fetch(`/api/groups?member=${fields.member}`)
    .then(showResponse)
    .catch(showResponse);
}

function createGroup(fields) {
  fetch('/api/groups', {method: 'POST', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function editGroup(fields) {
  fetch(`/api/groups/${fields.groupId}`, {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function deleteGroup(fields) {
  fetch(`/api/groups/${fields.groupId}`, {method: 'DELETE'})
    .then(showResponse)
    .catch(showResponse);
}

function joinGroup(fields) {
  fetch(`/api/groups/${fields.groupId}/join`, {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function leaveGroup(fields) {
  fetch(`/api/groups/${fields.groupId}/leave`, {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}
function createGroupFreet(fields) {
  fetch(`/api/groups/${fields.groupId}/addFreet`, {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}

function deleteFreetFromGroup(fields) {
  fetch(`/api/groups/${fields.groupId}/deleteFreet/${fields.freetId}`, {method: 'PUT', body: JSON.stringify(fields), headers: {'Content-Type': 'application/json'}})
    .then(showResponse)
    .catch(showResponse);
}
