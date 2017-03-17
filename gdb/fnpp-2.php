<?php
//database connection details
header("content-type: text/html; charset=utf-8");
include "connect_fire.php";

// path where your CSV file is located
define('CSV_PATH','https://firms.modaps.eosdis.nasa.gov/active_fire/viirs/text/');


function chkFiredata($firedata, $satellite){
    //$check = "SELECT alrcode FROM active_land WHERE alrcode = '$code'";
    $result = pg_query("SELECT * FROM $satellite WHERE '".$firedata."'=concat(latitude,longitude,bright_ti4,acq_date,acq_time)");

    if(pg_fetch_array($result) !== false){
          return 1;
      }else{
          return 0;
      }
}
			
// Name of your CSV file
$csv_file = CSV_PATH . "VNP14IMGTDL_NRT_SouthEast_Asia_24h.csv";
if (($handle = fopen($csv_file, "r")) !== FALSE) {
  fgetcsv($handle);
  $i=1;
  while (($data = fgetcsv($handle, 1000000, ",")) !== FALSE) {
        $num = count($data);
      	$lat = $data[0];
      	$lon = $data[1];
      	$bright = $data[2];
      	$scan = $data[3];
      	$track = $data[4];
      	$adate = $data[5];
      	$atime = $data[6];
      	$sat = $data[7];
      	$confd = $data[8];
      	$vers = $data[9];
      	$bright31 = $data[10];
      	$frp = $data[11];
      	$dnight = $data[12];
      // PostgreSQL Query to insert data into DataBase

        $firedata = $data[0].$data[1].$data[2].$data[5].$data[6];
        //echo $firedata;
        $chkedFire = chkFiredata($firedata,'npp_viirs24hr');

        if($chkedFire==0){
            $query = "INSERT INTO npp_viirs24hr(latitude,longitude,bright_ti4,scan,track,acq_date,acq_time,satellite,instrument,confidence,version,bright_ti5,frp,daynight,geom)
						VALUES($lat,$lon,$bright,$scan,$track,'$adate','$atime','$sat','VIIRS','$confd','$vers',$bright31,$frp,'$dnight',ST_GeomFromText('POINT($lon $lat)',4326))";
			pg_query($query);
			
        }
    // echo $i."-".$chkedFire."</br>";
	//$i+=1;
    //pg_query($query);
  }
    fclose($handle);

			$sqlUpdate = "UPDATE npp_viirs24hr SET 	yy = date_part('year', acq_date),
										mm = date_part('month', acq_date),
										dd = date_part('day', acq_date),
										datetime = CONCAT(acq_date,' ',substring(acq_time,1,2),':',substring(acq_time,3,2))::timestamp without time zone,
										time = CONCAT(substring(acq_time,1,2),':',substring(acq_time,3,2))::time without time zone
										WHERE acq_date > (CURRENT_DATE - INTERVAL '2 days')
										";				
            pg_query($sqlUpdate);	
	
			$query2 = "INSERT INTO npp_viirs (latitude,longitude,bright_ti4,scan,track,acq_date,acq_time,satellite,instrument,confidence,version,bright_ti5,frp,daynight,yy,mm,dd,datetime,time,geom)
						SELECT latitude,longitude,bright_ti4,scan,track,acq_date,acq_time,satellite,instrument,confidence,version,bright_ti5,frp,daynight,yy,mm,dd,datetime,time,geom
						FROM npp_viirs24hr
						WHERE NOT EXISTS (SELECT * FROM npp_viirs WHERE CONCAT(npp_viirs24hr.latitude,npp_viirs24hr.longitude,npp_viirs24hr.bright_ti4,npp_viirs24hr.acq_date,npp_viirs24hr.acq_time) = CONCAT(npp_viirs.latitude,npp_viirs.longitude,npp_viirs.bright_ti4,npp_viirs.acq_date,npp_viirs.acq_time))";
			pg_query($query2);
}
echo "File hotspot data successfully imported to PostgreSQL database.";
// C:\ms4w\Apache\cgi-bin\php-cgi.exe -f "C:\ms4w\Apache\htdocs\activefire\apphotspot\gdb\fnpp.php"
?>