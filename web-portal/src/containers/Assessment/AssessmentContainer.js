import React, { Component } from "react"
import { connect } from "react-redux"
import ProblemList from "../../components/Problem/ProblemList"
import { fetchAssessment, selectProblem } from "../../store/actions/AssessmentActions"
import { withRouter } from 'react-router-dom'
import {store} from  '../../index'

// for now it is just a dummy
// all logic is in the Problem Component

class AssessmentContainer extends Component {

	constructor(props) {
		super(props)
		this.state = {
			assessment_id: this.props.match.params.id
		}
	}

	componentDidMount() {
		if (this.props.problems.length === 0) {
			this.props.fetchAssessment(this.state.assessment_id)
		}
	}

	selectProblem = (problem) => {
		selectProblem(problem)(store.dispatch, store.getState)
	}

	render() {
		return (
			<ProblemList
				problems={this.props.problems}
				selectProblem={this.selectProblem}
				assessment_id={this.props.assessment_id}
			/>
		);
	}
}

const mapStateToProps = state => {
	return {
		problems: state.assessment.problems,
		assessment_id: state.assessment.id
	};
};

const mapDispatchToProps = dispatch => {
	return {
		selectProblem: problem => dispatch(selectProblem(problem)),
		fetchAssessment: assessment_id => dispatch(fetchAssessment(assessment_id))
	}
};

export default withRouter(
	connect(mapStateToProps,mapDispatchToProps)(AssessmentContainer)
);
