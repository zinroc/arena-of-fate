<?php
class Character_Model extends CI_MODEL {

	function getFighters(){
		$result = array();

		$query = $this->db->get('characters');
		if ($query->num_rows()===0){
			return false;
		} else {
			$characters = $query->result_array();
			$result['fighters'] = $characters;
			foreach($characters as $character){
				$query = $this->db->get_where("character_skills", array("character"=>$character['id']));
				$skills = $query->result_array();
				foreach($skills as $skill){
					$result['fighterSkills'][$character['id']][$skill['skill']] = $skill['value'];
				}
			}

			return $result;
		}
	}
}
?>