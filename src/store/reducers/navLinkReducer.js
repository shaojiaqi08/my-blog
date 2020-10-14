export default function navLink (state='', action) {
    const {type, payload} = action
    switch (type) {
        case 'CHANGE_NAV_LINK':
            return payload;
        default:
            return state
    }
}
