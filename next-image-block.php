<?php
/**
 * Plugin Name:     Next Image Block
 * Description:     An image block based on next/image.
 * Version:         1.0.0
 * Author:          Adam Silverstein
 * License:         Apache License 2.0
 * License URI:     https://www.apache.org/licenses/LICENSE-2.0
 * Text Domain:     next-image-block
 *
 * @package         next-image-block
 */

function create_block_next_image_block_block_init() {
	$dir = __DIR__;

	$script_asset_path = "$dir/build/index.asset.php";
	if ( ! file_exists( $script_asset_path ) ) {
		throw new Error(
			'You need to run `npm start` or `npm run build` for the "create-block/next-image-block" block first.'
		);
	}
	$index_js     = 'build/index.js';
	$script_asset = require( $script_asset_path );
	wp_register_script(
		'next-image-block-block-editor',
		plugins_url( $index_js, __FILE__ ),
		$script_asset['dependencies'],
		$script_asset['version']
	);
	wp_set_script_translations( 'next-image-block-block-editor', 'next-image-block' );

	register_block_type( 'create-block/next-image-block', array(
		'editor_script' => 'next-image-block-block-editor',
		'editor_style'  => 'next-image-block-block-editor',
		'style'         => 'next-image-block-block',
	) );
}
add_action( 'init', 'create_block_next_image_block_block_init' );
