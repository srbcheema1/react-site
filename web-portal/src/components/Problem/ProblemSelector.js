import React, { Component } from "react"
import './ProblemSelector.scss'

class ProblemSelector extends Component {

	render() {
		let items = null
		items = this.props.problems.map( (p, index) => (
			<li styleName="c-problem-selector__list-item" key={p.id}>
				<div styleName="c-problem-selector__marker-div">
					<span styleName="c-problem-selector__marker-box" ck_selected={p.isCurrent?"true":"false"}/>
					<span styleName="c-problem-selector__marker" ck_selected={p.isCurrent?"true":"false"}/>
				</div>
				<div
					styleName="c-problem-selector__icon" 
					problem_id={p.id} 
					onClick={() => this.props.onProblemClick(p.id)}
					status={p.status}
				>
					{index+1}
				</div>
				<div styleName="c-problem-selector__balancer">
				</div>
			</li>
		))

		let points = this.props.problems.filter(p => p.isCurrent).reduce( (acc, p) => acc + p.points, 0)
		return (
			<div styleName="c-problem-selector">
				<div styleName="c-problem-selector__points">
					<span>{points} Points</span>
				</div>
				<ul styleName="c-problem-selector__plist">
					{items}
				</ul>
			</div>
		)
	}
}

export default ProblemSelector