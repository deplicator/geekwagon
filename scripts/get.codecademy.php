<?php
header('Content-type: application/json');
include('../config.php');

echo file_get_contents('http://www.codecademy.com/users/deplicator/achievements');