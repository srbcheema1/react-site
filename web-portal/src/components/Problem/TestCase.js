import React, { Component } from "react";
import "./TestCase.scss"
import { Alert, Button, notification, Tooltip } from 'antd';
import 'font-awesome/css/font-awesome.min.css';

class TestCase extends Component {

	constructor(props) {
		super(props)
		this.alertRef = React.createRef();
	}

	copy_to_clipboard = (text) => {
		navigator.clipboard.writeText(text);
		notification.open({
			style:{
				marginLeft:'100px',
				width:'250px'
			},
			message: 'Text Copied to Clipboard',
			duration: 2,
			icon: <i className="fa fa-copy"/>
		});
	}

	testCode = () => {
		this.props.testCode()
		if (this.alertRef && this.alertRef.current) {
			this.alertRef.current.scrollIntoView();
		}
	}

	render() {
		let count=0;
		const sampleCase=(this.props.testcases.length!==0)?
			this.props.testcases.map(
				function(tc) {
					if(tc.visible===true) {
						count++;
						return (
							<div key={tc.id}>
								<h3 className="font-weight-medium">Sample Case {count}</h3>
								<div styleName="sample_io">
									<div styleName="sample_io_div">
										<div styleName="sample_io_header">
											<h4>Input</h4>
											<Tooltip title="Copy to clipboard">
												<i className="fa fa-copy" onClick={() => this.copy_to_clipboard(tc.stdin)}/>
											</Tooltip>
										</div>
										<textarea rows="4" cols = "50" value = { tc.stdin } readOnly />
									</div>
									<div style={{width:'10px'}}></div>
									<div styleName="sample_io_div">
										<div styleName="sample_io_header">
											<h4>Output</h4>
											<Tooltip title="Copy to clipboard">
												<i className="fa fa-copy" onClick={() => this.copy_to_clipboard(tc.stdout)}/>
											</Tooltip>
										</div>
										<textarea rows="4" cols = "50" value = { tc.stdout } readOnly />
									</div>
								</div>
							</div>
						)
					} else {
						return null
					}
				},
				this
			)
			:"Please select a problem";
		// props stderr and stdout needs to be changed
		const outMessage = this.props.stderr?this.props.stderr:this.props.stdout;
		return (
			<div styleName="c-custom-input">
				<p>
					<em>
						Test whether your code is working as expected by running your code against your own custom input.
						Fill in the input box below and hit Submit Code button to check the code's output.
					</em>
				</p>

				<div ref={this.alertRef}></div>

				<div styleName="custom_io">
					<h3 className="font-weight-medium">Input Format for custom testing</h3>
					<textarea styleName = "custom_io_body" rows = "4" cols = "50" onChange = {(event)=>this.props.setInput(event.target.value)} value={this.props.stdin} />
					<div styleName="custom_io_footer">
						<Button type="primary" onClick={()=>this.testCode()} disabled={!this.props.stdin}>Test Code</Button>
					</div>
				</div>

				{(this.props.verdict && this.props.verdict.name !== "NA") && (
					<React.Fragment>
						<div styleName="custom_io">
							<h3 className="font-weight-medium">Output for custom input</h3>
							<textarea styleName={"custom_io_body" + (this.props.stderr?" c-custom-input__output--error":"")} rows = "4" cols = "50" value={outMessage} readOnly/>
						</div>

						{(this.props.verdict.name === "OK") ?
							<Alert styleName="custom_io_alert"
								message="You must hit the Submit Code button on the editor, to check whether your code passes all testcases for this problem."
								type="success"
							/>:
							<Alert styleName="custom_io_alert" message={this.props.verdict.name} type={this.props.verdict.type} />
						}
					</React.Fragment>
				)}

				<p>
					<em>Here are {count} sample inputs and the corresponding outputs that your code should produce when run.</em>
				</p>

				{sampleCase}
			</div>
		)
	}
}


export default TestCase;
