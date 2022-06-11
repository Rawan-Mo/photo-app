import React from 'react';
import {getHeaders} from './utils';

class AddComment extends React.Component {  


render () {

        return (
                <form data-id={this.props.postId} className='add-comment'>
                    <div className='input-holder'>
                        <input 
                            className='comment-textbox' 
                            aria-label="Add a comment" 
                            type='text' 
                            placeholder="Add a comment..." 
                            // ref={(input) => this.comment = input} 
                            // value={this.state.value}
                        />
                    </div>
                        <button className='link' type='submit'>Post</button>
                    
                </form>
        )
    }
}

export default AddComment;