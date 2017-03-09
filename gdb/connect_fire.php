<?php
/* <!--
 * Name: Import Active Fire Data into PostGIS Database
 * Active Fire: https://earthdata.nasa.gov/earth-observation-data/near-real-time/firms/active-fire-data
 * GitHub: https://github.com/chingchai
 * Purpose: GIST@NU (www.cgistln.nu.ac.th)
 * Date: 2016/04/22
 * Author: Chingchai Humhong (chingchaih@nu.ac.th, chingchai.h@gmail.com)
 !--> */
$hostname_db = "localhost";
$database_db = "fire_hotspot";
$username_db = "postgres";
$password_db = "00076551";

$mgdb = pg_connect("host=$hostname_db user=$username_db password=$password_db dbname=$database_db") or die("Can't Connect Server");

pg_query("SET client_encoding = 'utf-8'");

?>