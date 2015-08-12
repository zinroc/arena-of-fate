<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

/**
 * Main controller
 * Deals with authentication and central user functionality
 */
class GamePlayer extends CI_Controller {

    const PASSWORD_MIN_LENGTH = 5;
    const CHARNAME_MAX_LENGTH = 20;

    function __construct () {
        // call the parent constructor
        parent::__construct ();
        session_start ();
    }

    /**
     * Remap URLs so that only whitelisted methods can be accessed without authentication
     */
    public function _remap ($method, $params = array ()) {
        //enforce access controls to protected functions

        // these functions can be called by users that are not logged in
        $free_view = array(
            // unauthenticated views
            "index",
            "home",
            "register",
            "login",
            // unauthenticated API calls
            "authenticateUser",
            "registerUser",
        );

        if (in_array($method, $free_view)) {
            return call_user_func_array(array($this, $method), $params);
        } else if (! isset($_SESSION['email']) && ! in_array($method, $free_view)) {
            redirect('gameplayer/login');
        } else if (isset($_SESSION['email']) && "register" === $method) {
            // do not allow logged-in users to register an account
            redirect('gameplayer/viewAccount');
        } else {
            return call_user_func_array(array($this, $method), $params);
        }

    }

    /**
     * Index Page for this controller
     * For now, this is the login page
     */
    public function index() {
        redirect('gameplayer/login', 'refresh');
    }

    public function home() {
        redirect('gameplayer/index', 'refresh');
    }

    /**
     * Show the deck building page
     */
    public function deck () {
        $data = array(
            "page_title" => "Build Deck",
            "extra_css" => array(asset_url() . "/css/build_deck.css"),
            "extra_js" => array(asset_url() . "/js/controllers/build_deck.js"),
            "view" => "build_deck"
            // "ng-view" => true
        );
        $this->load->view ('master', array("data" => $data));
    }

    /**
     * Go to the registration page.
     */
    public function register() {
        $data = array(
             "page_title" => "Register",
             "extra_css" => array(asset_url() . "/css/auth-style.css"),
             "extra_js" => array(asset_url() . "/js/controllers/auth.js"),
             "view" => "register"
         );
         $this->load->view ('master', array("data" => $data));
        //redirect("gameplayer/register_alpha", "refresh");
    }



    /**
     * Go to the login page.
     */
    public function login() {
        if (isset($_SESSION['email'])) {
            redirect('gameplayer/fight_planner', 'refresh');
        } else {
            $data = array(
                "page_title" => "Login",
                "extra_css" => array(asset_url() . "/css/auth-style.css"),
                "extra_js" => array(asset_url() . "/js/controllers/auth.js"),
                "view" => "login"
            );
            $this->load->view ('master', array("data" => $data));
        }
    }

    /**
     * Deprecated alias for viewAccount
     */
    public function select_character() {
        redirect('gameplayer/viewAccount', 'refresh');
    }

    /**
     * Show fight view
     */
    public function fight_planner () {
        $data = array(
            "page_title" => "Fight Planner",
            "extra_css" => array(asset_url() . "/css/fight_planner.css"),
            "extra_js" => array(asset_url() . "/js/controllers/fight_planner.js"),
            "view" => "fight_planner"
        );
        $this->load->view ('master', array("data" => $data));
    }


    /**
    * Show fighter manager view
    */
    public function fighter_manager (){
        $data = array(
            "page_title" => "Fighter Manager",
            "extra_css" => array(asset_url() . "/css/fighter_manager.css"),
            "extra_js" => array(asset_url() . "/js/controllers/fighter_manager.js"),
            "view" => "fighter_manager"
        );
        $this->load->view ('master', array("data"=>$data));
    }

    /**
     * Show the character seelction page.
     */
    public function viewAccount () {
        // undo character selection when enterring this view
        if (isset($_SESSION['char_id'])) {
            unset($_SESSION['char_id']);
            unset($_SESSION['char_name']);
        }
        $data = array(
            "page_title" => "Account Overview",
            "extra_css" => array(asset_url() . "/css/charsel.css"),
            "extra_js" => array(asset_url() . "/js/controllers/charsel.js"),
            "view" => "charsel",
            // "ng-view" => true
        );
        $this->load->view ('master', array("data" => $data));
    }


    public function welcome () {

        $data = array(
            "page_title" => "Welcome",
            "extra_css" => array(asset_url() . "/css/welcome.css"),
            "extra_js" => array(asset_url() . "/js/controllers/welcome.js"),
            "view" => "welcome",
        );
        $this->load->view ('master', array("data" => $data));
    }

    /**
     * Logout, and go to the login page
     */
    public function logout() {
        // remove session variables
        $_SESSION = array();

        // delete session cookie
        if (ini_get("session.use_cookies")) {
            $params = session_get_cookie_params();
            setcookie(session_name(), '', time() - 42000,
                $params["path"], $params["domain"],
                $params["secure"], $params["httponly"]
            );
        }

        // destroy session
        session_destroy();

        redirect('gameplayer/login', 'refresh');
    }

