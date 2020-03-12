import React from 'react';

class Dashboard extends React.Component {  
    constructor(props) {
        super(props);

        this.state = {
            email : "",
            username : "",
            funds : 0,
            transferTo : "",
            transferAmount : ""
        }

        if(props.location.state !== undefined) {
            this.state = {
                email : props.location.state.email,
                username : props.location.state.username,
                funds : props.location.state.funds,
                transferTo : "", 
                transferAmount : ""
            }
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(event) {
        const {name, value} = event.target;
        this.setState({
            [name] : value
        })
    }

    handleSubmit(event) {
        /**
         * Check for errors: if given username exists and if enough funds
         */

        event.preventDefault();
        if(this.state.funds < this.state.transferAmount) {
            alert("Not enough funds...");
        }
        else if(1 === -1 /** Database does not contain target username */) {
            alert("User not found...")
        }
        else {
            /** If no errors, then transfer the money and update
             *  Notify database of updated funds for target username
             *  Notify database of updated funds for current user
             */
            
            this.setState((state, props) => ({
                funds : state.funds - state.transferAmount
            }));
        }
    }

    render() {
        return(
            <div>
                <center>
                    <br /><br /><br />
                    <h1>Welcome user: {this.state.username}</h1>
                    <br />
                    <h2>Available funds: {this.state.funds}</h2>
                    <br /><br /><br /><br />
                    <form onSubmit={this.handleSubmit}>
                        <h3>Transfer Money:</h3>
                        <p>To:</p>
                        <input type="text" placeholder="Username" value={this.state.transferTo} name="transferTo" id="transferTo" onChange={this.handleChange} />
                        <p>Amount:</p>
                        <input type="number" min="1" placeholder="0" value={this.state.transferAmount} name="transferAmount" id="transferAmount" onChange={this.handleChange} />
                        <br /><br /><br />
                        <button>Transfer</button>
                    </form>
                </center>
            </div>
        );
    }
}

export default Dashboard;