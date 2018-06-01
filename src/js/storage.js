const LOCAL_STORAGE_ALL_FRIENDS_NAME = 'all_friends';
const LOCAL_STORAGE_SELECTED_FRIENDS_NAME = 'selected_friends';

function getAllFriendsFromStorage() {
    let result = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ALL_FRIENDS_NAME));
    return result == null ? new Array() : result;
}

function getSelectedFriendsFromStorage() {
    let result = JSON.parse(localStorage.getItem(LOCAL_STORAGE_SELECTED_FRIENDS_NAME));
    return result == null ? new Array() : result;
}

function removeFriendFromStorage(storageName, index) {
    let newFriendsArray =
        storageName == LOCAL_STORAGE_ALL_FRIENDS_NAME ? getAllFriendsFromStorage() : getSelectedFriendsFromStorage();
    let deleted = newFriendsArray.splice(index, 1)[0];
    localStorage.setItem(storageName, JSON.stringify(newFriendsArray));

    return deleted;
}

function addFriendToStorage(storageName, friend) {
    let newFriendsArray =
        storageName == LOCAL_STORAGE_ALL_FRIENDS_NAME ? getAllFriendsFromStorage() : getSelectedFriendsFromStorage();
    newFriendsArray.push(friend) - 1;
    localStorage.setItem(storageName, JSON.stringify(newFriendsArray));
}