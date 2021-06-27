import React, { Component } from "react";
import './TestComplete.scss';
import success_top from "../../assets/images/testcomplete/success-top.png";
import success_bot_r from "../../assets/images/testcomplete/success-bot-r.png";
import success_bot_l from "../../assets/images/testcomplete/success-bot-l.png";
//allows the user to change language
class TestComplete extends Component {

	render() {
		return (
			<div styleName="c-msg-box">
				<div styleName="c-msg-box__top-image">
					<img src={success_top} alt='success-top'/>
				</div>
				<h2 className="sub-header-font-size-mid bold">{this.props.testTitle?this.props.testTitle:"Sample Test"}</h2>
				<p>
					Your test has been successfully submitted<br/>
					CodeHall has received your test report
				</p>
				<div styleName="c-msg-box__bottom-image">
					<img styleName="c-msg-box__bottom-image-left" src={success_bot_l} alt='success-bot-r'/>
					<img styleName="c-msg-box__bottom-image-right" src={success_bot_r} alt='success-bot-l'/>
				</div>
			</div>
		)
	}
}

export default TestComplete;