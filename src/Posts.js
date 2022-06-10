import React from 'react';
import {getHeaders} from './utils';
import Post from './Post';


class Posts extends React.Component {
  
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
        return this.state.posts.length === 0 ?
            (
                <div id="posts"> Loading Posts... </div>
            )
            :
            (
            <div id="posts">
                    {this.state.posts.map(
                        post => <Post
                                    key={'post_' + post.id}
                                    model= {post}/>

                    )}
            </div>
        );
     }
}

export default Posts;
