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

const post2Html = post => {
    return `
    <div class="card" id="post-${post.id}">
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
                    ${ renderLikeButton(post) }                 
                    <i class="far fa-comment"></i>
                    <i class="far fa-paper-plane"></i>
                </div>
                <div class="card-reactions-bookmark">
                    ${ renderBookmarkButton(post) }
                </div>
              </div>
              <div class="card-likes bold">
                <p>${ post.likes.length } ${post.likes.length > 1 ? `likes` : `like`} </p>
              </div>
              
              <strong>${ post.user.username }</strong>
              <span>${ post.caption }</span>

              <div class="timestamp">
              <p>${post.display_time}</p>
            </div>
             
                    ${ displayComments(post) }
                </div>
              
            </div>
            <div class="card-comment-posting add-comment">
              <div class="adding-comment" id="comment-textbox">
                <i class="far fa-smile"></i>
                <input type="text" id="input-comment-${post.id}" value="" aria-label= "Add a comment" placeholder ="Add a comment..." />
              </div>
              <div class="card-post blue">
                <button class="blue ourButton" data-post-id="${post.id}" aria-label= "Post Comment" onClick='addComment(event)'>Post</button>
              </div>
            </div>
          </div>
        </div>
    `;
};

const post2Modal = post => {
    return `
    <div class="modal-bg hidden" aria-hidden="false" role="dialog">
        <section class="modal">
            <button class="close ourButton" id="close-btn" aria-label="Close the modal window" onclick="closeModal(event);">
                <i class="fas fa-times close-btn"></i>
            </button>
           <div class="modal-div"
           <divc>
            <img class = "modal-img" src="${ post.image_url }" alt="${ post.alt_text }" />
            </div>

            <div class="post-info">
            <div class="post-info-header">
            <img src="${post.user.image_url}" alt="${post.user} profile picture" />
            <h2>${post.user.username} </h2>
            </div>
            <div class="comments">

                ${post.comments.map(comment2Html).join("\n")}
            </div>
            </div>
            </div>
           

       
    </section>
        

    </div>`;
};

comment2Html = comment => {
    return `
        <div class ="comment">
        <div>
            <img src= "${comment.user.thumb_url}" />
        </div>
        <div>
            <strong> ${comment.user.username} </strong>
            <p> ${comment.text} </p>   
            <p class="timestamp"> ${comment.display_time} </p>
           
        </div>
        </div>
    `
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
            elem.setAttribute('aria-label', 'Unfollow ${data.username}');
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
        elem.setAttribute('aria-label', 'Follow ${data.username}');
        elem.classList.add('follow');
        elem.classList.remove('unfollow');
        elem.removeAttribute('data-following-id');
    });

};

// LIKE BUTTON FUNCTIONS

// updating # of likes + changing button icon color
const handleLike = event => {
    const elem = event.currentTarget;

    if (elem.getAttribute('aria-checked') === 'false') {
        // Issue post request to UI/API endpoint to like a post
        // If we want to retrieve data-like-id from the like button, we can use the following:
        // elem.dataset.likeId;
        likePost(Number(elem.dataset.postId), elem);
        
    } else {
        // Issue delete request to UI/API endpoint to delete the like
        unlikePost(Number(elem.dataset.postId), Number(elem.dataset.likeId), elem);
    };
};

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
            updatePost(postId);
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
        updatePost(postId);
    });
  
};

// BOOKMARK BUTTON FUNCTIONS

const handleBookmark = event => {
    const elem = event.currentTarget;

    if (elem.getAttribute('aria-checked') === 'false') {
        // Issue post request to UI/API endpoint to like a post
        // If we want to retrieve data-like-id from the like button, we can use the following:
        // elem.dataset.likeId;
        bookmarkPost(Number(elem.dataset.postId), elem);
        
    } else {
        // Issue delete request to UI/API endpoint to delete the like
        unbookmarkPost(Number(elem.dataset.postId), Number(elem.dataset.bookmarkId), elem);
    };
};

const unbookmarkPost = (postId, bookmarkId, elem) => {

  const deleteURL = `/api/bookmarks/${bookmarkId}`;
  fetch(deleteURL, {
      method: "DELETE",
  })
  .then(response => response.json())
  .then(data => {
      console.log(data);
      elem.setAttribute('aria-checked', 'false');
      elem.removeAttribute('data-bookmark-id');
      updatePost(postId);
  });

};

