import React, { Component } from 'react';
import { withRouter } from 'react-router';
import { connect } from 'react-redux';
import { Tooltip, Icon, Form, Select } from 'antd';
import moment from 'moment';

import * as actions from '../../../store/actions';
import './TimeLine.scss';
import { activeQuestionSelector, bestSubmissionSelector } from '../../../store/selectors';

const { Option } = Select;

class TimelineItem extends Component {
	setCurrSubmission = (data) => {
		this.props.setCurrSubmission(data.problem_id,data.id)
	}
	render() {
		let curr = (this.props.data.id === this.props.curr_submission ? "true" : "false")
		let best = (this.props.data.score === this.props.best_submission.score ? "true" : "false")
		return (
			<div styleName="timeline-item">
				<div styleName="above-circle">
					{this.props.data.score} pts
				</div>
				<div styleName="circle pointable" curr={curr} onClick={()=>this.setCurrSubmission(this.props.data)} />
				{best==="true" ? (
					<Tooltip title="Best Submission" placement="bottom">
						<div styleName="below-circle" best={best}>
							{moment(this.props.data.creation_date).format("hh:mm A")}
						</div>
					</Tooltip>
				):(
					<div styleName="below-circle" best={best}>
						{moment(this.props.data.creation_date).format("hh:mm A")}
					</div>
				)}
			</div>
		)
	}
}

class TimelineCornerItem extends Component {
	shiftData = (dir) => {
		this.props.shiftData(dir)
	}
	render() {
		let pointable = (this.props.count > 0 ? "true" : "false")
		return (
			<div styleName="timeline-corner">
				<div styleName="timeline-corner__box" pointable={pointable} onClick={()=>this.shiftData(this.props.dir)}>
					{this.props.dir === "prev" && <Icon type="left" styleName="timeline-corner__arrow"/>}
					{this.props.dir === "next" && <Icon type="right" styleName="timeline-corner__arrow"/>}
					{this.props.count}
				</div>
			</div>
		)
	}
}

class TimeLine extends Component {
	constructor(props) {
		super(props);
		this.state = {
			submissions: [],
			prev:0,
			next:0,
			slots:[],
			max:8,
		}
	}

	componentDidMount() {
		this.init()
	}

	componentDidUpdate(prevProps) {
		if (this.props.submissions !== prevProps.submissions) {
			this.init();
		}
	}

	init = () => {
		let submissions = [];
		if(this.props.submissions) {
			submissions = Object.values(this.props.submissions)
		}
		submissions.sort(function(a,b) {
			a = moment(a.creation_date);
			b = moment(b.creation_date);
			return a.diff(b);
		})

		let curr_loc = 0, total = submissions.length;
		for(curr_loc=0;curr_loc<total;curr_loc++) {
			if(submissions[curr_loc].id === this.props.problem.curr_submission) {
				break;
			}
		}
		let next = 0, prev = 0;
		if(submissions.length > this.state.max) { // first 0 1 2 3
			if(curr_loc < this.state.max/2) {
				prev = 0;
				next = total - this.state.max;
			} else if(curr_loc > (total-1) - this.state.max/2) { // last 0 1 2 3
				next = 0;
				prev = total - this.state.max;
			} else {
				prev = curr_loc - this.state.max/2;
				next = total - this.state.max - prev;
			}
		}

		let slots = [];
		if(submissions.length > this.state.max) {
			let idx = 0;
			while(idx<submissions.length) {
				let last = idx+this.state.max-1;
				if(last >= submissions.length) {
					last = submissions.length-1;
				}
				let start = moment(submissions[idx].creation_date).format("hh:mm A");
				let end = moment(submissions[last].creation_date).format("hh:mm A");
				slots.push(start + ' - ' + end);
				idx+=this.state.max;
			}
		}
		this.setState({submissions,next,prev,slots});
	}

	shiftData = (dir) => {
		if(dir==="prev") {
			if(this.state.prev>0) this.setState({prev:this.state.prev-1,next:this.state.next+1});
		} else {
			if(this.state.next>0) this.setState({prev:this.state.prev+1,next:this.state.next-1});
		}
	}

	updateslot = (idx) => {
		let next = this.state.submissions.length - ((idx+1)*this.state.max);
		if(next < 0) next = 0;
		this.setState({prev:idx*this.state.max,next});
	}

	render() {
		let selected_slot = "Select Slot";
		if(this.state.submissions.length > this.state.prev && this.state.submissions.length-1 > this.state.next) {
			let first = moment(this.state.submissions[this.state.prev].creation_date).format("hh:mm A");
			let last = moment(this.state.submissions[this.state.submissions.length-1 - this.state.next].creation_date).format("hh:mm A");
			selected_slot = first + " - " + last;
		}
		return (
			<React.Fragment>
				<div styleName="c-timeline__title">Choose Time</div>
				<div styleName="c-timeline">
					<div styleName="c-timeline__dropdown">
						{this.state.slots.length > 0 && (
							<Form>
								<Form.Item>
									<Select value={selected_slot} styleName="" onChange={e=>this.updateslot(e)}>
										{this.state.slots.map((data,idx) => (
											<Option key={idx} value={idx}>{data}</Option>
										))}
									</Select>
								</Form.Item>
							</Form>
						)}
					</div>
					<div styleName="c-timeline__bar">
						<TimelineCornerItem dir="prev" count={this.state.prev} shiftData={this.shiftData}/>
						{this.state.submissions.map((data, idx) => {
							if(idx < this.state.prev || idx > (this.state.submissions.length-1 - this.state.next)) return null;
							return(
								<TimelineItem 
									data={data}
									curr_submission={this.props.problem.curr_submission}
									best_submission={this.props.best_submission}
									key={idx}
									setCurrSubmission={this.props.setCurrSubmission}
								/>
							)
						})}
						<TimelineCornerItem dir="next" count={this.state.next} shiftData={this.shiftData}/>
					</div>
				</div>
			</React.Fragment>
		)
	}
}

const mapStateToProps = state => {
	return {
		assessment: state.assessment,
		best_submission: bestSubmissionSelector(state.assessment),
		problem: activeQuestionSelector(state.assessment),
		submissions: activeQuestionSelector(state.assessment).submissions,
	};
};

const mapDispatchToProps = dispatch => {
	return {
		setCurrSubmission: (question_id,id) => dispatch(actions.setCurrSubmission({question_id,data:id})),
	};
};

export default withRouter(connect( mapStateToProps, mapDispatchToProps, null, {forwardRef:true} )( TimeLine ));