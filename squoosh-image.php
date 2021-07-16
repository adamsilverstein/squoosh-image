<?php
/**
 * Plugin Name:     Squoosh Image
 * Description:     Modern images in the block editor with Squoosh.
 * Version:         1.0.0
 * Author:          Adam Silverstein
 * License:         Apache License 2.0
 * License URI:     https://www.apache.org/licenses/LICENSE-2.0
 * Text Domain:     squoosh-image
 *
 * @package         squoosh-image
 */

function create_squoosh_image_init() {
	$dir = __DIR__;

	$script_asset_path = "$dir/build/index.asset.php";
	if ( ! file_exists( $script_asset_path ) ) {
		throw new Error(
			'You need to run `npm start` or `npm run build` for the "create-block/squoosh-image" block first.'
		);
	}
	$index_js     = 'build/index.js';
	$script_asset = require( $script_asset_path );
	wp_register_script(
		'squoosh-image-block-block-editor',
		plugins_url( $index_js, __FILE__ ),
		$script_asset['dependencies'],
		$script_asset['version']
	);
	wp_set_script_translations( 'squoosh-image-block-block-editor', 'squoosh-image' );

	register_block_type( 'create-block/squoosh-image', array(
		'editor_script' => 'squoosh-image-block-block-editor',
		'editor_style'  => 'squoosh-image-block-block-editor',
		'style'         => 'squoosh-image-block-block',
	) );
}
add_action( 'init', 'create_squoosh_image_init' );
