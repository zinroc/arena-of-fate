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

	function setSkills(){
		$query = $this->db->get('characters');
		$characters = $query->result_array();

		$query = $this->db->get('skills');
		$skills = $query->result_array();

		foreach($characters as $character){
			foreach($skills as $skill){
				$query = $this->db->get_where("character_skills", array("character"=>$character['id'], "skill"=>$skill['id']));
				if($query->num_rows()===0){
					$sql = "INSERT INTO character_skills (id, character, skill, value) VALUES (DEFAULT, ?, ?, ?)";
					$arr = array("character"=>$character['id'], "skill"=>$skill['id'], "value"=>RAND(1,100));
					$this->db->query($sql, $arr);
				}
			}

		}
		return;
	}
}
?>