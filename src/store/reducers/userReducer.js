export default function userReducer (state={}, action) {
    const {type, payload} = action
    switch (type) {
        case 'CHANGE_USERNAME':
            return JSON.parse(JSON.stringify(payload));
        default:
            return state
    }
}
