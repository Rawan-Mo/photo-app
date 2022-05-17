const story2Html = story => {
    return `
        <div>
            <img src="${ story.user.thumb_url }" class="pic" alt="profile pic for ${ story.user.username }" />
            <p>${ story.user.username }</p>
        </div>
    `;
};


const profile2Html = profile => { 
    return `
    <div>
        <img src="${ profile.thumb_url }" alt="profile pic" />
        <h2 class="comfortaa">${ profile.username }</h2>
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

// LIKE BUTTON FUNCTIONS

// updating # of likes + changing button icon color
const toggleLike = event => {
  const elem = event.currentTarget;

  if (elem.getAttribute('aria-checked') === 'false') {
    // Issue post request to UI/API endpoint to like a post
    likePost(elem.dataset.postId, elem);
    
} else {
    // Issue delete request to UI/API endpoint to delete the like
    unlikePost(elem.dataset.postId, elem.dataset.likeId, elem);
}


}

const likePost = (postId, elem) => {
  const postData = {
      "post_id": postId,
  };
  
  fetch("/api/posts/likes/", {
          method: "POST",
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(postData)
      })
      .then(response => response.json())
      .then(data => {
          console.log(data);
          elem.setAttribute('aria-checked', 'true');
          // in the event that we want to unlike the post
          elem.setAttribute('data-like-id', data.id);

          // updatePost(data.id);
          displayPosts();
      });
};


const unlikePost = (postId, likeId, elem) => {

  const deleteURL = `/api/posts/likes/${likeId}`;
  fetch(deleteURL, {
      method: "DELETE",
  })
  .then(response => response.json())
  .then(data => {
      console.log(data);
      console.log('postId ' + postId);
      console.log('likeId ' + likeId);
      elem.setAttribute('aria-checked', 'false');
      elem.removeAttribute('data-like-id');
      displayPosts();
  });

};

const updatePost = (postId, callback) => {
  fetch(`/api/posts/${postId}`)
    .then(response => response.json())
    .then(post => {
      const elem = document.querySelector(`#post-${post.id}`);
      const node = html2Element(post2Html(post));
      elem.replaceWith(node)
    })
}
// FIND COMMENT
const addComment = (postId, comment, elem) => { 
  const postData = {
      "post_id": postId,
      "text": comment
  };
  console.log(postData)
  
  fetch("/api/comments/", {
          method: "POST",
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify(postData)
      })
      .then(response => response.json())
      .then(comment => {
        // updatePost(comment.post_id, () )
          const elem = document.querySelector(`#post-${postId}`)
          elem.querySelector('.comment-textbox').focus();
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
                    onclick="toggleFollow(event)">follow
                </button>
            </div>
        </div>
    `;
};


const post2Html = post => {
    return `
    <div class="card">
          <div class="card-header comfortaa">
            <h3>${ post.user.username }</h3>
            <i class="fas fa-ellipsis-h"></i>
          </div>
          <div class="card-img">
            <img
              src="${ post.image_url }"
              alt="${ post.alt_text }"
            />
          </div>
          <div class="card-details">
            <div class="card-details-prepost">

              <div class="card-reactions">
                <div class="card-reactions-socials">
                  <button class="like"
                    data-post-id="${post.id}"
                    data-like-id="${post.current_user_like_id || "" }"
                    aria-checked="${post.current_user_like_id ? 'true' : 'false'}"
                    onclick= 'toggleLike(event)'>
                    <i class="${post.current_user_like_id ? 'fas' : 'far'} fa-heart"></i>
                  </button>

                  
                  <i class="far fa-comment"></i>
                  <i class="far fa-paper-plane"></i>
                </div>
                <div class="card-reactions-bookmark">
                  <i class="far fa-bookmark"></i>
                </div>
              </div>
              <div class="card-likes bold">
                <p>${ post.likes.length } ${post.likes.length > 1 ? `likes` : `like`} </p>
              </div>
              
              <div class="card-comments comments">
                <div class="card-caption caption">
                  <strong>gibsonjack</strong>
                  <p>${ post.caption }</p>
                  <button class="card-caption-more blue">more</button>
                </div>

                ${post.comments.length > 1 ?  
                  `
                  <p class="view-all blue"> View all ${post.comments.length} comments </p>
                  `
                  : ''
                }

                ${post.comments.length > 0 ?  
                  `
                  <div class="card-comment">
                  <strong>${post.comments[0].user.username}</strong>
                  <p>${post.comments[0].text}</p>
                  </div>
                  `
                  : ''
                }
                </div>
              <div class="timestamp">
                <p>${post.display_time}</p>
              </div>
            </div>
            <div class="card-comment-posting add-comment">
              <div class="adding-comment" id="comment-textbox">
                <i class="far fa-smile"></i>
                <input type="text" id ="add-comment" placeholder ="Add a comment..." />
              </div>
              <div class="card-post blue">
                <button class="blue">Post</button>
              </div>
            </div>
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
            document.querySelector('.suggestions-list').innerHTML = html;
        })
};

const displayProfile = () => {
    fetch('/api/profile')
        .then(response => response.json())
        .then(profile => {
            const html = profile2Html(profile);
            document.querySelector('.user-profile').innerHTML = html;
        })
};


const displayPosts = () => {
    fetch('/api/posts/?limit=20')
        .then(response => response.json())
        .then(posts => {
            const html = posts.map(post2Html).join('\n');
            document.querySelector('#posts').innerHTML = html;
        })
};


const initPage = () => {
    displayStories();
    displaySuggestions();
    displayProfile();
    displayPosts();
};

// invoke init page to display stories:
initPage();


// RE-RENDER POST FUNCTION 