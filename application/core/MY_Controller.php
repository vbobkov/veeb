<?php
/* Vic Bobkov
* 2014-02-09
* MY_Controller.php
*/

define('DEV', 255);
define('MEMBER', 1);
define('GUEST', 0);

class MY_Controller extends CI_Controller {
	private static $menu_items = array(
		'Home' => array(
			'url' => '/home',
			'target' => '',
			'allowed_users' => array(DEV => 1, MEMBER => 1, GUEST => 1)
		),
		'Shenanigans' => array(
			'url' => '/shenanigans',
			'target' => '',
			'allowed_users' => array(DEV => 1, MEMBER => 1, GUEST => 1),
			'subcats' => array(
				'DataTables.js stuff' => array(
					'url' => '/shenanigans/datatables',
					'target' => '',
					'allowed_users' => array(DEV => 1, MEMBER => 1, GUEST => 1),
					'subcats' => array(
						'this is' => array(
							// 'url' => '/shenanigans/datatables/template_generator',
							'url' => '',
							'target' => '',
							'allowed_users' => array(DEV => 1, MEMBER => 1, GUEST => 1)
						),
						'still under' => array(
							'url' => '',
							'target' => '',
							'allowed_users' => array(DEV => 1, MEMBER => 1, GUEST => 1)
						),
						'construction' => array(
							'url' => '',
							'target' => '',
							'allowed_users' => array(DEV => 1, MEMBER => 1, GUEST => 1)
						)
					)
				),
				// 'lightning animation (using only JQuery/CSS)' => array(
					// 'url' => '/shenanigans/lightning',
					// 'target' => '',
					// 'allowed_users' => array(DEV => 1, MEMBER => 1, GUEST => 1)
				// ),
				'nested dropdown menu<br />(using only HTML/CSS)' => array(
					'url' => '/shenanigans/nested_cssmenu',
					'target' => '',
					'allowed_users' => array(DEV => 1, MEMBER => 1, GUEST => 1)
				)
			)
		),
		// 'Coding Virtues' => array(
			// 'url' => '/coding_virtues',
			// 'target' => '',
			// 'allowed_users' => array(DEV => 1, MEMBER => 1, GUEST => 1)
		// )
	);



	public function __construct() {
		parent::__construct();
		$this->load->library('session');
		$this->load->helper('url');
	}



	protected function filepathToHTML($file, $start_html, $end_html) {
		return $start_html . $file . '?v=' . filemtime(FCPATH . trim($file, '/\\')) . $end_html;
	}

	protected function filepathsToHTML($files, $start_html, $end_html) {
		$html = '';
		foreach($files as $file) {
			$html .= $this->filepathToHTML($file, $start_html, $end_html);
		}
		return $html;
	}



	protected function render($url, $data = null) {
		$params = $this->input->get();
		if($this->input->get() == null) {
			$params = "";
		}
		else {
			$params = http_build_query($this->input->get());
		}

		if($this->input->is_ajax_request()) {
			$this->load->view($url);
		}
		else {
			$css_files = array();
			$js_files = array();
			if(file_exists('assets/css/veeb.min.css')) {
				$css_files[] = '/assets/css/veeb.min.css';
			}
			else {
				$css_files[] = '/assets/css/veeb.css';
				// $css_files[] = '/assets/js/addons/google-code-prettify/prettify.css';
				$css_files[] = '/assets/js/addons/google-code-prettify/sunburst.css';
			}

			if(file_exists('assets/css/veeb.min.js')) {
				$js_files[] = '/assets/js/veeb.min.js';
			}
			else {
				$js_files[] = '/assets/js/addons/jquery-1.10.2.min.js';
				$js_files[] = '/assets/js/addons/json2.min.js';
				$js_files[] = '/assets/js/addons/jquery.dataTables.min.js';
				$js_files[] = '/assets/js/addons/google-code-prettify/prettify.js';
			}

			// $version = filemtime('.git/index');
			// $version = time();
			$this->load->view(
				'page_header',
				array(
					'header_includes' =>
						$this->filepathToHTML('favicon.gif', '<link rel="icon" href="', '" type="image/gif">') .
						$this->filepathsToHTML($css_files, '<link href="', '" rel="stylesheet" type="text/css">') .
						$this->filepathsToHTML($js_files, '<script type="text/javascript" src="', '"></script>'),
					'menu' => '<div class="menu">' . $this->buildMenu(MY_Controller::$menu_items) . '</div>',
					'params' => $params
				)
			);
			$this->load->view($url, $data);
			$this->load->view('page_footer');
		}
	}

