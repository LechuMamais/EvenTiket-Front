import { makeRequest } from "../../../utils/api";
import { LOGIN_URL } from "../../../utils/apiUrls";
import { showNotification } from "../../global/showNotification/showNotification";
import { createRegistrationForm } from "../registrationForm/registrationForm"; // Importa la función para crear el formulario de registro
import "./loginForm.css";

export const createLoginForm = (userName) => {
    const form = document.createElement("form");
    form.id = "login-form";
    form.setAttribute("autocomplete", "on");
    form.innerHTML = `
        <h2>Iniciar Sesión</h2>
        <label for="userName">Nombre de usuario:</label>
        <input type="text" id="userName" name="userName" value="${userName}">
        
        <label for="password">Contraseña:</label>
        <input type="password" id="password" name="password">
        
        <button id="submit-button" type="submit">Iniciar Sesión</button>
        <button id="register-button">¿No te has registrado?</button> <!-- Botón de registro -->
    `;

    // Evento para el botón de registro
    const registerButton = form.querySelector("#register-button");
    registerButton.addEventListener("click", () => {
        // Limpiar el contenedor principal
        const mainContainer = document.querySelector("#main-container");
        mainContainer.innerHTML = "";
        // Mostrar el formulario de registro
        mainContainer.appendChild(createRegistrationForm());
    });

    form.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = {
            userName: form.querySelector("#userName").value,
            password: form.querySelector("#password").value
        };

        try {
            const response = await makeRequest(LOGIN_URL, 'POST', formData)
            if (!response) {
                throw new Error("Error al iniciar sesión");
            }
            
            const data = response;

            // Guardar el token de autenticación y el ID del usuario en localStorage
            localStorage.setItem("accessToken", data.token);
            localStorage.setItem("userId", data.user._id);
            localStorage.setItem("userName", data.user.userName);

            // Iniciada la sesión, recargamos, lo que nos lleva a la página de los eventos

            window.location.reload();
        } catch (error) {
            console.error("Error al iniciar sesión:", error.message);
            // Mostrar un mensaje de error
            await showNotification("Error al iniciar sesion.", "error-login", 10000);
        }
    });

    const formContainer = document.createElement("div");
    formContainer.id = "login-form-container";
    formContainer.appendChild(form);

    return formContainer;
}
