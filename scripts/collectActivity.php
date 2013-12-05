<?php
/*
 * For collecting new activity history. Designed to be used automatically as a
 * cronjob.
 */
header('Content-type: application/json; charset=utf-8');
include('../config.php');

try {
    $DBH = new PDO($DB_PDO, $DB_USER, $DB_PASS);

    /**
     * GitHub
     * Uses the user api to collect 30 most recent public events.
     * This is also the example for future api data gathering.
     */
    $info = file_get_contents('https://api.github.com/users/deplicator/events');
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

    /**
     * Blogger
     * Uses blogger api v3 to gather 20 most recent blog posts.
     */
    $blog = file_get_contents('https://www.googleapis.com/blogger/v3/blogs/' . $BLOGGER_ID .
                              '/posts?maxResults=20&key=' . $BLOGGER_KEY);
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
                    values ($id, '$activityTime', '$type', '$jsonObject', '$raw')";

        $STH = $DBH->prepare($sql);
        $STH->execute();
    }
}
catch (PDOException $e) {
    echo $e->getMessage();
}