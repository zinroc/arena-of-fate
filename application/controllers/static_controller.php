<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Static_Controller extends CI_Controller {
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


    public function getStrategies (){
    	$this->load->model('static_model');
    	$result = $this->static_model->getStrategies();
    	if ($result){
    		$this->printJSON(array("strats"=>$result['strat'], "stratBonuses"=>$result['stratBonuses']));
    	} else{
    		$this->printJSONDatabaseError();
    	}
    }

    public function getSkills (){
    	$this->load->model('static_model');
    	$result = $this->static_model->getSkills();
    	if ($result){
    		$this->printJSON(array("skills"=>$result['skills'], "skillIDs"=>$result['skillIDs']));
    	} else{
    		$this->printJSONDatabaseError();
    	}
    }

    public function getTraits (){
        $this->load->model('static_model');
        $result = $this->static_model->getTraits();
        if ($result){
            $this->printJSON(array("traits"=>$result));
        } else{
            $this->printJSONDatabaseError();
        }
    }

    
    //public function initTechExp (){
    //    $this->load->model('static_model');
    //    $result = $this->static_model->initTechExp();
    //    if ($result){
    //        $this->printJSONSuccess('h1');
    //   } else{
    //        $this->printJSONDatabaseError();
    //    }
    //} 
    
    
    public function getTechniques (){
        $this->load->model('static_model');
        $result = $this->static_model->getTechniques();
        if ($result){
            $this->printJSON(array("techniques"=>$result));
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