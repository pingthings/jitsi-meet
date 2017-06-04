import { ReducerRegistry } from '../base/redux';

import { SET_DEVICE_SELECTION_POPUP } from './actionTypes';

/**
 * Listen for actions which changes the state of the popup window for the device
 * selection.
 *
 * @param {Object} state - The Redux state of the feature
 * features/device-selection.
 * @param {Object} action - Action object.
 * @param {string} action.type - Type of action.
 * @param {Object} action.popupDialog - Object that stores the current Window
 * object of the popup and the Transport instance. If no popup is shown the
 * the value will be undefined.
 * @returns {Object}
 */
ReducerRegistry.register('features/device-selection',
    (state = {}, action) => {
        if (action.type === SET_DEVICE_SELECTION_POPUP) {
            return {
                ...state,
                popupDialog: action.popupDialog
            };
        }

        return state;
    });
