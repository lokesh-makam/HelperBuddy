import { FormEvent, useState } from "react";
import {toast} from "react-toastify";

interface VerifyFormProps {
    handleVerify: (e: FormEvent) => void;
    code: string;
    setCode: (value: string) => void;
}

export const VerifyForm = ({ handleVerify, code, setCode }: VerifyFormProps) => {
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!code) return;
        setIsLoading(true);
        try {
            await handleVerify(e);
        } catch (error) {
            toast.error("Verification failed!");
            console.error("Verification error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex justify-center mt-12 md:mt-20">
            <div className="w-80 md:w-96 bg-black rounded-xl md:rounded-3xl shadow-lg">
                <div className="p-6 md:p-8">
                    <h1 className="mb-6 text-2xl font-semibold text-white text-center">
                        Enter Verification Code
                    </h1>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            className="w-full p-3 text-sm bg-transparent border-b-2 border-blue-900 text-white focus:outline-none focus:border-white placeholder-gray-300"
                            placeholder="Enter code"
                            maxLength={6}
                            disabled={isLoading}
                        />
                        <button
                            type="submit"
                            className="w-full py-3 text-sm font-medium text-white bg-slate-700 rounded-md hover:bg-white hover:text-blue-900 transition"
                            disabled={isLoading}
                        >
                            {isLoading ? "Verifying..." : "Verify & Complete Signup"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default VerifyForm;

