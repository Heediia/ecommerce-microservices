import { useEffect, useState } from "react";

import {
    getUserNotifications,
    markNotificationAsRead,
    deleteNotification
} from "../services/api";


function Notifications() {

    const [notifications, setNotifications] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    const user = JSON.parse(
        localStorage.getItem("user")
    );


    // ==================================================
    // LOAD NOTIFICATIONS
    // ==================================================

    const loadNotifications = async () => {

        try {

            if (!user) {
                setError("Vous devez être connecté.");
                setLoading(false);
                return;
            }

            const data = await getUserNotifications(user.id);

            setNotifications(data);

        } catch (err) {

            setError(err.message);

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        loadNotifications();

    }, []);


    // ==================================================
    // MARK AS READ
    // ==================================================

    const handleRead = async (notificationId) => {

        try {

            await markNotificationAsRead(notificationId);

            await loadNotifications();

        } catch (err) {

            setError(err.message);

        }
    };


    // ==================================================
    // DELETE
    // ==================================================

    const handleDelete = async (notificationId) => {

        try {

            await deleteNotification(notificationId);

            await loadNotifications();

        } catch (err) {

            setError(err.message);

        }
    };


    // ==================================================
    // LOADING
    // ==================================================

    if (loading) {

        return (
            <h1>
                Chargement des notifications...
            </h1>
        );

    }


    // ==================================================
    // NOT LOGGED IN
    // ==================================================

    if (!user) {

        return (
            <div>

                <h1>Notifications</h1>

                <p>
                    Vous devez être connecté.
                </p>

            </div>
        );

    }


    // ==================================================
    // PAGE
    // ==================================================

    return (

        <div>

            <h1>Mes Notifications</h1>


            {error && (
                <p>
                    Erreur : {error}
                </p>
            )}


            {notifications.length === 0 ? (

                <p>
                    Vous n'avez aucune notification.
                </p>

            ) : (

                <div>

                    {notifications.map(
                        (notification) => (

                            <div
                                key={notification.id}
                            >

                                <h2>
                                    {notification.title}
                                </h2>


                                <p>
                                    {notification.message}
                                </p>


                                <p>
                                    <strong>
                                        Type :
                                    </strong>{" "}
                                    {notification.type}
                                </p>


                                <p>
                                    <strong>
                                        Statut :
                                    </strong>{" "}
                                    {notification.read
                                        ? "Lue"
                                        : "Non lue"}
                                </p>


                                <p>
                                    <strong>
                                        Date :
                                    </strong>{" "}
                                    {notification.createdAt}
                                </p>


                                {!notification.read && (

                                    <button
                                        onClick={() =>
                                            handleRead(
                                                notification.id
                                            )
                                        }
                                    >
                                        Marquer comme lue
                                    </button>

                                )}


                                <button
                                    onClick={() =>
                                        handleDelete(
                                            notification.id
                                        )
                                    }
                                >
                                    Supprimer
                                </button>


                                <hr />

                            </div>

                        )
                    )}

                </div>

            )}

        </div>

    );
}


export default Notifications;