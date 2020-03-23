import React from 'react';
import Axios from 'axios';
import Search from './Search';

class Dashboard extends React.Component {  
    constructor(props) {
        super(props);

        this.state = {
            email : "",
            username : "",
            funds : 0,
            transferTo : "",
            transferAmount : "",
            access_token: ""
        }

        if(props.location.state !== undefined) {
            this.state = {
                email : props.location.state.email,
                username : props.location.state.username,
                funds : props.location.state.funds,
                transferTo : "", 
                transferAmount : "",
                access_token : props.location.state.access_token
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
        else if(this.state.username === this.state.transferTo) {
            alert("Cannot transfer to yourself...")
        }
        else {
            /** If no errors, then transfer the money and update
             *  Notify database of updated funds for target username
             *  Notify database of updated funds for current user
             * 
             *             
             */

            const sendInfo = {sender: this.state.email, receiver: this.state.transferTo, transferAmount: this.state.transferAmount};
            Axios.post('http://localhost:5000/transfer', sendInfo, { headers: {"Authorization" : `Bearer ${this.state.access_token}`} })
            .then(result => {
                console.log(result);
                this.setState((state, props) => ({
                    funds : state.funds - state.transferAmount,
                    transferTo : "", 
                    transferAmount : 0
                }));
                alert("Funds transfered");
            })
            .catch(error => {
                console.log(error);
                alert("Invalid account information. Please try again");
            });
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
                    <br />
                    <Search />
                    <br /><br /><br />
                    <form onSubmit={this.handleSubmit}>
                        <h3>Transfer Money:</h3>
                        <p>To:</p>
                        <input type="text" placeholder="email" value={this.state.transferTo} name="transferTo" id="transferTo" onChange={this.handleChange} />
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