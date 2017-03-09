<?php
/* <!--
 * Name: Import Active Fire Data into PostGIS Database
 * Active Fire: https://earthdata.nasa.gov/earth-observation-data/near-real-time/firms/active-fire-data
 * GitHub: https://github.com/chingchai
 * Purpose: GIST@NU (www.cgistln.nu.ac.th)
 * Date: 2016/04/22
 * Author: Chingchai Humhong (chingchaih@nu.ac.th, chingchai.h@gmail.com)
 !--> */
//database connection details
header("content-type: text/html; charset=utf-8");
include "connect_fire.php";

// date difine

// path where your CSV file is located
define('CSV_PATH','https://firms.modaps.eosdis.nasa.gov/active_fire/c6/text/');

// Name of your CSV file
$csv_file = CSV_PATH . "MODIS_C6_SouthEast_Asia_48h.csv";
if (($handle = fopen($csv_file, "r")) !== FALSE) {
   fgetcsv($handle);
   while (($data = fgetcsv($handle, 1000000, ",")) !== FALSE) {
        $num = count($data);
        for ($c=0; $c < $num; $c++) {
          $col[$c] = $data[$c];
        }
      		 $lat = $col[0];
      		 $lon = $col[1];
      		 $bright = $col[2];
      		 $scan = $col[3];
      		 $track = $col[4];
      		 $adate = $col[5];
      		 $atime = $col[6];
      		 $sat = $col[7];
      		 $confd = $col[8];
      		 $vers = $col[9];
      		 $bright31 = $col[10];
      		 $frp = $col[11];
      		 $dnight = $col[12];
// PostgreSQL Query to insert data into DataBase
$query = "INSERT INTO modis(latitude,longitude,brightness,scan,track,acq_date,acq_time,satellite,instrument,confidence,version,bright_t31,frp,daynight,geom)
		VALUES($lat,$lon,$bright,$scan,$track,'$adate','$atime','$sat','MODIS',$confd,'$vers',$bright31,$frp,'$dnight',ST_GeomFromText('POINT($lon $lat)',4326))";
$s = pg_query($query);
 }
    fclose($handle);
}

    //Update DATETIME
    $sql1 = "UPDATE modis SET yy = date_part('year', acq_date),
							  mm = date_part('month', acq_date),
							  dd = date_part('day', acq_date),
							  datetime = CONCAT(acq_date,' ',substring(acq_time,1,2),':',substring(acq_time,3,2))::timestamp without time zone,
							  time = CONCAT(substring(acq_time,1,2),':',substring(acq_time,3,2))::time without time zone
							  WHERE acq_date > (CURRENT_DATE - INTERVAL '5 days')
							  ";
    pg_query($sql1);
	//echo $sql;	

echo "File hotspot data successfully imported to PostgreSQL database.";
// C:\ms4w\Apache\cgi-bin\php-cgi.exe -f "C:\ms4w\Apache\htdocs\activefire\apphotspot\gdb\fmodis.php"
?>