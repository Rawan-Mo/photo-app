import React from 'react';
import {getHeaders} from './utils';

class Comments extends React.Component {
  

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        // fetch posts and then set the state...
    }

    lastComment() {
        const last = this.props.comments.length - 1;
        const comment = this.props.comments[last];
        return comment;
    }

    render () { // This is what will draw componenets to the screen
        const comment = this.lastComment();
        return (
            <div className='comments'>
            {comment ? 
            <div>
                <button className='link'>View all {this.props.comments.length} comments</button>
                <br></br>
                <strong>{comment.user.username}</strong>
                <span>{comment.text}</span>
                <p className='timestamp'>{comment.display_time}</p>
                </div>
            :
            ''
    }
    
            </div>
            // <div>
            //   if {comments.length > 1 } {
            //       <strong>{comments[comments.length-1].user.username}</strong>
            //   }
            //   if {comments.length === 1 } {
            //         <strong>{comments[0].user.username}</strong>
            //   }

            //   {/* <p>{comments[0].user.username}</p>
            //   <p>this is a comment</p> */}
             
            // </div>
        );
     }
}

export default Comments;