	private function buildMenu($items = array()) {
		$user_type = $this->session->userdata('type');
		if($user_type == null) {
			$user_type = 0;
		}

		$menu = '';
		foreach($items as $title => $item) {
			if(isset($item['allowed_users'][$user_type])) {
				$menu .= '<div class="menu-item"><a href="' . $item['url'] . '" target="' . $item['target'] . '">' . $title . '</a>';
				if(isset($item['subcats'])) {
					$menu .= '<div class="menu-item-list">' . $this->buildMenu($item['subcats']) . '</div>';
				}
				$menu .= '</div>';
			}
		}

		return $menu;
	}



	protected function echoWithContentLengthHeader($output_string) {
		header('Content-Length: ' . strlen($output_string));
		echo $output_string;
	}

	protected function echoAndCompress($output_string, $compression_handler = 'ob_gzhandler', $content_length_header = null) {
		if($content_length_header != null) {
			header($content_length_header . strlen($output_string));
		}
		// header('Content-Type: application/json');
		// header('Accept-Encoding: gzip');
		// header('Transfer-Encoding: chunked');
		// header('Vary: Accept-Encoding');
		// header('X-Powered-By: PHP/5.4.7');

		$is_gzip = substr_count($_SERVER['HTTP_ACCEPT_ENCODING'], 'gzip') > 0;
		if($is_gzip) {
			// ob_start($compression_handler);
			header('Content-Encoding: gzip');
			echo gzencode($output_string);
		}
		else {
			// ob_start();
			echo $output_string;
		}

		// header('Content-Length: ' . ob_get_length());
		// ob_end_clean();
		// ob_end_flush();
	}

	protected function getParams() {
		$params = array();
		$get = $this->input->get();
		$post = $this->input->post();

		if(is_array($get)) {
			foreach($get as $name => $param) {
				$params[$name] = $param;
			}
		}
		if(is_array($post)) {
			$this->load->database();
			foreach($post as $name => &$param) {
				if(is_array($param)) {
					foreach($param as &$entry) {
						$entry = mysql_real_escape_string($entry);
					}
				}
				else {
					$param = mysql_real_escape_string($param);
				}
				$params[mysql_real_escape_string($name)] = $param;
			}
		}
		return $params;
	}

	protected function readCSV($filename, $delimiter = "\t") {
		$file_handle = fopen($filename, 'r');
		$line = null;
		while (!feof($file_handle) ) {
			// $line = fgets($file_handle, 2048);
			$line = fgets($file_handle);
			if($delimiter != '') {
				$file_content[] = str_getcsv($line, $delimiter);
			}
			else {
				$file_content[] = $line;
			}
		}
		fclose($file_handle);
		return $file_content;
	}

	protected function writeCSV($content, $filename, $delimiter = "\t", $prepend = "") {
		$file_handle = fopen($filename, 'w');
		if(is_array($content) && sizeof($content) > 0) {
			fwrite($file_handle, $prepend);
			fwrite($file_handle, implode($delimiter, array_keys(reset($content))) . "\n");
			foreach($content as $row) {
				fwrite($file_handle, implode($delimiter, array_values($row)) . "\n");
			}
		}
		fclose($file_handle);
	}

	protected function writeCSVDownloadPrompt($content, $filename, $delimiter = "\t", $prepend = "") {
		header("Content-type: text/plain");
		header("Content-Disposition: attachment; filename=" . $filename);
		echo $prepend;
		if(is_array($content) && sizeof($content) > 0) {
			echo implode($delimiter, array_keys(reset($content))) . "\n";
			foreach($content as $row) {
				echo implode($delimiter, array_values($row)) . "\n";
			}
		}
	}

	protected function writeDownloadPrompt($content, $filename, $prepend = "") {
		header("Content-type: text/plain");
		header("Content-Disposition: attachment; filename=" . $filename);
		echo $prepend;
		echo $content;
	}

	protected function write($content, $filename, $prepend = "") {
		$file_handle = fopen($filename, 'w');
		fwrite($file_handle, $prepend);
		fwrite($file_handle, $content);
		fclose($file_handle);
	}
}

/* End of file MY_Controller.php */
/* Location: ./application/core/MY_Controller.php */