

export const mapStateToProps = state => {
    return {
        user: {...state.userReducer},
        navLink: {...state.navLinkReducer},
        loading: {...state.loadingReducer}
    }
}

export const mapDispatchToProps = dispatch => {
    return {
        changeUsername(username){
            dispatch({
                type: 'CHANGE_USERNAME',
                payload: username
            })
        },
        changeLoading(loading){
            dispatch({
                type: 'CHANGE_LOADING',
                payload: loading
            })
        }
    }
}

