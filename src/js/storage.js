const LOCAL_STORAGE_ALL_FRIENDS_NAME = 'all_friends';
const LOCAL_STORAGE_SELECTED_FRIENDS_NAME = 'selected_friends';

const TMP_ALL_FRIENDS_NAME = 'tmp_all_friends';
const TMP_SELECTED_FRIENDS_NAME = 'tmp_selected_friends';

// global temporary storage
var tmpAllFriendsStorage = [];
var tmpSelectedFriendsStorage = [];

function getAllFriendsFromStorage() {
    let result = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ALL_FRIENDS_NAME));
    return result == null ? new Array() : result;
}

function getSelectedFriendsFromStorage() {
    let result = JSON.parse(localStorage.getItem(LOCAL_STORAGE_SELECTED_FRIENDS_NAME));
    return result == null ? new Array() : result;
}

function removeFriendFromTmp(storageName, index) {
    let newFriendsArray =
        storageName == TMP_ALL_FRIENDS_NAME ? tmpAllFriendsStorage : tmpSelectedFriendsStorage;
    let deleted = newFriendsArray.splice(index, 1)[0];
    localStorage.setItem(storageName, JSON.stringify(newFriendsArray));

    return deleted;
}

function addFriendToTmp(storageName, friend) {
    let newFriendsArray =
        storageName == TMP_ALL_FRIENDS_NAME ? tmpAllFriendsStorage : tmpSelectedFriendsStorage;
    newFriendsArray.push(friend) - 1;
    localStorage.setItem(storageName, JSON.stringify(newFriendsArray));
}