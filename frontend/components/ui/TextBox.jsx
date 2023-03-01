import React from 'react';

class TextBox extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            text: "0"
        };
    }
    /**
     * change text
     * @param {String} e text
     */
    changeText = (e) => {
        this.setState({
            text: e
        });
    }
    render = () => {
        return <div
        id={this.props.id} className={`${this.props.className} p-3 rounded-xl`}>
            {this.state.text}
        </div>
    }
}
export default TextBox;