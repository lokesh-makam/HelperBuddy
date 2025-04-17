import { useEffect } from "react";
import { useClerk } from "@clerk/nextjs";

const AutoSignOutOnTabClose = () => {
    const { signOut } = useClerk();

    useEffect(() => {
        const rememberMe = localStorage.getItem("rememberMe");

        const handleBeforeUnload = async () => {
            if (rememberMe !== "true" && sessionStorage.getItem("tempSession")) {
                // Sign out on tab close
                await signOut();
                sessionStorage.removeItem("tempSession");
            }
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);

    return null;
};

export default AutoSignOutOnTabClose;
