<?php 
/**
  * Return the URL to the assets
  * No trailing slash
  */
function asset_url () {
	// remove protocol for assets, to automatically switch to HTTPS if needed
	return str_replace("http:", "", base_url() . "assets");
}
?>