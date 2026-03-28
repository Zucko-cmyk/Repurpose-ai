import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase-server";

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Brak ID generowania." }, { status: 400 });
    }

    const supabase = await createAdminClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Wymagane logowanie." }, { status: 401 });
    }

    const { error } = await supabase
      .from("generations")
      .delete()
      .eq("id", id)
      .eq("user_id", user.id);

    if (error) {
      console.error("Delete generation error:", error);
      return NextResponse.json({ error: "Błąd podczas usuwania." }, { status: 500 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("Delete generation error:", err);
    return NextResponse.json({ error: "Błąd serwera." }, { status: 500 });
  }
}
