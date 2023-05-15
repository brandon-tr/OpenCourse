import { redirect } from "next/navigation";

export default function CheckError(e: any) {
  if (e?.digest.includes("NEXT_REDIRECT")) {
    return redirect(e.digest.split(";")[2]);
  }
}