import React from 'react';
import {getHeaders} from './utils';

class Comments extends React.Component {
  

    constructor(props) {
        super(props);
        this.state = {
            posts: [],
        }
        // initialization code here
        this.getPostsFromServer();
    }

    getPostsFromServer() {
        fetch('/api/posts', {
            headers: getHeaders()
        })
            .then(response => response.json())
            .then(data => this.setState({
                posts: data
            }));
    }

    componentDidMount() {
        // fetch posts and then set the state...
    }

    render () { // This is what will draw componenets to the screen
        const posts = this.props.posts;
        return (
            <div>
              {/* if {post.comments.length > 1 } {
                  <strong>{post.comments[post.comments.length-1].user.username}</strong>

              } */}

              {/* <p>{post.comments[0].user.username}</p> */}
              <p>this is a comment</p>
             
            </div>
        );
     }
}

export default Comments;