<?php
//https://developers.facebook.com/docs/opengraph/howtos/publishing-with-app-token/
header('Content-type: application/json');
include('../config.php');

$acces_token = file_get_contents('https://graph.facebook.com/oauth/access_token?grant_type=client_credentials&client_id=' . $FB_APPID_APIKEY . '&client_secret=' . $FB_APP_SECRET);
$facebookjson=file_get_contents('https://graph.facebook.com/100001962336439/posts?limit=300&'.$acces_token);
echo $facebookjson;