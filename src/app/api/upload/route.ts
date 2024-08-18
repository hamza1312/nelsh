import {s3} from "@/lib/s3";
import {nanoid} from "nanoid";
import {db} from "@/db";
import {file} from "@/schema";
import {formatBytes} from "@/lib/utils";
import {auth} from "@clerk/nextjs/server";
import {NextResponse} from "next/server";


export const POST = async (request: Request) => {
    const user = auth().userId

    if (!user) return NextResponse.json({
        error: true,
        message: "Unauthorized"
    }, {status: 401})


    const formData = await request.formData()
    const files = formData.getAll("file") as File[]
    const ivs = formData.getAll("iv") as string[]
    // validation:
    if (files.length !== ivs.length) {
        return new Response("IV mismatch", {status: 400})
    }



    await Promise.all(
        files.map(async (f, index) => {
            const id = nanoid()
            // convert array buffer to UintArray
            const buf = new Uint8Array(await f.arrayBuffer())
            const manager = s3.upload({
                Body: Buffer.from(buf as any, "binary"),
                Bucket: "main",
                Key:id,
                ContentType: f.type,
                ContentLength: f.size,
                Metadata: {
                    iv: ivs[index],
                    id
                }
            })
            manager.on("httpUploadProgress", ({loaded, total}) => {
                // send SSE event
                const percent = Math.round((loaded / total) * 100)
                const message = `Uploading ${f.name} (${formatBytes(loaded)} of ${formatBytes(total)}) - ${percent}%`
                console.log(message)
            })

            await manager.promise()

            await db.insert(file).values({
                id,
                userId: user,
                fileName: f.name,
                extension: f.name.split(".").pop() ?? "none",
                size: f.size,
                iv: ivs[index],
                createdAt: new Date(),
            })

            return id
        })
    )

    return NextResponse.json({
        error: false,
        message: "Files uploaded"
    })

}