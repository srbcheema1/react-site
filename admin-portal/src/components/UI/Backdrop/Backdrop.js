import React from 'react';
import  './Backdrop.scss';
import PropTypes from 'prop-types';


const backdrop = (props) =>{
  return(
  props.show ? <div styleName="backdrop" ></div> : null
  );
}


backdrop.propTypes = {
    show: PropTypes.bool,

}


export default backdrop;