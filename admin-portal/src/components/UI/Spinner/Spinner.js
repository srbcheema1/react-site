import  React from 'react';
import BackDrop from '../Backdrop/Backdrop'
import { Spin} from 'antd';
import './Spinner.scss'
//const antIcon = <Icon type="loading" style={{ color: 'red' }} spin />;
const spinner = ()  =>(
        <div>
            <BackDrop show={true}/>
            <div styleName="spinner"><Spin  tip = "Loading..." size = "large" /></div>
        </div>
  );


export default spinner;