import uiComponent from './index'

import {connect} from 'react-redux'

import {mapStateToProps, mapDispatchToProps} from '../../utils/mapUserStateDispatch'


const connectComponent = connect(mapStateToProps, mapDispatchToProps)(uiComponent)

export default connectComponent