const bookmarkPost = (postId, elem) => {
    const postData = {
        "post_id": postId,
    };
    
    fetch("/api/bookmarks/", {
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
            elem.setAttribute('data-bookmark-id', data.id);
  
            // updatePost(data.id);
              updatePost(postId);
        });
  };
  
// COMMENT FUNCTIONS

const displayComments = post => {
    
    if (post.comments.length > 1) {
        return `
        <button class="view-all blue ourButton" data-post-id=${post.id} aria-label="View all comments" onClick="showModal(event)"> View all ${post.comments.length} comments </button>
        <div class="card-comment">
        <strong>${post.comments[post.comments.length-1].user.username}</strong>
        <span>${post.comments[post.comments.length-1].text}</span>
        <p class="timestamp">${post.comments[post.comments.length-1].display_time}</p>
        </div>
        `;

    } else if (post.comments.length === 1) {
        return `
        <div class="card-comment">
        <strong>${post.comments[post.comments.length-1].user.username}</strong>
        <span>${post.comments[post.comments.length-1].text}</span>
        <p class="timestamp">${post.comments[post.comments.length-1].display_time}</p>
        </div>
        `;

    } else {
        return '';
    }
};

// ADDING A COMMENT [find variable comment]
const addComment = event => { 
    elem = event.currentTarget;

    const postData = {
        "post_id": elem.dataset.postId,
        "text": document.getElementById(`input-comment-${elem.dataset.postId}`).value
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
            updatePost(comment.post_id);
            const elem = document.querySelector(`#post-${postId}`)
            elem.querySelector('.comment-textbox').focus();
        });
};

// RE-RENDER POST FUNCTION 
const updatePost = (postId, callback) => {
  fetch(`/api/posts/${postId}`)
    .then(response => response.json())
    .then(updatedPost => {
        if (!callback){
            redrawCard(updatedPost);
        } else{
            callback(updatedPost);
        }
    })
};

const redrawCard = post => {
    const html = post2Html(post);
    const newElement = string2Html(html);
    const elem = document.querySelector(`#post-${post.id}`);
    elem.innerHTML = newElement.innerHTML;
};


const string2Html = htmlString => {
    var parser = new DOMParser();
    var doc = parser.parseFromString(htmlString, "text/html");
    return doc.body.firstChild;

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

const renderLikeButton = post => {
    return `
        <button class="like ourButton"
                data-post-id="${post.id}"
                data-like-id="${post.current_user_like_id || "" }"
                aria-label="Like / Unlike"
                aria-checked="${post.current_user_like_id ? 'true' : 'false'}"
                onclick= 'handleLike(event)'>
                <i class="${post.current_user_like_id ? 'fas' : 'far'} fa-heart"></i>
        </button>
    `;
};

const renderBookmarkButton = post => {
    return `
        <button class="like ourButton"
                data-post-id="${post.id}"
                data-bookmark-id="${post.current_user_bookmark_id || "" }"
                aria-label="Bookmark / Unbookmark"
                aria-checked="${post.current_user_bookmark_id ? 'true' : 'false'}"
                onclick= 'handleBookmark(event)'>
                <i class="${post.current_user_bookmark_id ? 'fas' : 'far'} fa-bookmark"></i>
        </button>
    `;
};

// Modal Functions
const closeModal = event => {
    console.log('close!');
    document.querySelector('.modal-bg').classList.add('hidden');
    document.querySelector('.modal-bg').setAttribute('aria-hidden', 'false');
    document.querySelector('.view-all').focus();
};

const showModal = event => {
    const postId = Number(event.currentTarget.dataset.postId);
    const modalElement = document.querySelector('.modal-bg');

    updatePost(postId, post => {
        console.log("modal open")
        const html = post2Modal(post);
        document.querySelector(`#post-${post.id}`).insertAdjacentHTML('beforeend', html);
        document.querySelector('#modal-container').innerHTML = html;
        document.querySelector('.modal-bg').classList.remove('hidden');
        document.querySelector('.modal-bg').setAttribute('aria-hidden', 'false');
        document.body.style.overflowY = 'hidden';  
        document.querySelector('#close-btn').focus(); 
    });    
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


