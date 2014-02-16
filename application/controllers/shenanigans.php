<?php
/* Vic Bobkov
* 2014-02-09
* shenanigans.php
*/

class Shenanigans extends MY_Controller {
	public function __construct() {
		parent::__construct();
	}

	public function index() {
		$this->render('shenanigans');
	}

	public function nested_cssmenu() {
		$this->render('nested_cssmenu');
	}

	public function nested_cssmenu_mobile() {
		$this->render('nested_cssmenu_mobile');
	}
}

/* End of file shenanigans.php */
/* Location: ./application/controllers/shenanigans.php */