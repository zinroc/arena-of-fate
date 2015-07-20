<!DOCTYPE html>
<html lang="en">
	<head>
		<!-- mobile support and scaling -->
		<meta charset="utf-8" />
		<meta name="viewport" content="width=device-width, initial-scale=1.0" />
		<meta name="author" content="boompig" />

		<!-- *** CSS Styling *** -->
		<!-- Bootstrap for prettiness -->
		<link rel="stylesheet" href="<?=asset_url() ?>/css/bootstrap.min.css" />
		<link rel="stylesheet" href="<?=asset_url() ?>/css/bootstrap-theme.min.css" />
  		<!-- for navbar -->
  		<link rel="stylesheet" href="<?=asset_url() ?>/css/navbar.css" />

  		<title>Game &middot; Template</title>
	</head>
	<body>
		<!-- load navbar as partial view -->
		<?php $this->load->view('navbar'); ?>

		<div class="container">
			<div class="inner-container">

			</div> <!-- end inner-container -->
		</div> <!-- end container -->

		<!-- *** JAVASCRIPT @ bottom *** -->
		<!-- JQuery -->
		<script type="application/javascript" src="<?=asset_url() ?>/js/jquery.min.js"></script>
		<!-- JQuery validate plugin -->
		<script type="application/javascript" src="<?=asset_url() ?>/js/jquery.validate.min.js"></script>
		<!-- bootstrap -->
		<script type="application/javascript" src="<?=asset_url() ?>/js/bootstrap.min.js"></script>
		<!-- helpful utils -->
		<script type="application/javascript" src="<?=asset_url() ?>/js/utils.js"></script>

		<!-- angular -->
		<script type="text/javascript" src="<?=asset_url() ?>/js/angular.min.js"></script>
		<script type="text/javascript" src="<?=asset_url() ?>/js/services.js"></script>
		<script type="text/javascript" src="<?=asset_url() ?>/js/controllers.js"></script>
	</body>
</html>