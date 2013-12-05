<?php 
/* 
 * Get activity from database.
 */
header('Content-type: application/json');
include('../config.php');

$recent = false;
if (isset($_REQUEST['limit'])) {
    $limitub = intval($_REQUEST['limit'], 10);
    if ($_REQUEST['limit'] == "recent") {
        $recent = true;
    }
} else {
    $limitub = 30;
}
if ($limitub < 30) { $limitub = 30; }
$limitlb = $limitub - 30;


try {
    $DBH = new PDO($DB_PDO, $DB_USER, $DB_PASS);
    if ($recent) {
        $sql = "SELECT `activityTime`, `type`, `jsonObject`
                FROM activity 
                WHERE `activityTime` = (SELECT MAX(`activityTime`) 
                                        FROM `activity` 
                                        WHERE `type` = 'github') OR 
                      `activityTime` = (SELECT MAX(`activityTime`)
                                        FROM `activity`
                                        WHERE `type` = 'blog') OR 
                      `activityTime` = (SELECT MAX(`activityTime`)
                                        FROM `activity`
                                        WHERE `type` = 'codecademy')";
    } else {
        $sql = "SELECT * from `activity` ORDER BY `activityTime` DESC LIMIT $limitlb, $limitub";
    }
    $STH = $DBH->query($sql);
    $STH->setFetchMode(PDO::FETCH_OBJ);
    $result = [];
    while ($obj = $STH->fetch()) {
        $arr = array('type' => $obj->type, 'activityTime' => $obj->activityTime, 'jsonObject' => json_decode($obj->jsonObject));
        array_push($result, $arr);;
    }
    echo json_encode($result);
}
catch(PDOException $e) {
    echo $e->getMessage();
}