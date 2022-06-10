import React from 'react';

class NavBar extends React.Component {
  
    constructor(props) {
        super(props);
        // initialization code here
    }

    componentDidMount() {
        // fetch posts and then set the state...
    }

    render () { // This is what will draw componenets to the screen
        return (
            <nav className="main-nav">
                <h1>{this.props.title}</h1>
                {this.props.username}
            </nav>
        );
     }
}

export default NavBar;