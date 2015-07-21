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
				$query = $this->db->get_where("strategy_experience", array("character"=>$character['id']));
				$experiences = $query->result_array();

				foreach($experiences as $experience){
					$result['fightersExperience'][$character['id']][$experience['strategy']]['as'] = $experience['experience_as'];
					$result['fightersExperience'][$character['id']][$experience['strategy']]['against'] = $experience['experience_against'];
				}
			}

			return $result;
		}
	}
}
?>