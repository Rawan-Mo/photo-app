import React from 'react';
import {getHeaders} from './utils';

class BookmarkButton extends React.Component {  

    constructor(props) {
        super(props);
        this.toggleBookmark = this.toggleBookmark.bind(this);
        this.createBookmark = this.createBookmark.bind(this);
        this.removeBookmark = this.removeBookmark.bind(this);
    }

    componentDidMount() {
        // fetch posts and then set the state...
    }

    toggleBookmark(ev) {
        if (this.props.bookmarkId) {
            console.log('unBookmark');
            this.removeBookmark();
        } else {
            console.log('Bookmark');
            this.createBookmark();
        }
    }

    createBookmark() {
        console.log('code to Bookmark the post');
        // issue fetch request and then afterwards requery for the post:
        // this.props.requeryPost();
        // fetch POST: /api/posts/Bookmarks
        const url ='/api/bookmarks'
        const postData = {
            post_id: this.props.postId
        }
        console.log('create bookmark:', url)
        fetch(url, {
            headers: getHeaders(),
            method: 'POST',
            body: JSON.stringify(postData)
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                //this is caling the parent's method
                this.props.refreshPost();
            });
    }

    removeBookmark() {
        console.log('code to unBookmark the post');
        // issue fetch request and then afterwards requery for the post:
        // this.props.requeryPost();
        // fetch DELETE: /api/posts/Bookmarks/{likeId}
        // const url ='/api/posts/likes/' + this.props.likeId;
        // console.log('create like:', url)


        const url ='/api/bookmarks/' + this.props.bookmarkId
        console.log('remove bookmark:', url)
        fetch(url, {
            headers: getHeaders(),
            method: 'DELETE',
        })
            .then(response => response.json())
            .then(data => {
                console.log(data);
                //this is caling the parent's method
                this.props.refreshPost();
            });
    }

    render () {
        const bookmarkId = this.props.bookmarkId;
        const bookmarkClass = (bookmarkId ? 'fas' : 'far') + ' fa-bookmark';
        return (
            <button role="switch"
                className="bookmark" 
                aria-label="Bookmark / Unbookmark button" 
                aria-checked={bookmarkId ? true : false}
                onClick={this.toggleBookmark}>
                <i className={bookmarkClass}></i>                        
            </button>
        ) 
    }
}

export default BookmarkButton;