<?php
  require 'chotarest/app.php';
  $restapp = new RestfulApp();
  $restapp->HandleCors();
  $restapp->run();

  // To test this out
  // http://localhost:8089/services/rest.api.php/testrest/booga
  function testrest($param){
    echo "<div style='background-color:#9baedd;color:#723014;font-size:30px;padding:20px;border:5px solid #723014;'>If you called the <code>testrest</code> API and passed <code>" . $param . "</code> as the parameter, then your <b>Rest server</b> is set up good!</div>";
  }

  function console_log($message) {
    $STDERR = fopen("php://stderr", "w");
              fwrite($STDERR, "\n".$message."\n");
              fclose($STDERR);
  }

  function saveevent(){
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
      $json = file_get_contents('php://input');
      $data = json_decode($json);
      require_once('objectlayer/eventintime.php');
      console_log($data->eventid);
      $eventintime = new eventintime($data->eventid);
      $eventintime->startdate = $data->startdate;
      $eventintime->enddate = $data->enddate;
      $eventintime->description = $data->description;
      $eventintime->Save();
      echo json_encode($eventintime);
    }
  }

  function getallevents(){
    require_once('objectlayer/eventintimecollection.php');
    // $filter=null, $sortby=null, $sortdirection=null, $limit=null
    $eventintimecollection = new eventintimecollection(null,'id','desc');
    echo json_encode($eventintimecollection->getobjectcollection());

  }

?>
