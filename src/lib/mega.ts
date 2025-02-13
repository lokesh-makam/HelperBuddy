"use server"
import { Storage } from "megajs";

let storageInstance: Storage | null = null;

async function getStorageInstance(): Promise<Storage> {
    if (storageInstance) {
        return storageInstance;
    }
    storageInstance = new Storage({
        email: process.env.MEGA_EMAIL!,
        password: process.env.MEGA_PASSWORD!,
    });
    return new Promise<Storage>((resolve, reject) => {
        storageInstance!.login((error) => {
            if (error) {
                console.error("MEGA Login Failed:", error);
                reject(new Error("MEGA Login Failed"));
            } else {
                resolve(storageInstance!);
            }
        });
    });
}

async function getMegaFolder(storage: Storage) {
    try {
        const root = storage.mounts;
        const cloudDrive = root.find((item) => item.name === "Cloud Drive" && item.directory);
        if (!cloudDrive) throw new Error("Cloud Drive folder not found in MEGA");

        const subfolderName = process.env.MEGA_FOLDER;
        if (!subfolderName) throw new Error("MEGA_FOLDER is not set in environment variables");

        const targetSubfolder = cloudDrive.children?.find((item) => item.name === subfolderName && item.directory);
        if (!targetSubfolder) throw new Error(`Folder "${subfolderName}" not found inside Cloud Drive`);

        return targetSubfolder;
    } catch (error) {
        console.error("Error accessing MEGA folder:", error);
        throw error;
    }
}

export async function uploadToMega(fileBuffer: Buffer, originalName: string): Promise<string> {
    try {
        console.log("Uploading file to MEGA...");
        const storage = await getStorageInstance();
        console.log("MEGA Login Successful");
        const targetFolder = await getMegaFolder(storage);
        console.log("MEGA Folder Selected", targetFolder.name);
        return new Promise((resolve, reject) => {
            const uploader = targetFolder.upload({ name: originalName, size: fileBuffer.length }, fileBuffer);

            uploader.on("complete", async (file: { link: () => any }) => {
                try {
                    const link = await file.link();
                    fileBuffer.fill(0);
                    resolve(link);
                } catch (error) {
                    reject(error);
                }
            });

            uploader.on("error", (err: any) => {
                console.error("Upload error:", err);
                reject(err);
            });
        });
    } catch (error) {
        console.error("MEGA Upload Failed:", error);
        throw new Error("Failed to upload file to MEGA.");
    }
}
