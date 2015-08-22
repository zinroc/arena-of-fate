<?php
class Character_Model extends CI_MODEL {

	function getPlans($id){
		$result = array();
		$sql= "SELECT * FROM strategy_experience WHERE character=? AND rank IS NOT NULL";
		$arr = array("character"=>$id);
		$query = $this->db->query($sql, $arr);
		$result = $query->result_array();

		$i =0;
		foreach($result as $plan){
			$sql = "SELECT * FROM strategies WHERE id=?";
			$arr = array("id"=>$plan['strategy']);
			$query = $this->db->query($sql, $arr);
			$strat = $query->row_array();
			$result[$i]['name'] = $strat['name'];
			$i++;
		}

		return $result;
	}

	function getSlots($id){
		$result = array();
		$sql= "SELECT * FROM strategy_experience WHERE character=? AND rank IS NOT NULL";
		$arr = array("character"=>$id);
		$query = $this->db->query($sql, $arr);
		$plans = $query->result_array();


		foreach ($plans as $plan){
			$query = $this->db->get_where("plan_techniques", array("plan"=>$plan['id']));
			$slotInfo = $query->row_array();

			$result[$plan['strategy']]['slot_1'] = $slotInfo['slot_1'];
			$result[$plan['strategy']]['slot_2'] = $slotInfo['slot_2'];
			$result[$plan['strategy']]['slot_3'] = $slotInfo['slot_3'];
			$result[$plan['strategy']]['ultimate'] = $slotInfo['ultimate'];

		}

		return $result;
	}

	function getTechCond ($id){
		$result = array();
		$sql = "SELECT * FROM technique_conditioning WHERE character=?";
		$arr = array("character"=>$id);
		$query = $this->db->query($sql, $arr);
		$conds = $query->result_array();

		foreach ($conds as $cond){
			$result[$cond['technique']] = $cond['conditioning'];
		}
		return $result;

	}

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