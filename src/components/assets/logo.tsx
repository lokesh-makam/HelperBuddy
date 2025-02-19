import {Text} from "@/src/components/other/text";
import Image from 'next/image';

type TextColor = "black/900" | "text-white" |  "text-black"| "black/800" | "white" | "white/900" | "white/800" | "gray" | "blue";

interface LogoProps {
    textColour: TextColor ;
}



export  function Logo({ textColour }:any) {
    console.log(textColour);
    return (
        <div className="flex items-center space-x-2">
            <Image
                src="/images/main.ico"
                alt="Helper Buddy Icon"
                width={40}
                height={40}
                className="object-contain"
            />
            <Text
                family="poppins"
                weight={500}
                color={textColour}
                className="md:text-lg whitespace-nowrap"
            >
                Helper Buddy
            </Text>
        </div>
    );
}