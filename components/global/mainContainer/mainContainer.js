import { createLoginForm } from '../../users/loginForm/loginForm';
import { CHECK_LOGGED_URL } from '../../../utils/apiUrls';
import './mainContainer.css';
import { showEvents } from '../../eventss/events/events';
import { heroContainer } from '../heroContent/heroContent';

export function mainContainer() {
    const mainContainer = document.createElement('main');
    mainContainer.id = 'main-container';

    // Obtener el userId y el accessToken guardados en localStorage
    const userId = localStorage.getItem("userId");
    const accessToken = localStorage.getItem("accessToken");

    // Definir una función async para cargar el contenido del contenedor principal
    async function loadContent() {
        if (userId && accessToken) {
            // Si hay userId y accessToken tenemos que chequear que sean correctos.
            // Para eso tenemos una ruta que recibe userId y accessToken, chequea que el user esté
            // Autenticado, y devuelve sus datos.
            // Utiliza el mismo controller que getUserById, pero con el middleware de autenticación.
            try {
                const response = await fetch(`${CHECK_LOGGED_URL}/${userId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${accessToken}`
                    },
                })

                // Si no son correctos, borramos el localStorage y mostramos el login
                if (!response.ok) {
                    localStorage.clear()
                    const loginForm = await createLoginForm();
                    mainContainer.appendChild(loginForm);
                } else {
                    // Si son correctos significa que el user está logueado, entonces mostramos los eventos
                    const hero = await heroContainer(mainContainer)
                    const events = await showEvents();
                    mainContainer.appendChild(hero);
                    mainContainer.appendChild(events);
                }   

            } catch {
                // Si hay algun error en el bloque try, mandamos al usuario al login
                /*localStorage.clear()
                const loginForm = await createLoginForm();
                mainContainer.appendChild(loginForm);*/
            }
        } else {
            const loginForm = await createLoginForm();
            mainContainer.appendChild(loginForm);
        }
    }

    // Llamar a la función async para cargar el contenido del contenedor principal
    loadContent();

    return mainContainer;
}  