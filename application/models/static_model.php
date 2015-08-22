<?php
class Static_Model extends CI_MODEL {

	function getStrategies (){
		$result = array();

		$query = $this->db->get('strategies');
		$strategies = $query->result_array();

		foreach ($strategies as $strategy){
			$strategy['initiation_frequency'] = $this->numberToTextConverter('height', $strategy['initiation_frequency']);
			$strategy['base_cardio_cost'] = $this->numberToTextConverter('height', $strategy['base_cardio_cost']);
			$strategy['initiation_cardio_cost'] = $this->numberToTextConverter('height', $strategy['initiation_cardio_cost']);
			$strategy['difficulty'] = $this->numberToTextConverter('height', $strategy['difficulty']);
			$strategy['range'] = $this->numberToTextConverter('distance', $strategy['range']);
			$result['strat'][$strategy['id']] = $strategy;
		}

		$query = $this->db->get('strategy_bonuses');
		$bonuses = $query->result_array();

		foreach($bonuses as $bonus){
			$result['stratBonuses'][$bonus['strategy']][$bonus['skill']] = $bonus['value'];
		}
		return $result;
	}

	function getSkills (){
		$result = array();

		$query = $this->db->get('skills');
		$result['skills'] = $query->result_array();
		foreach ($result['skills'] as $skill){
			$result['skillIDs'][$skill['name']] = $skill['id'];
		}

		return $result;
	}

	function getTechniques (){
		$result = array();
		$query = $this->db->get('techniques');
		$result = $query->result_array();

		return $result;
	}

	function getTraits (){
		$result = array();
		$query = $this->db->get('traits');
		$traits = $query->result_array();
		foreach($traits as $trait){
			$result[$trait['id']]['name'] = $trait['name'];
			$result[$trait['id']]['description'] = $trait['description'];
		}
		return $result;
	}

	function initTechExp (){
		$query = $this->db->get('characters');
		$characters = $query->result_array();

		$query = $this->db->get('techniques');
		$techniques = $query->result_array();

		foreach($characters as $character){
			foreach($techniques as $technique){
				$random = rand(0, 100);
				$sql = "INSERT INTO technique_conditioning (id, character, technique, conditioning) VALUES (DEFAULT, ?, ?, ?)";
				$arr = array("character"=>$character['id'], "technique"=>$technique['id'], "conditioning"=>$random);
				$this->db->query($sql, $arr);
			}
		}
		return true;
	}

	/**
	*	@param $conversion VARCHAR code for type of conversion to be done
	*	@param $number INT
	*	@return VARCHAR
	*/
	function numberToTextConverter ($conversion, $number){
		$number = intval($number);
		if ($conversion==='height'){
			if ($number === 0){
				return 'low';
			} elseif ($number === 1){
				return 'medium';
			} elseif ($number === 2){
				return 'high';
			}
		} elseif ($conversion==='distance'){
			if ($number === 0){
				return 'close';
			} elseif ($number===1){
				return 'medium';
			} elseif ($number===2){
				return 'far';
			}
		}
	}
}
?>