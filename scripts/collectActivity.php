<?php
/*
 * For collecting new activity history. Designed to be used automatically as a
 * cronjob.
 */
header('Content-type: application/json; charset=utf-8');
include('../config.php');

try {
    $DBH = new PDO(DB_PDO, DB_USER, DB_PASS);

    /**
     * GitHub
     * Uses the user api to collect 30 most recent public events.
     * This is also the example for future api data gathering.
     */
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_URL, "https://api.github.com/users/deplicator/events"); 
    curl_setopt($ch, CURLOPT_USERAGENT, "deplicator"); 
    $info = curl_exec($ch);
    curl_close($ch);
    
    $events = json_decode($info);
    $eventslen = count($events);
    for ($i = 0; $i < $eventslen; $i++) {

        // Source's id, this is potentially problematic.
        $id = $events[$i]->id;

        // Activity times stored in database in unix time format.
        $activityTime = date('U', strtotime($events[$i]->created_at));

        // String to identify source of activity.
        $type = "github";

        // Original json string from source.
        $raw = json_encode($events[$i], JSON_HEX_QUOT | JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_AMP);

        // What I deemed useful.
        $jsonObject = json_encode(array("type"=>$events[$i]->type,
            "who"=>$events[$i]->actor->login,
            "wholink"=>"https://github.com/" . $events[$i]->actor->login,
            "repo"=>explode('/', $events[$i]->repo->name)[1],
            "repolink"=>"https://github.com/" . $events[$i]->repo->name,
            "when"=>$events[$i]->created_at,
            "payload"=>$events[$i]->payload
            ), JSON_HEX_QUOT | JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_AMP);

        $sql = "INSERT INTO
                    activity (id, activityTime, type, jsonObject, raw)
                    values ('$id', '$activityTime', '$type', '$jsonObject', '$raw')";
        $STH = $DBH->prepare($sql);
        $STH->execute();
    }

    /**
     * Blogger
     * Uses blogger api v3 to gather 20 most recent blog posts.
     */
    $blog = file_get_contents('https://www.googleapis.com/blogger/v3/blogs/' . BLOGGER_ID .
                              '/posts?maxResults=20&key=' . BLOGGER_KEY);
    $data = json_decode($blog);
    $postlen = count($data->items);
    for ($i = 0; $i < $postlen; $i++) {
        $id = intval($data->items[$i]->id, 10);
        $createdAt = $data->items[$i]->published;
        $activityTime = date('U', strtotime(substr($createdAt, -6, -3) . " hours" , strtotime(substr($createdAt,0, -6))));
        $type = "blog";
        $raw = json_encode($data->items[$i], JSON_HEX_QUOT | JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_AMP );
        $jsonObject = json_encode(array(
                            "published" => $data->items[$i]->published,
                            "updated" => $data->items[$i]->updated,
                            "link" => $data->items[$i]->url,
                            "title"=>$data->items[$i]->title,
                            "comments"=>$data->items[$i]->replies->totalItems
                            ), JSON_HEX_QUOT | JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_AMP );

        $sql = "INSERT INTO
                    activity (id, activityTime, type, jsonObject, raw)
                    values ('$id', '$activityTime', '$type', '$jsonObject', '$raw')";

        $STH = $DBH->prepare($sql);
        $STH->execute();
    }
    
    /**
     * Codecademy
     */
    $html = file_get_contents('http://www.codecademy.com/users/deplicator/achievements');
    $doc = new DOMDocument();
    libxml_use_internal_errors(true);
    $doc->loadHTML($html);
    libxml_use_internal_errors(false);
    $xml = simplexml_import_dom($doc);
    $achievements = $xml->xpath("//div[@class='achievement']"); 

    $arr = Array();

    foreach ($achievements as $achievement) {
        error_reporting(0);
        if(is_object($achievement->a->p->span)) {
            //For achievements with links.
            $name = trim((string)$achievement->a->p->span[0]);
            $date = trim((string)$achievement->a->p->span[1]);
            $badge = explode("(", (string)$achievement->a->div['style']);
            $badge = "http://www.codecademy.com" . substr($badge[1], 0, -1);
            $link = "http://www.codecademy.com" . (string)$achievement->a['href'];

            $id = hexdec(hash("crc32", $achievement->a->p->span));
            $id = $id * 12;
            $activityTime = strtotime($date);
            $type = "codecademy";
            $jsonObject = json_encode(Array("name" => $name,
                                            "date" => $activityTime,
                                            "badge" => $badge,
                                            "link" => $link), 
                                            JSON_HEX_QUOT | JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_AMP);
            
        } else if(is_object($achievement->p->span)) {
            //For achievements without links.
            $name = trim((string)$achievement->p->span[0]);
            $date = trim((string)$achievement->p->span[1]);
            $badge = explode("(", (string)$achievement->div['style']);
            $badge = "http://www.codecademy.com" . substr($badge[1], 0, -1);
            
            $id = hexdec(hash("crc32", $achievement->p->span));
            $id = $id * 12;
            $activityTime = strtotime($date);
            $type = "codecademy";
            $jsonObject = json_encode(Array("name" => $name,
                                            "date" => $activityTime,
                                            "badge" => $badge),
                                            JSON_HEX_QUOT | JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_AMP);

        }

        //No raw column for codecademy.
        $sql = "INSERT INTO
                        activity (id, activityTime, type, jsonObject)
                        values ('$id', '$activityTime', '$type', '$jsonObject')";

        $STH = $DBH->prepare($sql);
        $STH->execute();
    }

    
    /**
     * Khan Academy Badges
     * Makes use of simple oauth library. This only needs to authenticate for one user, so the token
     * and secret were created manually then hard coded here. In theory they should not change. The
     * Khan Academy API for badges will work without authentication, but will not return my badges
     * even though my profile is public. :( 
     */
    // Create an authenticated badge url.
    $oauth = new OAuthSimple();
    $badgeUrl = $oauth->sign(Array('path' => 'http://www.khanacademy.org/api/v1/badges',
                                   'signatures' => Array('consumer_key'  => KA_CONSUMER_KEY,
                                                         'shared_secret' => KA_CONSUMER_SECRET,
                                                         'access_token'  => KA_OAUTH_TOKEN,
                                                         'access_secret' => KA_OAUTH_SECRET)));

    // Get all badge api info!
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_URL, $badgeUrl['signed_url']);
    $info = curl_exec($ch);
    curl_close($ch);
    
    // Returns an array of objects representing every badge Khan Academy offers.
    $events = json_decode($info);
    $eventslen = count($events);
    foreach($events as $event) {
    
        // If I have that badge there is an array inside the badge object with information about 
        // each time the badge was acquired. This is what should go in the database.
        if($event->is_owned == 1) {
        
            // Original json string from source.
            $raw = json_encode($event, JSON_HEX_QUOT | JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_AMP);
        
            // Generic badge info.
            $badgeURL = $event->absolute_url;
            $badgeIcon = $event->icon_src;
            $badgeName = $event->description;
            $badgeDescription = $event->safe_extended_description;
            
            // Specific badge info.
            foreach($event->user_badges as $badge) {
            
                // Hopefully a unique id for each badge earned (based on the hypothesis two badges 
                // of the same name cannot be earned at the same time).
                $id = hash('md5', $badge->date . $badge->badge_name);
                
                // Activity times stored in database in unix time format.
                $activityTime = date('U', strtotime($badge->date));
                
                // Combine with name for specific badge.
                $badgeContext = $badge->target_context_name;
                if($badgeContext == '') {
                    $badgeNomenclature = $badgeName;
                } else {
                    $badgeNomenclature = $badgeName . ' for '. $badgeContext;
                }
                
                // String to identify source of activity.
                $type = "khanacademy";

                // What I deemed useful.
                $jsonObject = json_encode(array(
                    'when'          => $activityTime,
                    'badgelink'     => $badgeURL,
                    'icon'          => $badgeIcon,
                    'name'          => $badgeNomenclature,
                    'description'   => $badgeDescription
                    ), JSON_HEX_QUOT | JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_AMP);

                //print_r(array($id, $activityTime, $type, json_decode($jsonObject), $raw));
                $sql = "INSERT INTO
                            activity (id, activityTime, type, jsonObject, raw)
                            values ('$id', '$activityTime', '$type', '$jsonObject', '$raw')";
                $STH = $DBH->prepare($sql);
                $STH->execute();
            }
        }
    }

} catch (PDOException $e) {
    echo $e->getMessage();
}