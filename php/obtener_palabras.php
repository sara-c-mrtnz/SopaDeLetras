<?php
include 'db.php';

$sql = "SELECT palabra FROM palabras";
$result = $conn->query($sql);

$palabras = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $palabras[] = $row['palabra'];
    }
}

echo json_encode($palabras);

$conn->close();
?>
