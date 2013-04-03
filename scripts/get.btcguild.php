<?php
header('Content-type: application/json');
include('../config.php');

$btcguildjson = file_get_contents('http://www.btcguild.com/api.php?api_key=' . $BTCGUILD_APIKEY);
echo $btcguildjson;