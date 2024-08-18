"use client"

import {DownloadIcon} from "@radix-ui/react-icons";
import {Button} from "@/components/ui/button";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog";
import {useState} from "react";
import RecoverKeyDialog from "@/components/recover-key";
import {toast} from "sonner";

export default function DownloadButton({url, iv, name}: { iv: string, name: string, url: string }) {
    const [recover, setRecover] = useState(false)
    const download = () => {
        console.log(url)
        fetch(url).then(response => response.blob()).then(async blob => {
            const keyHex = localStorage.getItem("key")

            if (!keyHex) {
                setRecover(true)
                return
            }
            // Convert hex string back to ArrayBuffer
            const keyBuffer = new Uint8Array(keyHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16))).buffer;


            const imported = await crypto.subtle.importKey(
                'raw',
                keyBuffer,
                {name: 'AES-GCM'},
                false,
                ['decrypt']
            );

            try {
                const decrypted = await crypto.subtle.decrypt(
                    {
                        name: 'AES-GCM',
                        iv: new Uint8Array(iv.split(",").map(Number)),
                    },
                    imported,
                    await blob.arrayBuffer(),
                );
                const f = new File([new Uint8Array(decrypted)], name)
                const url = URL.createObjectURL(f)
                const link = document.createElement('a')
                link.href = url
                link.download = name
                link.click()

            } catch {
                toast.error("Decryption failed", {
                    description: "Probably because you have the wrong key..."
                })
            }


        })
    }
    return (
        <>
            {recover && (
                <RecoverKeyDialog openByDefault={true} setOpeny={setRecover} />
            )}
            <Button onClick={download} variant="outline" size="sm" className="mt-2 sm:mt-0">
                <DownloadIcon className="w-4 h-4 mr-2"/>
                Download
            </Button>
        </>
    )
}