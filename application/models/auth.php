<?php
// crypto functions for PHP version < 5.5
require("password_compat/lib/password.php");

/**
  * The class for authentication
  */
class Auth extends CI_MODEL {

	// define this similarly to how the function in password_compat also defines it
	const SALT_LENGTH = 22;

	function __construct () {
		parent::__construct ();
	}

	/**
	  * Create a new user with the given email and password
	  * At this point, we know that the email address does not appear in the users table.
	  * Return the ID of the user row
	  */
	function createUser ($email, $username, $teamname, $password) {
		$salt = $this::_makeSalt ();
		$hash = $this::_hashPassword($password, $salt);

		// create entry in users table
		// make sure that the password inserted is the hashed version, and not the plaintext
		$arr = array("email" => $email, "username" => $username, "password" => $hash, "salt" => $salt, "teamname"=>$teamname);
		$query = $this->db->insert('users', $arr);

		if ( $query ) {
            $user_id = $this->db->insert_id();
            if ($user_id === false) {
                return false;
            } else {
                return intval($user_id);
            }
		} else {
			throw new Exception("Failed to create user");
		}
	}

	/**
	 * Register an email for alpha test.
	 * @return  True on sucess, false on fail
	 */
	function registerAlphaEmail($email) {
		$this->db->trans_start();
		$query = $this->db->get_where("alpha_applicants", array("email" => $email));
		if ($query->num_rows() > 0) {
			return false;
		}

		$this->db->insert("alpha_applicants", array("email" => $email));
		$this->db->trans_complete();
		return $this->db->trans_status();
	}

	/**
	  * Authenticate the user
	  * Return an associative array of credentials if logged in
	  * Return false if falied
	  */
	function authUser ($email, $password) {
		$query = $this->db->get_where('users', array('email' => $email));
		if ($query->num_rows() > 0) {
			$row = $query->row_array();

			if($this->_checkPassword($password, $row['salt'], $row['password'])) {
				foreach ($row as $key => $val) {
					if ($val === 't') {
						$row[$key] = true;
					} else if ($val === 'f') {
						$row[$key] = false;
					}
				}
				return $row;
			} else {
				return false;
			}
		} else {
			return false;
		}
	}

	/**
	  * Return true iff the plaintext matches the hash when salted
	  */
	function _checkPassword($plaintext, $salt, $hash) {
		// apparently the salt is coded into the hash

		return password_verify($plaintext, $hash);
	}

	/**
	  * Given a plaintext password and its salt, return the hashed password
	  */
	function _hashPassword($plaintext, $salt) {
		return password_hash ($plaintext, PASSWORD_DEFAULT, array("salt" => $salt));
	}

	/**
	  * Create a salt in a cryptographically secure manner.
	  * Return the salt.
	  */
	function _makeSalt () {
		$buffer = openssl_random_pseudo_bytes(self::SALT_LENGTH);
		return str_replace ("+", ".", base64_encode ($buffer));
	}
}
?>
