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
            post_id: this.state.postId,
            comment: this.state.value
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
                    value: data
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
                            // value={this.state.value}
                        />
                    </div>
                        <button className='link' type='submit' onClick={this.addCommentButton}>Post</button>
                    
                </form>
            </div>

        )
    }
}

export default AddComment;