<?php
/* Vic Bobkov
* 2014-02-09
* MY_Model.php
*/

class MY_Model extends CI_Model {
	public function __construct() {
		parent::__construct();
		$this->load->database();
	}

	protected function getInsertSQL($columns) {
		if(!is_array($columns) || sizeof($columns) < 1) {
			return null;
		}
		unset($columns['id']);

		$insert_sql = array('insert_names' => "", 'insert_param_markers' => "", 'values' => array());
		foreach($columns as $name => $value) {
			$insert_sql['insert_names'] .= $name . ",";
			$insert_sql['insert_param_markers'] .= "?,";
			// $insert_sql['values'][] = $value;
			// $insert_sql['values'][] = htmlentities($value, ENT_QUOTES);
			$insert_sql['values'][] = htmlentities($value, ENT_NOQUOTES);
		}
		if(substr($insert_sql['insert_names'], -1) == ',') {
			$insert_sql['insert_names'] = substr($insert_sql['insert_names'], 0, -1);
		}
		if(substr($insert_sql['insert_param_markers'], -1) == ',') {
			$insert_sql['insert_param_markers'] = substr($insert_sql['insert_param_markers'], 0, -1);
		}
		return $insert_sql;
	}

	protected function getUpdateSQL($id, $columns) {
		if(!is_array($columns) || sizeof($columns) < 1) {
			return null;
		}

		$update_sql = array('set' => "", 'values' => array());
		$current_val;
		foreach($columns as $name => $value) {
			$update_sql['set'] .= $name . "=?,";
			// $update_sql['values'][] = htmlentities($value, ENT_QUOTES);
			$current_val = htmlentities($value, ENT_NOQUOTES);
			$update_sql['values'][] = empty($current_val) ? NULL : $current_val;
		}
		if(substr($update_sql['set'], -1) == ',') {
			$update_sql['set'] = substr($update_sql['set'], 0, -1);
		}

		if($id != null) {
			$update_sql['values'][] = $id;
		}
		return $update_sql;
	}
}

/* End of file MY_Model.php */
/* Location: ./application/core/MY_Model.php */