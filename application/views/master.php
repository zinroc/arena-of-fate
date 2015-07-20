<!DOCTYPE html>
<html lang="en">
    <head>
        <!-- mobile support and scaling -->
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="author" content="boompig" />

        <!-- *** CSS Styling *** -->
        <!-- Bootstrap for prettiness -->
        <link rel="stylesheet" href="<?=asset_url() ?>/bower_components/bootstrap/dist/css/bootstrap.css" />
        <link rel="stylesheet" href="<?=asset_url() ?>/bower_components/bootstrap/dist/css/bootstrap-theme.css" />
          <!-- for navbar -->
          <link rel="stylesheet" href="<?=asset_url() ?>/css/navbar.css" />

          <?php
              if (isset($data["extra_css"])) {
                  foreach($data["extra_css"] as $href) {
                      echo "<link rel='stylesheet' href='" . $href . "' />";
                  }
              }
          ?>

          <title>Project Titan &middot; <?= $data["page_title"]; ?></title>
    </head>
    <body ng-app="App">
        <!-- load navbar as partial view -->
        <?php $this->load->view('navbar'); ?>

        <div class="container" ng-controller="masterController">
            <div class="inner-container">
                <ng-include src="getStaticView('<?=$data['view'] . ".html"; ?>')"></ng-include>
            </div> <!-- end inner-container -->
        </div> <!-- end container -->

        <div id="keyboard-shortcuts-modal">
            <!-- TODO -->
        </div>

        <!-- *** JAVASCRIPT @ bottom *** -->
        <!-- JQuery -->
        <script type="application/javascript" src="<?=asset_url() ?>/bower_components/jquery/jquery.js"></script>
        <!-- JQuery validate plugin -->
        <script type="application/javascript" src="<?=asset_url() ?>/js/jquery.validate.min.js"></script>
        <!-- bootstrap -->
        <script type="application/javascript" src="<?=asset_url() ?>/bower_components/bootstrap/dist/js/bootstrap.js"></script>
        <!-- helpful utils -->
        <script type="application/javascript" src="<?=asset_url() ?>/bower_components/underscore/underscore.js"></script>
        <script type="application/javascript" src="<?=asset_url() ?>/js/utils.js"></script>

        <!-- angular -->
        <script type="text/javascript" src="<?=asset_url() ?>/bower_components/angular/angular.js"></script>
        <script type="text/javascript" src="<?=asset_url() ?>/js/app.js"></script>
        <script type="text/javascript" src="<?=asset_url() ?>/js/services.js"></script>
        <script type="text/javascript" src="<?=asset_url() ?>/js/controllers.js"></script>
        <script type="text/javascript" src="<?=asset_url() ?>/js/controllers/master.js"></script>

        <?php
            if (isset($data["extra_js"])) {
                foreach($data["extra_js"] as $src) {
                    echo "<script type='text/javascript' src='" . $src . "'></script>";
                }
            }
        ?>
    </body>
</html>
