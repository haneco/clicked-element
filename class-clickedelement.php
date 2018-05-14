<?php
/**
 * ClickedElement class
 *
 * @package ClickedElement
 */

/**
 * ClickedElement
 */
class ClickedElement {

	/**
	 * Install
	 */
	static function install() {
		global $wpdb;

		$table_name = $wpdb->prefix . CLICKED_ELEMENT_TABLE;

		$charset_collate = $wpdb->get_charset_collate();

		$sql = "CREATE TABLE $table_name (
					id mediumint(9) NOT NULL AUTO_INCREMENT,
					clicked_dt datetime DEFAULT '0000-00-00 00:00:00' NOT NULL,
					path tinytext NOT NULL,
					xpath text NOT NULL,
					UNIQUE KEY id (id)
				) $charset_collate;";

		include_once ABSPATH . 'wp-admin/includes/upgrade.php';
		dbDelta( $sql );

		add_option( 'CLICKED_ELEMENT_VERSION', CLICKED_ELEMENT_VERSION );
	}

	/**
	 * Insert
	 *
	 * @param string $path URL path.
	 * @param string $xpath clicked XPath.
	 */
	static function insert( $path, $xpath ) {
		global $wpdb;

		$table_name = $wpdb->prefix . CLICKED_ELEMENT_TABLE;

		$wpdb->insert(
			$table_name,
			array(
				'clicked_dt' => current_time( 'mysql' ),
				'path'       => $path,
				'xpath'      => $xpath,
			)
		);
	}

	/**
	 * View
	 *
	 * @param string $name view name.
	 * @param array  $args arguments.
	 */
	public static function view( $name, array $args = array() ) {
		foreach ( $args as $key => $val ) {
			$$key = $val;
		}

		load_plugin_textdomain( 'clickedelement' );

		$file = CLICKED_ELEMENT__PLUGIN_DIR . 'views/' . $name . '.php';

		include( $file );
	}

	/**
	 * URL list.
	 *
	 * @param string $date Date.
	 */
	public static function url_list( $date ) {
		global $wpdb;

		$table_name = $wpdb->prefix . CLICKED_ELEMENT_TABLE;
		$result     = $wpdb->get_results(
			$wpdb->prepare( "SELECT DISTINCT path FROM $table_name WHERE clicked_dt LIKE %s", $date . '%' )
		);

		$list = [];
		foreach ( $result as $row ) {
			$postid = url_to_postid( $row->path );
			$post   = get_post( $postid );
			$list[] = [
				'path'  => $row->path,
				'title' => $post->post_title ?: '',
			];
		}

		return $list;
	}

	/**
	 * XPath list.
	 *
	 * @param string $date Date.
	 * @param string $path URL path.
	 */
	public static function xpaths( $date, $path ) {
		global $wpdb;

		$table_name = $wpdb->prefix . CLICKED_ELEMENT_TABLE;
		$result     = $wpdb->get_results(
			$wpdb->prepare(
				"SELECT DISTINCT xpath, COUNT(*) AS count FROM $table_name WHERE clicked_dt LIKE %s AND path = %s GROUP BY xpath ORDER BY count DESC",
				$date . '%',
				$path
			)
		);

		$list = [];
		foreach ( $result as $row ) {
			$list[] = [
				'xpath' => $row->xpath,
				'count' => $row->count,
			];
		}
		return $list;
	}
}
