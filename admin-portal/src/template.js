import React, { Component } from 'react';
import { connect } from 'react-redux';

import './TemplateClass.scss';

class TemplateClass extends Component {
	render() {
		return (
			<React.Fragment>

			</React.Fragment>
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

export default connect( mapStateToProps, mapDispatchToProps ) ( TemplateClass );
