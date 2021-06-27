import React, { Component } from "react";
import "./ProblemDescription.scss";

//displays  the current problem from state

class ProblemDescription extends Component {

	render() {
		let count=0;
		const title=(this.props.problem.description)?<div styleName="titleStyle">{this.props.problem.title}</div>:"";
		// we display the Input Format, Output format in bold on the UI
		// this needs to be fixed
		const data=(this.props.problem.description)?
			this.props.problem.description.split("\n").map(function(line) {
				if(line.includes("Input format") || line.includes("Output format")|| line.includes("Constraints")) {
					return <div key={count++} styleName="desc-style">{line}</div>;
				} else if(line.includes("Input:") || line.includes("Output:")|| line.includes("Explanation:")) { // srb remove them later
					return <div key={count++} styleName="desc-style">{line}</div>;
				} else {
					return <div key={count++} styleName="contentstyle">{line}</div>;
				}
			})
			:"Please select a problem";

		return(
			<div styleName="c-problem-description">
				{title}
				{data}
			</div>
		)
	}
}

export default ProblemDescription;