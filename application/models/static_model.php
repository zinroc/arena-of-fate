<?php
class Static_Model extends CI_MODEL {

	function getStrategies (){
		$result = array();

		$query = $this->db->get('strategies');
		$strategies = $query->result_array();

		foreach ($strategies as $strategy){
			$strategy['initiation_frequency'] = $this->numberToTextConverter('height', $strategy['initiation_frequency']);
			$strategy['base_cardio'] = $this->numberToTextConverter('height', $strategy['base_cardio']);
			$strategy['initiation_cardio'] = $this->numberToTextConverter('height', $strategy['initiation_cardio']);
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

	function getTraits (){
		$result = array();
		$query = $this->db->get('traits');
		$traits = $query->result_array();
		foreach($traits as $trait){
			$result[$trait['id']] = $trait['name'];
		}
		return $result;
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