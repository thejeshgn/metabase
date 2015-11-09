
import { createAction } from "redux-actions";
import { AngularResourceProxy, createThunkAction } from "metabase/lib/redux";
import { normalize, Schema, arrayOf } from "normalizr";

import moment from "moment";

const card = new Schema('card');
const pulse = new Schema('pulse');
const user = new Schema('user');
// pulse.define({
//   cards: arrayOf(card)
// });

const Pulse = new AngularResourceProxy("Pulse", ["list", "get", "create", "update"]);
const Card = new AngularResourceProxy("Card", ["list"]);
const User = new AngularResourceProxy("User", ["list"]);

export const FETCH_PULSES = 'FETCH_PULSES';
export const SET_EDITING_PULSE = 'SET_EDITING_PULSE';
export const UPDATE_EDITING_PULSE = 'UPDATE_EDITING_PULSE';
export const SAVE_EDITING_PULSE = 'SAVE_EDITING_PULSE';

export const FETCH_CARDS = 'FETCH_CARDS';
export const FETCH_USERS = 'FETCH_USERS';

export const fetchPulses = createThunkAction(FETCH_PULSES, function() {
    return async function(dispatch, getState) {
        let pulses = await Pulse.list();
        return normalize(pulses, arrayOf(pulse));
    };
});

export const setEditingPulse = createThunkAction(SET_EDITING_PULSE, function(id) {
    return async function(dispatch, getState) {
        if (id != null) {
            try {
                return await Pulse.get({ pulseId: id });
            } catch (e) {
            }
        }
        return {
            name: null,
            cards: [],
            channels: []
        }
    };
});

export const updateEditingPulse = createAction(UPDATE_EDITING_PULSE);

export const saveEditingPulse = createThunkAction(SAVE_EDITING_PULSE, function() {
    return async function(dispatch, getState) {
        let { editingPulse } = getState();
        if (editingPulse.id != null) {
            return await Pulse.update(editingPulse);
        } else {
            return await Pulse.create(editingPulse);
        }
    };
});

// NOTE: duplicated from dashboards/actions.js
export const fetchCards = createThunkAction(FETCH_CARDS, function(filterMode = "all") {
    return async function(dispatch, getState) {
        let cards = await Card.list({ filterMode });
        for (var c of cards) {
            c.updated_at = moment(c.updated_at);
        }
        return normalize(cards, arrayOf(card));
    };
});

// NOTE: duplicated from admin/people/actions.js
export const fetchUsers = createThunkAction(FETCH_USERS, function() {
    return async function(dispatch, getState) {
        let users = await User.list();

        for (var u of users) {
            u.date_joined = (u.date_joined) ? moment(u.date_joined) : null;
            u.last_login = (u.last_login) ? moment(u.last_login) : null;
        }

        return normalize(users, arrayOf(user));
    };
});
