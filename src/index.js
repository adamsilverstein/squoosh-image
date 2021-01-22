/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';
import { InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ToggleControl } from '@wordpress/components';
import { addFilter } from '@wordpress/hooks';
import PropTypes from 'prop-types';


/**
 * Lets webpack process CSS, SASS or SCSS files referenced in JavaScript files.
 * All files containing `style` keyword are bundled together. The code used
 * gets applied both to the front of your site and to the editor.
 *
 * @see https://www.npmjs.com/package/@wordpress/scripts#using-css
 */
import './style.scss';

console.log( 'Yo!!' )

const filterBlocksEdit = ( BlockEdit ) => {
	console.log( 'filterBlocksEdit' );
	const EnhancedBlockEdit = function( props ) {
		console.log( 'EnhancedBlockEdit', props );
		const { attributes: { text, ampLayout }, setAttributes, name } = props;
		let inspectorControls;
		if ( 'core/image' === name ) {
			inspectorControls = setUpImageInspectorControls( props );
		}
		return (
			<>
				<BlockEdit { ...props } />
				{ inspectorControls }
			</>
		);
	}

	return EnhancedBlockEdit;
}

addFilter( 'editor.BlockEdit', 'nextImage/filterEdit', filterBlocksEdit, 20 );

/**
 * Set up inspector controls for Image block.
 *
 * @param {Object}  props            Props.
 * @param {boolean} props.isSelected Whether the current block has been selected or not.
 *
 * @return {Object} Inspector Controls.
 */
const setUpImageInspectorControls = ( props ) => {
	const { isSelected } = props;
	if ( ! isSelected ) {
		return null;
	}

	return (
		<InspectorControls>
			<PanelBody title={ __( 'Next Image Settings', 'next/image' ) }>
				<NextImageEnabledToggle { ...props }/>
			</PanelBody>
		</InspectorControls>
	);
};


const NextImageEnabledToggle = ( props ) => {
	const { attributes: { nextImageEnabled }, setAttributes } = props;

	return (
		<ToggleControl
			label={ __( 'Enable next/image features', 'next/image' ) }
			checked={ nextImageEnabled }
			onChange={ () => {
				setAttributes( { nextImageEnabled: ! nextImageEnabled } );
			} }
		/>
	);
};

NextImageEnabledToggle.propTypes = {
	attributes: PropTypes.shape( {
		nextImageEnabled: PropTypes.string,
	} ),
	setAttributes: PropTypes.func.isRequired,
};

const addNextImageAttributes = ( settings, name ) => {
	if ( 'core/image' === name ) {
		if ( ! settings.attributes ) {
			settings.attributes = {};
		}
		settings.attributes.nextImageEnabled = {
			type: 'boolean',
			default: false,
		};
	}
	return settings;
}

addFilter( 'blocks.registerBlockType', 'nextImage/addAttributes', addNextImageAttributes );
