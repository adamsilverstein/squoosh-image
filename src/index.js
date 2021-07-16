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

import { ImagePool } from "@squoosh/lib";


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
	const { isSelected , AVIFImageEnabled} = props;
	const { attributes: { status }, setAttributes } = props;

	if ( ! isSelected ) {
		return null;
	}

	// If AVIF is enabled and the images haven't been generated, then generate them.
	if ( AVIFImageEnabled && status != 'generated' ) {
		setAttributes( { status: 'generating' } );
		generateImages( props );
	}

	return (
		<InspectorControls>
			<PanelBody title={ __( 'Next Image Settings', 'squoosh/image' ) }>
				<AVIFImageEnabledToggle { ...props }/>
				{ status && status }
			</PanelBody>
		</InspectorControls>
	);
};

const generateImages= ( props ) => {
	const { attributes: { images }, setAttributes } = props;
	if ( ! images[ 'avif' ] ) {
		const ImagePool = new ImagePool();
		console.log( props );
		const image = imagePool.ingestImage("./squoosh.jpeg");

	}

}


const AVIFImageEnabledToggle = ( props ) => {
	const { attributes: { AVIFImageEnabled }, setAttributes } = props;

	return (
		<ToggleControl
			label={ __( 'Save in AVIF format', 'squoosh/image' ) }
			checked={ AVIFImageEnabled }
			onChange={ () => {
				setAttributes( { AVIFImageEnabled: ! AVIFImageEnabled } );
			} }
		/>
	);
};

AVIFImageEnabledToggle.propTypes = {
	attributes: PropTypes.shape( {
		AVIFImageEnabled: PropTypes.string,
	} ),
	setAttributes: PropTypes.func.isRequired,
};

const addNextImageAttributes = ( settings, name ) => {
	if ( 'core/image' === name ) {
		if ( ! settings.attributes ) {
			settings.attributes = {};
		}
		settings.attributes.AVIFImageEnabled = {
			type: 'boolean',
			default: false,
		};
	}
	return settings;
}

addFilter( 'blocks.registerBlockType', 'nextImage/addAttributes', addNextImageAttributes );
