<?php
header('Content-type: application/json');
include('../config.php');

if(isset($_REQUEST['wut'])) {
	$wut = $_REQUEST['wut'];
}

if($wut == 'posts') {
	echo file_get_contents('https://www.googleapis.com/blogger/v3/blogs/' . $BLOGGER_ID . '/posts?maxResults=20&key=' . $BLOGGER_KEY);
} else if($wut == 'blog') {
	echo file_get_contents('https://www.googleapis.com/blogger/v3/blogs/' . $BLOGGER_ID . '?key=' . $BLOGGER_KEY);
} else {
	echo 'error';
}