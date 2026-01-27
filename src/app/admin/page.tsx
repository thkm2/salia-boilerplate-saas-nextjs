import { redirect } from "next/navigation";

export default function redirectAdmin() {
	return redirect("/admin/dashboard");
}
