import {auth} from "@clerk/nextjs/server";
import {redirect} from "next/navigation";
import {db} from "@/db";
import {Card} from "@/components/ui/card";
import {format} from 'date-fns'
import {FileIcon} from "@radix-ui/react-icons";
import UploadDialog from "@/components/upload-dialog";
import {Separator} from "@/components/ui/separator";
import {formatBytes} from "@/lib/utils";
import {s3} from "@/lib/s3";
import DownloadButton from "@/components/download-button";


export default async function Dashboard() {
    const id = auth().userId
    if (!id) redirect("/login")


    const files = await db.query.file.findMany({
        where: ({userId}, {eq}) => eq(userId, id),
    })

    const clean = await Promise.all(files.map(async (v) => {
        const url = await s3.getSignedUrlPromise('getObject', {
            Bucket: 'main',
            Key: v.id,
            Expires: 3600,
        })

        return {
            ...v,
            url
        }
    }))

    return (
        <div className={"max-w-screen-xl mx-auto p-4"}>
            <div className={"flex flex-row justify-between"}>
                <h1 className={"text-bold text-xl mb-4 font-bold"}>Files</h1>
                <UploadDialog/>
            </div>
            <Separator className={"mt-1 mb-2"}/>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {clean.map((file) => (
                    <Card className="flex flex-col gap-6 lg:p-6 p-4" key={file.id}>
                        <div className="flex items-center gap-4">
                            <div className="bg-primary rounded-md p-3 flex items-center justify-center">
                                <FileIcon className="w-6 h-6 text-primary-foreground"/>
                            </div>
                            <div className="grid gap-1">
                                <div className="font-semibold">{file.fileName}</div>
                                <div className="text-xs text-muted-foreground">Created
                                    at {format(file.createdAt, 'PPP')}</div>
                            </div>
                        </div>
                        <div className="flex flex-col sm:flex-row items-center justify-between">
                            <div className="text-sm text-muted-foreground">
                                <span>{formatBytes(file.size)}</span>
                            </div>
                            <DownloadButton url={file.url} iv={file.iv} name={file.fileName}/>
                        </div>
                    </Card>
                ))}
            </div>
                {!files.length && (
                    <div
                        className="flex full h-full py-10 rounded-lg flex-col items-center justify-center gap-4 border-2 border-dashed">
                        <div className="flex flex-col items-center gap-2">
                            <FileIcon className="h-12 w-12 text-muted-foreground"/>
                            <h3 className="text-2xl font-bold">No files found</h3>
                            <p className="text-muted-foreground">It looks like you haven't uploaded any files yet.</p>
                        </div>
                    </div>
                )}
        </div>
    )
}