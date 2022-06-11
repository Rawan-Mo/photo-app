import React from 'react';
import {getHeaders} from './utils';

class AddComment extends React.Component {  

    constructor(props) {
        super(props);

        this.state = {
            value: '',
            postId: this.props.postId
        }

        this.requeryPost = this.props.callback.bind(this);
        this.commentInputRef = React.createRef();
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        
    }

    componentDidMount() {
        // fetch posts and then set the state...
    }

    handleChange(ev) {
        this.setState({
            value: ev.target.value
        });
    }

    handleSubmit(ev) {
        ev.preventDefault();
        const postData = {
            "post_id": this.props.postId,
            "text": this.state.value
        }

        fetch('/api/comments', {
            method: "POST",
            header: getHeaders(),
            body: JSON.stringify(postData)
        })
        .then(response => response.json())
        .then(data => {
            this.requeryPost();
            this.setState({
                value: ''
            });
            this.commentInputRef.current.focus();
        })
    }




render () {

        return (
                <form data-id={this.props.postId} className='add-comment' onSubmit={this.handleSubmit}>
                    <div className='input-holder'>
                        <input 
                            className='comment-textbox' 
                            aria-label="Add a comment" 
                            type='text' 
                            placeholder="Add a comment..." 
                            onChange={this.handleChange}
                            value={this.state.value}
                            ref={this.commentInputRef}
                            
                        />
                    </div>
                        <button className='link' type='submit' >Post</button>
                    
                </form>
                
        )
        
    }
}

export default AddComment;