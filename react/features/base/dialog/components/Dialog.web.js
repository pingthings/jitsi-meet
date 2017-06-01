import AKButton from '@atlaskit/button';
import AKButtonGroup from '@atlaskit/button-group';
import ModalDialog from '@atlaskit/modal-dialog';
import React from 'react';
import { connect } from 'react-redux';

import { translate } from '../../i18n';

import AbstractDialog from './AbstractDialog';

/**
 * The ID to be used for the cancel button if enabled.
 * @type {string}
 */
const CANCEL_BUTTON_ID = 'modal-dialog-cancel-button';

/**
 * The ID to be used for the ok button if enabled.
 * @type {string}
 */
const OK_BUTTON_ID = 'modal-dialog-ok-button';

/**
 * Web dialog that uses atlaskit modal-dialog to display dialogs.
 */
class Dialog extends AbstractDialog {

    /**
     * Web dialog component's property types.
     *
     * @static
     */
    static propTypes = {
        /**
         * This is the body of the dialog, the component children.
         */
        children: React.PropTypes.node,

        /**
         * Whether the dialog is modal. This means clicking on the blanket will
         * leave the dialog open. No cancel button.
         */
        isModal: React.PropTypes.bool,

        /**
         * Width of the dialog, can be:
         * - 'small' (400px), 'medium' (600px), 'large' (800px),
         * 'x-large' (968px)
         * - integer value for pixel width
         * - string value for percentage
         */
        width: React.PropTypes.string
    }

    /**
     * Initializes a new Dialog instance.
     *
     * @param {Object} props - The read-only properties with which the new
     * instance is to be initialized.
     */
    constructor(props) {
        super(props);

        this._onKeyDown = this._onKeyDown.bind(this);
        this._setDialogElement = this._setDialogElement.bind(this);
    }

    /**
     * React Component method that executes once component is mounted.
     *
     * @inheritdoc
     */
    componentDidMount() {
        this.updateButtonFocus();

        // adds listener for enter key
        document.addEventListener('keydown', this._onKeyDown);
    }

    /**
     * Clears the listener.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentWillUnmount() {
        document.removeEventListener('keydown', this._onKeyDown);
    }

    /**
     * React Component method that executes once component is updated.
     *
     * @inheritdoc
     * @returns {void}
     */
    componentDidUpdate(prevProps) {
        // if there is an update in any of the buttons enable/disable props
        // update the focus if needed
        if (prevProps.okDisabled !== this.props.okDisabled
            || prevProps.cancelDisabled !== this.props.cancelDisabled) {
            this.updateButtonFocus();
        }
    }

    /**
     * Updates focused button, if we have a reference to the dialog element
     * focus on available button if there is no focus already.
     *
     * @returns {void}
     */
    updateButtonFocus() {
        if (this._dialogElement) {

            // if we have a focused element inside the dialog, skip changing
            // the focus
            if (this._dialogElement.contains(document.activeElement)) {
                return;
            }

            let buttonToFocus;

            if (this.props.okDisabled) {
                buttonToFocus = this._dialogElement
                    .querySelector(`[id=${CANCEL_BUTTON_ID}]`);
            } else {
                buttonToFocus = this._dialogElement
                    .querySelector(`[id=${OK_BUTTON_ID}]`);
            }

            if (buttonToFocus) {
                buttonToFocus.focus();
            }
        }
    }

    /**
     * Listening for Enter key to submit the dialog.
     *
     * @param {Object} e - the key event
     * @returns {void}
     * @private
     */
    _onKeyDown(e) {
        const enterKeyCode = 13;

        if (e.key === enterKeyCode) {
            this._onSubmit();
        }
    }

    /**
     * Sets the instance variable for the component's dialog element so it
     * can be accessed directly.
     *
     * @param {Object} element - The DOM element for the component's dialog.
     * @private
     * @returns {void}
     */
    _setDialogElement(element) {
        this._dialogElement = element;
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        return (
            <div ref = { this._setDialogElement }>
                <ModalDialog
                    footer = { this._renderFooter() }
                    header = { this._renderHeader() }
                    isOpen = { true }
                    onDialogDismissed = { this._onCancel }
                    width = { this.props.width || 'medium' }>
                    <div>
                        <form
                            className = 'modal-dialog-form'
                            id = 'modal-dialog-form'
                            onSubmit = { this._onSubmit }>
                            { this.props.children }
                        </form>
                    </div>
                </ModalDialog>
            </div>);
    }

    /**
     * Render cancel button.
     *
     * @returns {*} The cancel button if enabled and dialog is not modal.
     * @private
     */
    _renderCancelButton() {
        if (this.props.cancelDisabled || this.props.isModal) {
            return null;
        }

        return (
            <AKButton
                appearance = 'subtle'
                id = { CANCEL_BUTTON_ID }
                onClick = { this._onCancel }>
                { this.props.t(this.props.cancelTitleKey || 'dialog.Cancel') }
            </AKButton>
        );
    }

    /**
     * Render component in dialog footer.
     *
     * @returns {ReactElement}
     * @private
     */
    _renderFooter() {
        return (
            <footer className = 'modal-dialog-footer'>
                <AKButtonGroup>
                    { this._renderCancelButton() }
                    { this._renderOKButton() }
                </AKButtonGroup>
            </footer>
        );
    }

    /**
     * Render component in dialog header.
     *
     * @returns {ReactElement}
     * @private
     */
    _renderHeader() {
        const { t } = this.props;

        return (
            <header>
                <h2>
                    { this.props.titleString || t(this.props.titleKey) }
                </h2>
            </header>
        );
    }

    /**
     * Render ok button.
     *
     * @returns {*} The ok button if enabled.
     * @private
     */
    _renderOKButton() {
        if (this.props.okDisabled) {
            return null;
        }

        return (
            <AKButton
                appearance = 'primary'
                form = 'modal-dialog-form'
                id = { OK_BUTTON_ID }
                isDisabled = { this.props.okDisabled }
                onClick = { this._onSubmit }>
                { this.props.t(this.props.okTitleKey || 'dialog.Ok') }
            </AKButton>
        );
    }

    /**
     * Dispatches action to hide the dialog.
     *
     * @returns {void}
     */
    _onCancel() {
        if (this.props.isModal) {
            return;
        }

        super._onCancel();
    }
}

export default translate(connect()(Dialog));
