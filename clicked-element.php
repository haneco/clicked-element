<?php
/**
 * Plugin Name:     Clicked Element
 * Plugin URI:      PLUGIN SITE HERE
 * Description:     PLUGIN DESCRIPTION HERE
 * Author:          haneco (Blue Clip)
 * Author URI:      https://blueclip.jp
 * Text Domain:     Clicked Element
 * Domain Path:     /languages
 * Version:         0.1.0
 *
 * @package ClickedElement
 */

define( 'CLICKED_ELEMENT_VERSION', '0.1.0' );
define( 'CLICKED_ELEMENT_TABLE', 'clickedelement' );
define( 'CLICKED_ELEMENT__PLUGIN_DIR', plugin_dir_path( __FILE__ ) );

require_once( CLICKED_ELEMENT__PLUGIN_DIR . 'class-clickedelement.php' );

register_activation_hook( __FILE__, [ 'ClickedElement', 'install' ] );

/**
 * Print admin-ajax.php url.
 */
function clicked_element_js() {
	echo '<script>var admin_ajax_url = "' . admin_url( 'admin-ajax.php', __FILE__ ) . '";</script>';
}
add_action( 'wp_footer', 'clicked_element_js' );
add_action( 'admin_footer', 'clicked_element_js' );

if ( is_admin() ) {
	require_once( CLICKED_ELEMENT__PLUGIN_DIR . 'class-clickedelement-admin.php' );
	add_action( 'init', array( 'ClickedElement_Admin', 'init' ) );
	add_action(
		'admin_enqueue_scripts', function () {
			wp_enqueue_script( 'ClickedElement', plugins_url( 'js/analytics.js', __FILE__ ), array(), false, true );
		}
	);
}

add_action(
	'wp_enqueue_scripts', function () {
		if ( false === current_user_can( 'administrator' ) ) {
			wp_enqueue_script( 'ClickedElement', plugins_url( 'js/ClickedElement.js', __FILE__ ) );
		}
	}
);

/**
 * Insert
 */
function clicked_element_insert() {
	$result = [];
	try {
		ClickedElement::insert(
			filter_input( INPUT_POST, 'path' ),
			filter_input( INPUT_POST, 'xpath' )
		);

		$result = [ 'result' => true ];
	} catch ( Exception $e ) {
		$result = [
			'result' => false,
			'error'  => $e->getMessage(),
		];
		http_response_code( 500 );
	}
	echo json_encode( $result );
	die();
}
add_action( 'wp_ajax_clicked_element_insert', 'clicked_element_insert' );
add_action( 'wp_ajax_nopriv_clicked_element_insert', 'clicked_element_insert' );

/**
 * URL List of selected date
 */
function clicked_element_urls() {
	$date = filter_input( INPUT_GET, 'date' );
	$list = ClickedElement::url_list( $date );
	echo json_encode( $list );
	die();
}
add_action( 'wp_ajax_clicked_element_urls', 'clicked_element_urls' );


/**
 * XPaths of selected date and path
 */
function clicked_element_xpaths() {
	$date = filter_input( INPUT_GET, 'date' );
	$path = filter_input( INPUT_GET, 'path' );
	$list = ClickedElement::xpaths( $date, $path );
	echo json_encode( $list );
	die();
}
add_action( 'wp_ajax_clicked_element_xpaths', 'clicked_element_xpaths' );

