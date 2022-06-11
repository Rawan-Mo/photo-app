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

    findLastComment() {
        const comment = this.props.comments[0];
        return comment;
    }

    render () { // This is what will draw componenets to the screen
        // const comment = this.lastComment();
        const comment = this.findLastComment();
        
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
        );
     }
}

export default Comments;