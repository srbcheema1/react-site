import React, { Component, useMemo } from 'react'
import Dropzone from 'react-dropzone'
import Loader from './Loader.js'
import axios from 'axios';

const baseStyle = {
	flex: 1,
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	padding: '10px',
	borderWidth: 2,
	borderRadius: 2,
	minHeight:'130px',
	borderColor: '#eeeeee',
	borderStyle: 'dashed',
	backgroundColor: '#fafafa',
	color: '#bdbdbd',
	outline: 'none',
	transition: 'border .24s ease-in-out',
	cursor: 'pointer',
};

const activeStyle = {
	borderColor: '#2196f3'
};

const acceptStyle = {
	borderColor: '#00e676'
};

const rejectStyle = {
	borderColor: '#ff1744'
};

class Dropbox extends Component {
	constructor(props) {
		super(props);
		this.initialstate = {
			file:null,
			task:'empty',
			message:null,
		};
		this.state = this.initialstate;
	}

	Reset=()=>{
		this.setState({...this.initialstate});
	}

	onDropFile=(acceptedFiles)=>{
		this.setState({file:acceptedFiles[0],task:'verfying'})
		const formdata = new FormData();
		formdata.append('file', this.state.file);

		let url = ""
		if(this.props.type==="Single") {
			url = `https://api-qa.codehall.in/copdg/api/problems/${this.props.prob_id}/upload_test_case/`
			axios.post(
				url, formdata, {headers: { 'content-type': 'multipart/form-data' }}
			).then(response => {
				this.setState({task:'empty'})
				this.props.setCases(response.data);
			}).catch(
				error => console.log(error) // Handle the error response object
			);
		} else {
			url = `https://api-qa.codehall.in/copdg/api/problems/${this.props.prob_id}/upload_test_cases/`
			axios.put(
				url, formdata, {headers: { 'content-type': 'multipart/form-data' }}
			).then(response => {
				this.setState({task:'empty'})
				this.props.setCases(response.data);
			}).catch(
				error => console.log(error) // Handle the error response object
			);
		}
	}

	render() {
		return (
			<Dropzone onDrop={this.onDropFile}>{
				({ getRootProps, getInputProps, isDragAccept,
					isDragReject, isDragActive }) => {
					const style = useMemo(() => ({
						...baseStyle,
						...(isDragActive ? activeStyle : {}),
						...(isDragAccept ? acceptStyle : {}),
						...(isDragReject ? rejectStyle : {})
					}), [
						isDragActive,
						isDragReject,
						isDragAccept,
					]);
					return (
						<div {...getRootProps({style})}>
							<input {...getInputProps()} disabled={this.state.task==="_verified"}/>
							<Loader task={this.state.task} type={this.props.type} />
						</div>
					)
				}
			}
			</Dropzone>
		)
	}

}
export default Dropbox;