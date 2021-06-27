import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Icon } from 'antd';
import { Route, Switch, Link } from "react-router-dom";

import './Questions.scss';

import DraftQuestions from "./DraftQuestions/DraftQuestions";
import MyQuestions from "./MyQuestions/MyQuestions";
import CreateQuestion from "./CreateQuestion/CreateQuestion";

class Questions extends Component {
	render() {
		return (
			<div styleName="c-ques">
				<div styleName="l-ques-header">
					<div styleName="l-ques-header__left">
						<h3 style={{width:'190px',padding:'5px 0px'}}>
							<Switch>
								<Route
									path="/admin/my-questions/"
									exact
									render={() =>(
										<Link to="/admin/tests/" style={{color:'rgba(0, 0, 0, 0.65)'}} >
											<Icon type="left" style={{fontSize:'0.90em'}}/>Back to all Tests
										</Link>
									)}
								/>
								<Route
									path="/admin/"
									render={() =>(
										<Link to="/admin/my-questions/" style={{color:'rgba(0, 0, 0, 0.65)'}} >
											<Icon type="left" style={{fontSize:'0.90em'}}/>Back to my questions
										</Link>
									)}
								/>
							</Switch>
						</h3>
					</div>
					<div styleName="l-ques-header__center">
					</div>
					<div styleName="l-ques-header__right">
						<Icon type="more"/>
					</div>
				</div>
				<div styleName="l-ques-body">
					<Switch>
						<Route path="/admin/create-question/" exact component={CreateQuestion} />
						<Route path="/admin/create-question/:prob_id/" exact component={CreateQuestion} />
						<Route path="/admin/draft-questions/" exact component={DraftQuestions} />
						<Route path="/admin/my-questions/" exact component={MyQuestions} />
					</Switch>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
	};
};

const mapDispatchToProps = dispatch => {
	return {
	};
};

export default connect( mapStateToProps, mapDispatchToProps )( Questions );
