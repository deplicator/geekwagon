<?php
header('Content-type: application/json');
/*
$page1 = file_get_contents('https://api.github.com/users/deplicator/events?page=1');
$page2 = file_get_contents('https://api.github.com/users/deplicator/events?page=2');
$page3 = file_get_contents('https://api.github.com/users/deplicator/events?page=3');
$page4 = file_get_contents('https://api.github.com/users/deplicator/events?page=4');
$page5 = file_get_contents('https://api.github.com/users/deplicator/events?page=5');
	

$githubjson = 	substr($page1, 0, -1) . "," . 
				substr($page2, 1, -1) . "," .
				substr($page3, 1, -1) . "," .
				substr($page4, 1, -1) . "," .
				substr($page5, 1);
*/
if(isset($_REQUEST['wut'])) {
	echo file_get_contents('https://api.github.com/users/deplicator/events?page=1');
} else {
	$rss = file_get_contents('https://github.com/deplicator.private.atom?token=b476029e3d0854d0d138d22f7b9a9561');

	$dom = new DOMDocument;
	$dom->preserveWhiteSpace = FALSE;
	$dom->loadXML($rss);
	
	$entries = $dom->getElementsByTagName('entry');
	foreach ($entries as $entry) {
		echo '<entry>' . $entry->nodeValue . '</entry>', PHP_EOL;
	}
}