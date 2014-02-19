<?php
/* Vic Bobkov
* 2014-02-18
* about.php
*/

class About extends MY_Controller {
	public function __construct() {
		parent::__construct();
	}

	public function index() {
		$this->render('about');
	}
}

/* End of file about.php */
/* Location: ./application/controllers/about.php */