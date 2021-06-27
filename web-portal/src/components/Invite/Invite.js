import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../../store/actions";
import './Invite.scss';
import axios  from 'axios';
import { get_service_endpoint } from "../../ServiceEndpoints.js";

let ep = get_service_endpoint('assessment')
const url=`${ep}/api/invites`;

// This component displays two text boxes where a user can type in invite_id
// and hash_value, on clicking hte button, no event is dispatched but a call 
// is made to assesment service to validate the invite. An action is dispatched
// to update the state. This state change triggers the Router to switch to Problem
// Container. by redirecting to /problems

class Invite extends Component {
	constructor(props) {
	super(props);
	this.state = {
		invite:"",
		hashValue:""
	};
}

	changedInvite(newValue) {
		this.setState({ invite:newValue });
	}

	changedHash(newValue) {
		this.setState({ hashValue:newValue });
	}

	inviteHandler() {
		axios.get(url,{params:{"invite_id":this.state.invite,"hash_value":this.state.hashValue}})
		.then(response => {
			if(response.success) {
				this.props.SetInviteCredential(response.data);
			}
		})
		.catch(error => {
			console.log(error);
		})
	}

	render() {
		return(
			<div>
				<textarea styleName="txtarea" onChange={(e)=>this.changedInvite(e.target.value)} rows="6" cols="3" />
				<textarea styleName="txtarea" onChange={(e)=>this.changedHash(e.target.value)} rows="6" cols="3" />
				<br/>
				<button styleName="btn" onClick={()=>this.inviteHandler()}>Click me</button>
			</div>
		)
	}
}


const mapStateToProps = state => {
	return {
	};
};

const mapDispatchToProps = dispatch => {
	return {
		SetInviteCredential: val => dispatch(actions.SetInviteCredential(val))
	};
};

export default connect(mapStateToProps,mapDispatchToProps)(Invite);
