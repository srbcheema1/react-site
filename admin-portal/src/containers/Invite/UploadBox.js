import React, { Component } from "react";
import { Upload, Icon } from "antd";

class UploadBox extends Component {
	state = {
		fileList: [],
	}

	handleChange = info => {
		let fileList = [...info.fileList];
		let max_files = 1;// this is number of files one can upload
		fileList = fileList.slice(-1* max_files);
		fileList = fileList.map(file => {
			if (file.response) {
				file.url = file.response.url;
			}
			return file;
		});
		this.setState({fileList})
	};

	onSuccess = (res) => {
		this.props.onSuccess(res)
	}

	onError = (err) => {
		this.props.onError(err)
	}

	render () {
		const uploadprops = {
			accept: '.csv',
			onChange: this.handleChange,
			multiple: false,// can select multiple at once
			fileList: this.state.fileList,
			listType: 'text', // picture, picture-card, text
			showUploadList: false,// do it false to avoid those files list display

			// call back methods to the action.
			onSuccess: this.onSuccess,
			onError: this.onError,
		};
		return (
			<React.Fragment>
				{this.props.loading ? (
					<React.Fragment>
						<Icon type="loading" /> Uploading ...
					</React.Fragment>
				) : (
					<React.Fragment>
						<div style={{marginBottom:'10px'}}>
							Upload email via CSV file
						</div>
						<Upload {...uploadprops} customRequest={this.props.uploadCSV} >
							<Icon type="upload" /> Click to upload
						</Upload>
					</React.Fragment>
				)}
			</React.Fragment>
		)
	}
}

export default UploadBox;