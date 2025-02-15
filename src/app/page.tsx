"use client"
import Home from "@/src/components/Home";
import {useUser} from "@clerk/nextjs";
import {useEffect} from "react";
import {saveUserToDatabase} from "@/src/actions/user";
import Loading from "@/src/app/loading";

let Main=()=>{
  const { user, isLoaded } = useUser();
  useEffect(() => {
    const handleUserCheck = async () => {
      if (!isLoaded||!user) return;
      await saveUserToDatabase({
        id:user.id,
        email: user.emailAddresses[0]?.emailAddress || "",
        firstname: user.firstName || "",
        lastname: user.lastName || "",
      });
    };
    handleUserCheck();
  }, [isLoaded, user]);
  if(!isLoaded) return <Loading/>;
  return (
      <Home/>
  )
}
export default Main;