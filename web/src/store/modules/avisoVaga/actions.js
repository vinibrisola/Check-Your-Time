import types from './types'

export function allAvisoVagas() {
    return { type: types.ALL_AVISOVAGAS };
}
export function updateAvisoVaga(payload) {
    return { type: types.UPDATE_AVISOVAGA, payload };
}
export function addAvisoVaga(){
    return { type: types.ADD_AVISOVAGA};
}
export function resetAvisoVaga(){
    return { type: types.RESET_AVISOVAGA};
}
export function removeAvisoVaga(){
    return { type: types.REMOVE_AVISOVAGA};
}
