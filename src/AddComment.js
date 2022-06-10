import React from 'react';
import {getHeaders} from './utils';

class AddComment extends React.Component {  

    constructor(props) {
        super(props);
        this.state = {
            value: '',
            // postId: this.props.postId
        }


        this.addCommentButton = this.addCommentButton.bind(this);
    }

    componentDidMount() {
        // fetch posts and then set the state...
    }

    addCommentButton(ev) {
        ev.preventDefault();
        const url ='/api/comments/';
        const postData = {
            post_id: this.props.postId,
            comment: this.comment.value
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
                this.setState ({
                    value: ev.target.value
                })
                this.props.refreshPost();

            });
        
    }


    render () {

        return (
            <div>
                <form className='add-comment'>
                    <div className='input-holder'>
                        <input 
                            className='comment-textbox' 
                            aria-label="Add a comment" 
                            type='text' 
                            placeholder="Add a comment..." 
                            ref={(input) => this.comment = input} 
                            value={this.state.value}
                        />
                    </div>
                        <button className='link' type='submit' onClick={this.addCommentButton}>Post</button>
                    
                </form>
            </div>

        )
        // form class add-comment
        // div class input holder
        // <input class="comment-textbox" aria-label="Add a comment" placeholder="Add a comment..." value="">
        // /div
        // button class link Post
        // /form

        // const likeId = this.props.likeId;
        // const heartClass = (likeId ? 'fas' : 'far') + ' fa-heart';
        // return (
        //     <button role="switch"
        //         className="like" 
        //         aria-label="Like Button" 
        //         aria-checked={likeId ? true : false}
        //         onClick={this.toggleLike}>
        //         <i className={heartClass}></i>                        
        //     </button>
        // ) 
    }
}

export default AddComment;