const story2Html = story => {
    return `
        <div>
            <img src="${ story.user.thumb_url }" class="pic" alt="profile pic for ${ story.user.username }" />
            <p>${ story.user.username }</p>
        </div>
    `;
};

const toggleFollow = event => {
    const elem = event.currentTarget;
    if (elem.getAttribute('aria-checked') === 'false') {
        // Issue post request to UI/API endpoint to create a new follower
        followUser(elem.dataset.userId, elem);
        
    } else {
        // Issue delete request to UI/API endpoint to delete the follower
        unfollowUser(elem.dataset.followingId, elem);
    }
};

const followUser = (userId, elem) => {
    const postData = {
        "user_id": userId
    };
    
    fetch("/api/following/", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData)
        })
        .then(response => response.json())
        .then(data => {
            console.log(data);
            elem.innerHTML = 'unfollow';
            elem.setAttribute('aria-checked', 'true');
            elem.classList.add('unfollow');
            elem.classList.remove('follow');
            // in the event that we want to unfollow the user
            elem.setAttribute('data-following-id', data.id);
        });
};

const unfollowUser = (followingId, elem) => {

    const deleteURL = `/api/following/${followingId}`;
    fetch(deleteURL, {
        method: "DELETE",
    })
    .then(response => response.json())
    .then(data => {
        console.log(data);
        elem.innerHTML = 'follow';
        elem.setAttribute('aria-checked', 'false');
        elem.classList.add('follow');
        elem.classList.remove('unfollow');
        elem.removeAttribute('data-following-id');
    });

};

const user2Html = user => {
    return `
        <div class="suggestion">
            <img src="${ user.thumb_url }" alt="">
            <div>
                <p id="user">${ user.username }</p>
                <p>Suggested for you</p>
            </div>
            <div>
                <button 
                    class="follow" 
                    aria-label="Follow ${ user.username }"
                    aria-checked="false"
                    data-user-id="${user.id}"
                    onclick="toggleFollow(event)">follow</button>
            </div>
        </div>
    `;
};


// fetch data from your API endpoint:
const displayStories = () => {
    fetch('/api/stories')
        .then(response => response.json())
        .then(stories => {
            const html = stories.map(story2Html).join('\n');
            document.querySelector('.stories').innerHTML = html;
        })
};

const displaySuggestions = () => {
    fetch('/api/suggestions')
        .then(response => response.json())
        .then(users => {
            const html = users.map(user2Html).join('\n');
            document.querySelector('.suggestions').innerHTML = html;
        })
};

const initPage = () => {
    displayStories();
    displaySuggestions();
};

// invoke init page to display stories:
initPage();