import React from 'react';
import LikeButton from './LikeButton';
import BookmarkButton from './BookmarkButton';
import AddComment from './AddComment';
import Comments from './Comments';
import {getHeaders} from './utils';

class Post extends React.Component {  

    constructor(props) {
        super(props);
        this.state = {
            post: null
        }

        this.requeryPost = this.requeryPost.bind(this);
        // this.refreshPostDataFromServer = this.refreshPostDataFromServer.bind(this);
    }

    componentDidMount() {
        // fetch posts and then set the state...
        this.setState({ post: this.props.model });
    }

    requeryPost() {
        // ref-fetch the post
        console.log('am I invoked')
        const url = `/api/posts/${this.state.post.id}`;
        fetch(url, { 
                headers: getHeaders()
            })
            .then(response => response.json())
            .then(data => {
                this.setState({ 
                    post: data
                });
            });
    }

    
    
    render () {
        const post = this.state.post;
        if (!post) {
            return (
                <div></div>  
            );
        }
        return (
            <section className="card">
                <div className="header">
                    <h3>{ post.user.username }</h3>
                    <i className="fa fa-dots"></i>
                </div>
                
                <img 
                    src={ post.image_url } 
                    alt={'Image posted by ' +  post.user.username } 
                    width="300" 
                    height="300" />
                
                <div className="info">
                    <div>
                        <div className='buttons'>
                        <LikeButton 
                            postId={post.id} 
                            likeId={post.current_user_like_id}
                            refreshPost={this.requeryPost} />

                        <BookmarkButton 
                            postId={post.id} 
                            bookmarkId={post.current_user_bookmark_id}
                            refreshPost={this.requeryPost} />

                        </div> 

                        
                        
        
                    </div>
                    <div className='caption'>
                        <strong>{post.user.username}</strong>
                        <span>{ post.caption }</span>

                        <p className='timestamp'>{post.display_time}</p>
                    </div>
                    
                    <Comments
                        comments={post.comments}
                    />
                    <AddComment
                        postId={post.id} 
                        refreshPost={this.requeryPost}
                    />
                </div>
            </section> 
        );     
    }
}

export default Post;