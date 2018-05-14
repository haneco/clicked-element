<?php
/**
 * ClickedElement_Admin class
 *
 * @package ClickedElement
 */

/**
 * ClickedElement_Admin
 */
class ClickedElement_Admin {

	private static $initiated = false;

	/**
	 * Initialize
	 */
	public static function init() {
		if ( ! self::$initiated ) {
			self::init_hooks();
		}
	}

	/**
	 * Initialize hooks
	 */
	public static function init_hooks() {
		add_action( 'admin_menu', array( 'ClickedElement_Admin', 'admin_menu' ) );
	}

	/**
	 * Add admin menu
	 */
	public static function admin_menu() {
		$hook = add_menu_page(
			__( 'Clicked element', 'clickedelement' ),
			__( 'Clicked element', 'clickedelement' ),
			'manage_options',
			'clickedelement-admin',
			array( 'ClickedElement_Admin', 'display_page' )
		);
	}

	/**
	 * Display analytics page
	 */
	public static function display_page() {
		ClickedElement::view( 'analytics' );
	}
}
