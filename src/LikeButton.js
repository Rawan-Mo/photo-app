import React from 'react';
import {getHeaders} from './utils';

class LikeButton extends React.Component {  

    constructor(props) {
        super(props);
        this.toggleLike = this.toggleLike.bind(this);
        this.createLike = this.createLike.bind(this);
        this.removeLike = this.removeLike.bind(this);
    }

    componentDidMount() {
        // fetch posts and then set the state...
    }

    toggleLike(ev) {
        if (this.props.likeId) {
            this.removeLike();
        } else {
            this.createLike();
        }
    }

    createLike() {
        const url ='/api/posts/likes';
        console.log('create like:', url);
        const postData = {
            post_id: this.props.postId
        }
        
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

    removeLike() {
        console.log('code to unlike the post');
        const url ='/api/posts/likes/' + this.props.likeId
        console.log('delete like:', url)
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
        const likeId = this.props.likeId;
        const heartClass = (likeId ? 'fas' : 'far') + ' fa-heart';
        return (
            <button role="switch"
                className="like" 
                aria-label="Like / Unlike Button" 
                aria-checked={likeId ? true : false}
                onClick={this.toggleLike}>
                <i className={heartClass}></i>                        
            </button>
        ) 
    }
}

export default LikeButton;