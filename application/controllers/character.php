<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Character extends CI_Controller {
	function __construct () {
        // call the parent constructor
        parent::__construct ();
        session_start ();
    }

    /** 
     * Enforce access controls to protected functions.
     * Make sure that API functions are still accessible without redirect.
     */
    public function _remap ($method, $params = array ()) {
        $whitelist = array();

        // whitelist system for safety
        if (in_array($method, $whitelist)) {
            return call_user_func_array(array($this, $method), $params);
        } else {
            // means the user is logged in
            if (! isset($_SESSION['email'])) {
                //Then we redirect to the index page again
                redirect('gameplayer/index', 'refresh');
            } else {
                return call_user_func_array(array($this, $method), $params);
            }
        }
    }

    public function getPlans (){
        $id = $this->input->post('id');

        $this->load->model('character_model');
        $result = $this->character_model->getPlans($id);
        if($result){
            $this->printJSON(array("plans"=>$result));
        } else{
            $this->printJSONDatabaseError();
        }
    }

    public function getSlots (){
        $id = $this->input->post('id');

        $this->load->model('character_model');
        $result = $this->character_model->getSlots($id);
        if($result){
            $this->printJSON(array("slots"=>$result));
        } else{
            $this->printJSONDatabaseError();
        }
    }

    public function getTechCond (){
        $id = $this->input->post('id');

        $this->load->model('character_model');
        $result = $this->character_model->getTechCond($id);
        if($result){
            $this->printJSON(array("techConditioning"=>$result));
        } else{
            $this->printJSONDatabaseError();
        }
    }

    public function setSkills (){
        $this->load->model('character_model');
        $result = $this->character_model->setSkills();
        $this->printJSONSuccess('hi');
    }

    public function getFighters (){
    	$this->load->model('character_model');
    	$result = $this->character_model->getFighters();
    	if ($result){
    		$this->printJSON(array("fighters"=>$result['fighters'], "fighterSkills"=>$result['fighterSkills'], 
                "fightersExperience"=>$result['fightersExperience']));
    	} else{
    		$this->printJSONDatabaseError();
    	}
    }

    /**
     * Print the given array in JSON with the correct content type.
     */
    private function printJSON ($arr) {
        $this->output->set_content_type("application/json");
        $this->output->set_output(json_encode($arr));
    }

    /**
     * Helper function to avoid code duplication
     */
    private function printJSONDatabaseError() {
        $this->printJSONError("DB error: " . pg_last_error());
    }

    /**
     * Helper function to avoid code duplication
     */
    private function printJSONError($msg) {
        $this->printJSON(array('status' => 'error', 'msg' => $msg));
    }

    /**
     * Helper function to avoid code duplication
     */
    private function printJSONSuccess($msg) {
        $this->printJSON(array('status' => 'success', 'msg' => $msg));
    }

}

?>