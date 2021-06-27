import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Button } from 'antd';

import * as actions from '../../../../store/actions';
import Dropbox from './Dropbox/Dropbox';
import './TestcaseTab.scss';
import TestcaseForm from './TestcaseForm/TestcaseForm';

class TestcaseTab extends React.Component {
	constructor(props) {
		super(props);
		this.tcRef = {};
	}

	next = () => {
		let tcs = this.props.test_cases.length;
		for(let i=0;i<tcs;i++) {
			this.tcRef[i].update_tc();
		}
		this.props.next();
	}

	render() {
		return (
			<div styleName="tctab">
				<div styleName="dropbox">
					<div styleName="dropbox__left">
						<Dropbox type="Single" setCases={this.props.setProblemTestCases} prob_id={this.props.prob_id} />
					</div>
					<div styleName="dropbox__right">
						<Dropbox type="Multiple" setCases={this.props.setProblemTestCases} prob_id={this.props.prob_id} />
					</div>
				</div>
				<div styleName="title">
					Uploaded Test Cases
				</div>
				<div styleName="testcases">
					{this.props.test_cases.map((tc,ind)=>(
						<div key={tc.id}>
							<TestcaseForm tc={tc} p_id={this.props.prob_id} wrappedComponentRef={(ref) => { this.tcRef[ind] = ref; return true; }}/>
						</div>
					))}
				</div>
				<div styleName="buttons">
					<Button styleName="form__button"> Cancel </Button>
					<Button type="primary" styleName="form__button" onClick={this.next}> Next </Button>
				</div>
			</div>
		);
	}
}


const mapStateToProps = state => {
	return {
		prob_id: state.problem.problem.id,
		test_cases: state.problem.problem.test_cases || [],
	};
};

const mapDispatchToProps = dispatch => {
	return {
		setProblemTestCases: (tc) => dispatch(actions.setProblemTestCases({test_cases:tc})),
	};
};

export default withRouter(connect( mapStateToProps, mapDispatchToProps ) ( TestcaseTab ));

