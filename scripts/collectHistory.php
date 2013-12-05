<?php
/*
 * For collecting as much activity history as possible. Designed to be used
 * manually, not as a cronjob.
 */
ini_set('error_reporting', E_ALL);
header('Content-type: application/json; charset=utf-8');
include('../config.php');

try {
    $DBH = new PDO($DB_PDO, $DB_USER, $DB_PASS);

    /**
     * GitHub
     * Uses the user api to collect 30 most recent public events.
     * This is also the example for future api data gathering.
     */
    for ($j = 1; $j <=10; $j++) {
        $info = file_get_contents('https://api.github.com/users/deplicator/events?page=' . $j);
        $events = json_decode($info);
        $eventslen = count($events);
        for ($i = 0; $i < $eventslen; $i++) {

            //Source's id, this is potentially problematic.
            $id = $events[$i]->id;

            //Activity times stored in database in unix time format.
            $activityTime = date('U', strtotime($events[$i]->created_at));

            //String to identify source of activity.
            $type = "github";

            //Original json string from source.
            $raw = json_encode($events[$i], JSON_HEX_QUOT | JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_AMP);

            //What I deemed useful.
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
                        values ($id, '$activityTime', '$type', '$jsonObject', '$raw')";
            $STH = $DBH->prepare($sql);
            $STH->execute();
        }
    }


    /**
     * Blogger
     * Uses blogger api v3 to gather blog posts, page by annoying page, 20 at a time
     */
    $blog1 = file_get_contents('https://www.googleapis.com/blogger/v3/blogs/' . $BLOGGER_ID . '/posts?maxResults=20&key=' . $BLOGGER_KEY);
    $blog2 = file_get_contents('https://www.googleapis.com/blogger/v3/blogs/' . $BLOGGER_ID . '/posts?maxResults=20&pageToken=CgkIFBjhk8z8_iYQrOCoAw&key=' . $BLOGGER_KEY);
    $blog3 = file_get_contents('https://www.googleapis.com/blogger/v3/blogs/' . $BLOGGER_ID . '/posts?maxResults=20&pageToken=CgkIFBjHrIPh7iQQrOCoAw&key=' . $BLOGGER_KEY);
    $blog4 = file_get_contents('https://www.googleapis.com/blogger/v3/blogs/' . $BLOGGER_ID . '/posts?maxResults=20&pageToken=CgkIFBiDocnPmiMQrOCoAw&key=' . $BLOGGER_KEY);
    $blog5 = file_get_contents('https://www.googleapis.com/blogger/v3/blogs/' . $BLOGGER_ID . '/posts?maxResults=20&pageToken=CgkIFBigrIOa-CIQrOCoAw&key=' . $BLOGGER_KEY);
    $blog6 = file_get_contents('https://www.googleapis.com/blogger/v3/blogs/' . $BLOGGER_ID . '/posts?maxResults=20&pageToken=CgkIFBjgtNqEziIQrOCoAw&key=' . $BLOGGER_KEY);
    $blog7 = file_get_contents('https://www.googleapis.com/blogger/v3/blogs/' . $BLOGGER_ID . '/posts?maxResults=20&pageToken=CgkIFBjggYqTuCIQrOCoAw&key=' . $BLOGGER_KEY);
    $blog8 = file_get_contents('https://www.googleapis.com/blogger/v3/blogs/' . $BLOGGER_ID . '/posts?maxResults=20&pageToken=CgkIFBigtLzl4yAQrOCoAw&key=' . $BLOGGER_KEY);
    //there are more pages...

    for ($j = 1; $j <=8; $j++) { //cycle through pages above
        $blog = "blog" . $j;
        $data = json_decode($$blog); //I do believe this is the first time I've ever used a variable variable.
        $postlen = count($data->items);
        for ($i = 0; $i < $postlen; $i++) {
            $id = intval($data->items[$i]->id, 10);
            $createdAt = $data->items[$i]->published;
            $activityTime = date('U', strtotime(substr($createdAt, -6, -3) . " hours" , strtotime(substr($createdAt,0, -6))));
            $type = "blog";
            $raw = json_encode($data->items[$i], JSON_HEX_QUOT | JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_AMP );
            //The raw data from blogger is particularly problematic because it has nested html.
            //I don't need the content of the post for my purposes so I exclude it.
            $jsonObject = json_encode(array(
                                "published" => $data->items[$i]->published,
                                "updated" => $data->items[$i]->updated,
                                "link" => $data->items[$i]->url,
                                "title"=>$data->items[$i]->title,
                                "comments"=>$data->items[$i]->replies->totalItems
                                ), JSON_HEX_QUOT | JSON_HEX_TAG | JSON_HEX_APOS | JSON_HEX_AMP );

            $sql = "INSERT INTO
                        activity (id, activityTime, type, jsonObject, raw)
                        values ($id, '$activityTime', '$type', '$jsonObject', '$raw')";

            $STH = $DBH->prepare($sql);
            $STH->execute();
        }
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
        error_reporting(1);
                print_r($id . "\n" . $activityTime . "\n" . $type . "\n" . $jsonObject . "\n\n\n");
        //No raw column for codecademy.
        $sql = "INSERT INTO
                        activity (id, activityTime, type, jsonObject)
                        values ($id, '$activityTime', '$type', '$jsonObject')";

        $STH = $DBH->prepare($sql);
        $STH->execute();
    }
}
catch (PDOException $e) {
    echo $e->getMessage();
}