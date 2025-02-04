<?php
include 'db.php';

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $palabra = trim($_POST["palabra"]);

    if (!empty($palabra)) {
        $stmt = $conn->prepare("INSERT INTO palabras (palabra) VALUES (?)");
        $stmt->bind_param("s", $palabra);

        if ($stmt->execute()) {
            echo "Palabra agregada correctamente";
        } else {
            echo "Error al agregar la palabra";
        }

        $stmt->close();
    } else {
        echo "La palabra no puede estar vacía.";
    }
}

$conn->close();
?>

<form action="agregar_palabra.php" method="post">
    <input type="text" name="palabra" placeholder="Añadir palabra">
    <button type="submit">Agregar</button>
</form>