"use client"
import * as bip from 'bip39'
import {
    Dialog, DialogClose,
    DialogContent,
    DialogDescription, DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {UploadCloudIcon} from "lucide-react";
import {CopyIcon, UploadIcon} from "@radix-ui/react-icons";
import {FileUploader} from "@/components/file-upload";
import {Combobox} from "@/components/ui/combo";
import {useEffect, useState} from "react";
import {Label} from "@/components/ui/label";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Separator} from "@/components/ui/separator";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import RecoverKeyDialog from "@/components/recover-key";


export default function UploadDialog() {
    const [key, setKey] = useState<string>()
    const [open, setOpen] = useState(false)
    const [mainOpen, setMainOpen] = useState(false)
    const [files, setFiles] = useState<File[]>()
    const [loading, setLoading] = useState(false)
    const [generatedMnemonic, setGeneratedMnemonic] = useState("")
    useEffect(() => {
        if (localStorage.getItem("key") !== null) {
            setKey(localStorage.getItem("key") as string)
        }
    }, []);


    const router = useRouter()
    const generateKey = async (generatedMnemonic: string) => {
        const entropy = bip.mnemonicToEntropy(generatedMnemonic)
        const encoder = new TextEncoder();
        const entropyBuffer = encoder.encode(entropy);

        // Derive a key from the entropy
        const keyMaterial = await crypto.subtle.digest('SHA-256', entropyBuffer);

        // Import the key material to a usable CryptoKey
        const key = await crypto.subtle.importKey(
            'raw',
            keyMaterial,
            {name: 'AES-GCM'},
            true,
            ['encrypt', 'decrypt']
        );
        // put it as base64
        const exportedKey = await crypto.subtle.exportKey('raw', key);
        const keyHex = Array.from(new Uint8Array(exportedKey))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');

        setKey(keyHex)
        localStorage.setItem("key", keyHex)
    }

    const encryptFiles = async () => {
        setLoading(true)
        if (!key || !files) return
        const keyHex = localStorage.getItem('key');

        if (!keyHex) {
            throw new Error('Encryption key not found in localStorage');
        }

        // Convert hex string back to ArrayBuffer
        const keyBuffer = new Uint8Array(keyHex.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16))).buffer;


        const imported = await crypto.subtle.importKey(
            'raw',
            keyBuffer,
            {name: 'AES-GCM'},
            false,
            ['encrypt']
        );

        const formData = new FormData()
        await Promise.all(files.map(async (file) => {
            // generate iv
            const iv = crypto.getRandomValues(new Uint8Array(12))
            // get array buffer
            const reader = new FileReader()

            await new Promise<void>((resolve) => {
                reader.onload = async () => {
                    const fileBuffer = reader.result as ArrayBuffer
                    const encrypted = await crypto.subtle.encrypt(
                        {
                            name: 'AES-GCM',
                            iv: iv
                        },
                        imported,
                        fileBuffer
                    );
                    // make sure it's a buffer with "binary"


                    // put it in a blob
                    const blob = new Blob([encrypted], {type: file.type})
                    // now in a file
                    const newFile = new File([blob], file.name, {type: file.type})
                    formData.append("file", newFile)
                    console.log(formData.get("file"))
                    formData.append("iv", iv.toString())
                    resolve()
                }
                reader.readAsArrayBuffer(file)
            })
        }))

        const response = await fetch("/api/upload", {
            body: formData,
            method: "POST",
        })
        if (response.ok) {
            toast.success("Files uploaded successfully")
            router.refresh()
        }

        setLoading(false)
        setFiles(undefined)
        setMainOpen(false)

    }
    return (
        <Dialog open={mainOpen} onOpenChange={setMainOpen}>
            <DialogTrigger asChild>
                <Button variant={"expandIcon"} iconPlacement={"left"} Icon={UploadIcon}>Upload</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Upload Files</DialogTitle>
                    <DialogDescription>Your files are encrypted locally before they are sent to our servers. Don't
                        worry, your encryption key is also stored on your device.</DialogDescription>
                </DialogHeader>
                <div className={"flex flex-col gap-4"}>
                    <Label className={"font-bold"}>Files <span className={"text-red-600"}>*</span></Label>
                    <FileUploader value={files} onValueChange={setFiles} accept={{
                        "*/*": [],
                    }} maxFileCount={5} maxSize={1024 * 1024 * 50}/>
                </div>
                {!key && (
                    <div className={"flex flex-col gap-4"}>
                        <Label className={"font-bold"}>Encryption Key <span className={"text-red-600"}>*</span></Label>
                        <div className={"w-full flex flex-row gap-2"}>
                            <Button variant={"outline"} className={"w-full"} onClick={() => {
                                const mnemonic = bip.generateMnemonic()
                                setGeneratedMnemonic(mnemonic)
                                setOpen(true)
                            }}>New Key</Button>
                            <RecoverKeyDialog setKey={setKey}/>
                        </div>
                        <Dialog open={open} onOpenChange={setOpen}>
                            <DialogContent className={"w-max-[600px]"} >
                                <DialogHeader>
                                    <DialogTitle>Save this mnemonic phrase, somewhere safe.</DialogTitle>
                                    <DialogDescription>Write it in a paper or something</DialogDescription>
                                </DialogHeader>
                                <div className={"flex flex-col gap-4"}>
                                    <code className={"relative text-sm font-mono p-4 border rounded-lg w-full"}>
                                        <p className={"font-bold text-blue-600 w-[80%]"}>{generatedMnemonic}</p>
                                        <Button variant={"outline"} size={"icon"} onClick={async () => {
                                            await navigator.clipboard.writeText(generatedMnemonic)
                                            toast.success("Copied to clipboard")
                                        }}
                                                className={"absolute right-1 bottom-1"}><CopyIcon/></Button>
                                    </code>
                                </div>
                                <DialogFooter>
                                    <Button onClick={() => generateKey(generatedMnemonic)}>Okay, Done</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                    </div>
                )}
                <Separator/>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant={"outline"}>Cancel</Button>
                    </DialogClose>
                    <Button  className={"w-full mb-2"} onClick={encryptFiles} disabled={!key || !files || !files.length || loading}>Submit</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}