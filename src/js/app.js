const LOCAL_STORAGE_ALL_FRIENDS_NAME = 'all_friends';
const LOCAL_STORAGE_SELECTED_FRIENDS_NAME = 'selected_friends';

const allContainer = document.querySelector('#all-container');
const selectedContainer = document.querySelector('#selected-container');
const allFriendsFilter = document.querySelector('#all-filter-input');
const selectedFriendsFilter = document.querySelector('#selected-filter-input');

VK.init({
    apiId: 5520174
});

function auth() {
    new Promise((resolve, reject) => {
        VK.Auth.login(data => {
            if (data.session) {
                resolve();
            } else {
                reject(new Error('Не удалось авторизоваться'));
            }
        }, 2);
    });
}

function callAPI(method, params) {
    params.v = '5.76';

    return new Promise((resolve, reject) => {
        VK.api(method, params, (data) => {
            if (data.error) {
                reject(data.error);
            } else {
                resolve(data.response);
            }
        });
    })
}

function getAllFriendsFromStorage() {
    let result = JSON.parse(localStorage.getItem(LOCAL_STORAGE_ALL_FRIENDS_NAME));
    return result == null ? new Array() : result;
}

function getSelectedFriendsFromStorage() {
    let result = JSON.parse(localStorage.getItem(LOCAL_STORAGE_SELECTED_FRIENDS_NAME));
    return result == null ? new Array() : result;
}

function loadFriendsToContainer(friendsArray, container) {

    container.innerHTML = "";

    for (let i = 0; i < friendsArray.length; i++) {
        let data = friendsArray[i];

        let friendDiv = document.createElement('div');
        friendDiv.setAttribute('class', 'friend-container draggable');
        friendDiv.setAttribute('id', i);

        let avatar = document.createElement('img');
        avatar.setAttribute('src', data['photo_100']);
        avatar.setAttribute('class', 'friend-ava');
        friendDiv.appendChild(avatar);

        let name = document.createElement('span');
        name.setAttribute('class', 'friend-name');
        name.textContent = `${data['first_name']} ${data['last_name']}`;
        friendDiv.appendChild(name);

        let plus = document.createElement('img');
        plus.setAttribute('src', './assets/img/plus.gif');
        plus.setAttribute('class', 'friend-add');
        friendDiv.appendChild(plus);

        container.appendChild(friendDiv);
    }
}

function isMatching(full, chunk) {
    return full.toLowerCase().includes(chunk.toLowerCase());
}

allFriendsFilter.addEventListener('keyup', function() {
    let friendsArray = getAllFriendsFromStorage();
    let filteredFiends = [];
    for (let data of friendsArray) {
        if (isMatching(`${data['first_name']} ${data['last_name']}`, allFriendsFilter.value)) {
            filteredFiends.push(data);
        }
    }
    loadFriendsToContainer(filteredFiends, allContainer);
});

selectedFriendsFilter.addEventListener('keyup', function() {
    let friendsArray = getSelectedFriendsFromStorage();
    let filteredFiends = [];
    for (let data of friendsArray) {
        if (isMatching(`${data['first_name']} ${data['last_name']}`, selectedFriendsFilter.value)) {
            filteredFiends.push(data);
        }
    }
    loadFriendsToContainer(filteredFiends, selectedContainer);
});

(async () => {
    let friendsArray = [];
    let friendsInStorage = localStorage.getItem(LOCAL_STORAGE_ALL_FRIENDS_NAME);
    if (friendsInStorage == null || friendsInStorage.length == 0) {
        try {
            await auth();
            const friends = await callAPI('friends.get', { fields: 'first_name, last_name, photo_100' });
            friendsArray = friends.items;
            localStorage.setItem(LOCAL_STORAGE_ALL_FRIENDS_NAME, JSON.stringify(friendsArray));
        } catch (e) {
            console.error(e);
        }
    } else {
        friendsArray = getAllFriendsFromStorage();
    }

    loadFriendsToContainer(friendsArray, allContainer);

    let selectedFriendsArray = [];
    let selectedFriends = localStorage.getItem(LOCAL_STORAGE_SELECTED_FRIENDS_NAME);
    if (selectedFriends != null && selectedFriends.length > 0) {
        selectedFriendsArray = getSelectedFriendsFromStorage();
    }

    loadFriendsToContainer(selectedFriendsArray, selectedContainer);
})();
