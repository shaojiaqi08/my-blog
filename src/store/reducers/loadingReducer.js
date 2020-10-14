export default function loading (state= false, action) {
    const {type, payload} = action
    switch (type) {
        case 'CHANGE_LOADING':
            return payload;
        default:
            return state
    }
}