    /**
     * Register an email address for the alpha version
     *
     * Authentication:
     * 		none
     *
     * Expected POST parameters:
     * 		email 		The email of the user
     *
     * On success:
     * 		{'status': 'success', 'msg': <helpful msg>}
     * On failure:
     * * 	{'status': 'error', 'msg': <helpful msg>}
     */
    public function registerAlphaEmail() {
        $this->load->library('form_validation');
        $this->form_validation->set_error_delimiters('', '');
        $this->form_validation->set_rules("email", "email", "required|valid_email|is_unique[alpha_applicants.email]");

        if ($this->form_validation->run()) {
            $this->load->model("auth");
            $result = $this->auth->registerAlphaEmail($this->input->post("email"));

            if ($result) {
                $this->printJSONSuccess("successfully registered for alpha");
            } else {
                $this->printJSONDatabaseError();
            }
        } else {
            $errors = array(
                'email' => form_error('email'),
                'status' => "error",
                "msg" => "Failed to validate the form server-side"
            );

            if ($errors['email'] == "The email field must contain a unique value.") {
                $errors['email'] = "There is already an account associated with this email address.";
            }

            $this->printJSON($errors);
        }
    }

    /**
     * Create a new account for this user
     */
    public function registerUser () {
        $this->load->library('form_validation');
        $this->form_validation->set_error_delimiters('', '');

        // validation rules
        $this->form_validation->set_rules("email", "email", "required|valid_email|is_unique[users.email]");
        // username must be alpha_dash (letters, numbers, dash, underscore)
        $this->form_validation->set_rules("username", "username", "required|is_unique[users.username]|alpha_dash|callback_valid_username");
        $this->form_validation->set_rules("teamname", "teamname", "required|is_unique[users.teamname]|alpha_dash|callback_valid_teamname");

        $this->form_validation->set_rules("password", "password", "required|min_length[" . self::PASSWORD_MIN_LENGTH . "]");

        $status = null;
        $msg = null;

        if ($this->form_validation->run()) {
            $this->load->model('auth');
            $result = $this->auth->createUser($this->input->post('email'), $this->input->post('username'), $this->input->post('teamname'), $this->input->post('password'));

            if ($result === false) {
                return $this->printJSONDatabaseError();
            } else {
                return $this->printJSONSuccess("Account created");
            }
        } else {
            $errors = array(
                'email' => form_error('email'),
                'username' => form_error('username'),
                'teamname' => form_error('teamname'),
                'password' => form_error('password'),
                'status' => "error",
                "msg" => "Failed to validate the form server-side"
            );

            if ($errors['email'] == "The email field must contain a unique value.") {
                $errors['email'] = "There is already an account associated with this email address.";
            }

            $this->printJSON($errors);
        }
    }

    /**
     * Authenticate the user to the site. This is a JSON API call
     *
     * Required parameters for POST:
     * 	email 		An email for an account
     * 	password 	The password for the account
     *
     * Response on success:
     * 	{'status' : 'success', 'msg' : <helpful error msg>}
     * Response on failure/error:
     * 	{'status' : 'error', 'msg' : <helpful error msg>}
     */
    public function authenticateUser () {
        $this->load->library('form_validation');
        $this->form_validation->set_error_delimiters('', '');

        // validation rules
        $this->form_validation->set_rules("email", "email", "required|valid_email");
        $this->form_validation->set_rules("password", "password", "required|min_length[" . self::PASSWORD_MIN_LENGTH . "]");

        if($this->form_validation->run()) {
            $this->load->model('auth');
            $result = $this->auth->authUser($this->input->post('email'), $this->input->post('password'));

            if ($result) {
                // now we know that you are logged in
                $_SESSION['email'] = $result['email'];
                $_SESSION['username'] = $result['username'];
                $_SESSION['teamname'] = $result['teamname'];
                $_SESSION['id'] = $result['id'];

                $status = "success";
                $msg = "You are now logged in as " . $result['username'];
                $this->printJSON(array("status" => $status, "msg" => $msg));
            } else {
                $this->printJSON(array("status" => "error", "msg" => "The email or password is not correct"));
            }
        } else {
            $errors = array(
                'email' => form_error('email'),
                'password' => form_error('password'),
                'status' => "error",
                "msg" => "Failed to validate the form server-side"
            );

            $this->printJSON($errors);
        }
    }



    /**
     * This is a callback validation function
     * Make sure that the username:
     * 		1. Starts with a letter
     */
    public function valid_username($str) {
        if (! ctype_alpha($str[0])) {
            $this->form_validation->set_message("valid_username", "%s does not start with a letter");
            return false;
        } else if ($this->is_reserved_keyword(strtolower($str))) {
            $this->form_validation->set_message("valid_username", "'" . $str . "' is a reserved keyword");
            return false;
        } else {
            return true;
        }
    }

    /**
     * Currently reserved keywords are:
     * 		2. race names
     * @return True iff string is a reserved keyword
     */
    private function is_reserved_keyword($str) {

        return false;
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
