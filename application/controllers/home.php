<?php
/* Vic Bobkov
* 2014-02-09
* home.php
*/

class Home extends MY_Controller {
	public function __construct() {
		parent::__construct();
	}

	public function getVersion() {
		echo filemtime('.git/index');
	}

	public function index() {
		$this->render('home');
	}
}

/* End of file home.php */
/* Location: ./application/controllers/home.php */