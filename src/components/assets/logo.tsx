import {Text} from "@/src/components/other/text";
import Image from 'next/image';

export function Logo({ textColour }: any) {
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
                color={textColour} // Pass textColour as a valid color value
                className="md:text-lg whitespace-nowrap"
            >
                Helper Buddy
            </Text>
        </div>
    );
}