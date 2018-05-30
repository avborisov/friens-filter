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
    return JSON.parse(localStorage.getItem('all_friends'));
}

function loadFriendsToLeftColumn(friendsArray) {
    let allContainer = document.querySelector('#all-container');
    allContainer.innerHTML = "";

    for (let data of friendsArray) {
        let friendDiv = document.createElement('div');
        friendDiv.setAttribute('class', 'friend-container');

        let avatar = document.createElement('img');
        avatar.setAttribute('src', data['photo_100']);
        avatar.setAttribute('class', 'friend-ava');
        friendDiv.appendChild(avatar);

        let name = document.createElement('span');
        name.setAttribute('class', 'friend-name');
        name.textContent = `${data['first_name']} ${data['last_name']}`;
        friendDiv.appendChild(name);

        allContainer.appendChild(friendDiv);
    }
}

function isMatching(full, chunk) {
    return full.toLowerCase().includes(chunk.toLowerCase());
}

const allFriendsFilter = document.querySelector('#all-filter-input');

allFriendsFilter.addEventListener('keyup', function() {
    let friendsArray = getAllFriendsFromStorage();
    let filteredFiends = [];
    for (let data of friendsArray) {
        if (isMatching(`${data['first_name']} ${data['last_name']}`, allFriendsFilter.value)) {
            filteredFiends.push(data);
        }
    }
    loadFriendsToLeftColumn(filteredFiends);
});

(async () => {
    let friendsArray = [];
    let friendsInStorage = localStorage.getItem('all_friends');
    if (friendsInStorage == null || friendsArray.length == 0) {
        try {
            await auth();
            const friends = await callAPI('friends.get', { fields: 'first_name, last_name, photo_100' });
            friendsArray = friends.items;
            localStorage.setItem('all_friends', JSON.stringify(friendsArray));
        } catch (e) {
            console.error(e);
        }
    } else {
        friendsArray = getAllFriendsFromStorage();
    }
    loadFriendsToLeftColumn(friendsArray);
})();
