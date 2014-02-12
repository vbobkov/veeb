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
		$get_string = $this->input->get();
		if($this->input->get() == null) {
			$get_string = "";
		}
		else {
			$get_string = http_build_query($this->input->get());
		}
		$this->render('home', array('params' => $get_string));
	}
}

/* End of file home.php */
/* Location: ./application/controllers/home.php */