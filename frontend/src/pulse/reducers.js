
import { handleActions } from 'redux-actions';

import {
    FETCH_PULSES,
    SET_EDITING_PULSE,
    UPDATE_EDITING_PULSE,
    SAVE_EDITING_PULSE,
    FETCH_CARDS,
    FETCH_USERS
} from "./actions";

export const pulses = handleActions({
    [FETCH_PULSES]: { next: (state, { payload }) => ({ ...payload.entities.pulse }) },
    [SAVE_EDITING_PULSE]: { next: (state, { payload }) =>  ({ ...state, [payload.id]: payload }) }
}, {});

export const pulseList = handleActions({
    [FETCH_PULSES]: { next: (state, { payload }) => payload.result },
    // [DELETE_PULSE]: { next: (state, { payload }) => state }
}, null);

export const editingPulse = handleActions({
    [SET_EDITING_PULSE]:    { next: (state, { payload }) => payload },
    [UPDATE_EDITING_PULSE]: { next: (state, { payload }) => payload },
    [SAVE_EDITING_PULSE]:   { next: (state, { payload }) => payload }
}, { name: null, cards: [], channels: [] });


// NOTE: duplicated from dashboards/reducers.js
export const cards = handleActions({
    [FETCH_CARDS]: { next: (state, { payload }) => ({ ...payload.entities.card }) }
}, {});
export const cardList = handleActions({
    [FETCH_CARDS]: { next: (state, { payload }) => payload.result }
}, []);

// NOTE: duplicated from admin/people/reducers.js
export const users = handleActions({
    [FETCH_USERS]: { next: (state, { payload }) => ({ ...payload.entities.user }) }
}, []);
