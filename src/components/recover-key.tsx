import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";
import {Button} from "@/components/ui/button";
import {Label} from "@/components/ui/label";
import * as bip from "bip39";
import {Textarea} from "@/components/ui/textarea";
import {useState} from "react";
import {toast} from "sonner";

export default function RecoverKeyDialog({setKey, openByDefault, setOpeny}: {
    setKey?: (key: string) => void,
    setOpeny?: (open: boolean) => void,
    openByDefault?: boolean
}) {
    const [mnemonic, setMnemonic] = useState<string>("")
    const [open, setOpen] = useState(openByDefault ?? false)
    const generateKey = async (generatedMnemonic: string) => {
        const isValid = bip.validateMnemonic(generatedMnemonic)
        if (!isValid) {
            toast.error("Invalid mnemonic")
            return
        }

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

        if (setKey) setKey(keyHex!)
        localStorage.setItem("key", keyHex)
        setOpen(false)
        if (setOpeny) setOpeny(false)
    }
    return (
        <Dialog onOpenChange={(v) => {
            setOpen(v)
            if (setOpeny) setOpeny(v)
        }} open={open}>
            {!openByDefault && <DialogTrigger asChild>
                <Button className={"w-full"}>Recover Key</Button>
            </DialogTrigger>}
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Recover Key</DialogTitle>
                    <DialogDescription>Recover your key by mnemonic phrase</DialogDescription>
                </DialogHeader>
                <div className={"flex flex-col gap-4"}>
                    <Label className={"font-bold"}>Key <span className={"text-red-600"}>*</span></Label>
                    <Textarea className={"p-4"} placeholder={"Mnemonic Phrase"}
                              onChange={mnemonic => setMnemonic(mnemonic.target.value)}/>
                </div>
                <DialogHeader>
                    <Button onClick={() => generateKey(mnemonic)}>Recover</Button>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}