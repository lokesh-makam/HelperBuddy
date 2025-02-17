import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card"
import { Wallet } from "lucide-react"

const WalletPage = () => {
    const balance = 2547.89

    return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <Card className="w-full max-w-md bg-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-xl font-bold">Wallet Balance</CardTitle>
                    <Wallet className="h-6 w-6" />
                </CardHeader>
                <CardContent>
                    <div className="text-5xl font-bold text-center py-8">
                        {balance.toLocaleString("en-IN", {
                            style: "currency",
                            currency: "INR",
                        })}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default WalletPage