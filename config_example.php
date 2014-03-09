<?php
//Rename this file config.php and add api keys.

include('libs/OAuthSimple.php');

define('DB_PDO', 'mysql:host=localhost;dbname=yourdbname');
define('DB_USER', 'rootisnotagoodidea');
define('DB_PASS', 'anawesoelongpassword');

define('BLOGGER_KEY', 'your_blogger_key-jM');
define('BLOGGER_ID', 'your_blogger_id');

define('KA_CONSUMER_KEY', 'khanacademystuff');
define('KA_CONSUMER_SECRET', 'khanacademystuff');
define('KA_OAUTH_TOKEN', 'khanacademystuff'); 
define('KA_OAUTH_SECRET', 'khanacademystuff');