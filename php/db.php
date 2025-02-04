<?php
$servername = "localhost";      //Servidor
$username = "root";             //Usuario de MySQL (cambiar si es diferente)
$password = "";                 //Contraseña (déjalo vacío si no tienes)
$database = "sopa_letras_db";   //Nombre de la base de datos

//Crear conexxión
$conn = new mysqli($servername, $username, $password, $database);

//Verificar conexión
if ($conn->connect_error) {
    die("Conexión fallida: " . $conn->connect_error);
}

?>