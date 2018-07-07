<?php

//$postdata = file_get_contents("php://input");


//print_r($_POST);

//print_r($_FILES);
if (isset($_FILES)) {
    $path = ''.$_FILES['file']['name'];
    if(move_uploaded_file($_FILES['file']['tmp_name'], $path)){
echo 'move_uploaded_file';
    }
}

if (isset($_POST)) {

    $request = $_POST;

    if (!empty($request['TrackingNumber'])) {
        $array['error']="error";
        $array['result']="success";
        $array['data']=[          
          "file" => $request['file'],
          "TrackingNumber" => $request['TrackingNumber']
          ];
      echo json_encode($array);     
    } else {
      echo json_encode("Post vacío dd");
      //header("HTTP/1.0 404 Not Found");
    }
} else {
    echo json_encode("Post mal echo");
    //header("HTTP/1.0 404 Not Found");
}

  /*
   "IdCliente": user.IdCliente,

                            "TrackingNumber": $scope.TrackingNumber,

                            "Shop": $scope.Shop,

                            "Value": $scope.Value,

                            "DateofArrival": moment($scope.arraivalDate).format('DD/MM/YYYY'),

                            "Category": $scope.category,

                            "Description": $scope.Description,

                            */
?>