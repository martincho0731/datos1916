document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("registroForm");

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        // Capturar los datos del formulario
        const formData = {
            nombre: document.getElementById("nombre").value,
            apellido: document.getElementById("apellido").value,
            credencial: document.getElementById("credencial").value,
            telefono: document.getElementById("telefono").value,
            barrio: document.getElementById("barrio").value,
            direccion: document.getElementById("direccion").value,
            fecha: new Date().toISOString()
        };

        // Leer el archivo JSON actual
        let data = [];
        try {
            const response = await fetch("data.json");
            if (response.ok) {
                data = await response.json();
            }
        } catch (error) {
            console.warn("No se encontró un archivo existente, se creará uno nuevo.");
        }

        // Agregar el nuevo registro
        data.push(formData);

        // Convertir a JSON
        const jsonData = JSON.stringify(data, null, 2);

        // Enviar los datos a GitHub usando un Webhook (GitHub Actions)
        fetch("https://api.github.com/repos/martincho0731/datos1916/contents/data.json", {
            method: "PUT",
            headers: {
                "Accept": "application/vnd.github.v3+json",
                "Authorization": `Bearer ${GITHUB_TOKEN}`, // El token se usa en GitHub Secrets
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: "Actualizando datos de registro",
                content: btoa(jsonData),
                sha: await obtenerSHA()
            })
        })
        .then(response => response.json())
        .then(data => {
            alert("Registro guardado con éxito.");
            form.reset();
        })
        .catch(error => {
            console.error("Error al guardar los datos:", error);
            alert("Hubo un problema al guardar los datos.");
        });
    });

    // Función para obtener el SHA del archivo actual en GitHub
    async function obtenerSHA() {
        try {
            const response = await fetch("https://api.github.com/repos/martincho0731/datos1916/contents/data.json", {
                headers: { "Accept": "application/vnd.github.v3+json" }
            });
            if (response.ok) {
                const data = await response.json();
                return data.sha;
            }
        } catch (error) {
            console.warn("No se encontró un archivo previo en el repositorio.");
        }
        return null;
    }
});
