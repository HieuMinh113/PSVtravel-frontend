"use client";
import { useState } from "react";
import { Mail, ArrowRight, CheckCircle2 } from "lucide-react";
import { subscribeEmail } from "@/app/lib/api";

export default function Newsletter({ source = "trang-chu" }) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState("idle"); // idle | loading | done | error
  const [msg, setMsg] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) {
      setState("error");
      setMsg("Email không hợp lệ, vui lòng kiểm tra lại.");
      return;
    }
    setState("loading");
    setMsg("");
    try {
      await subscribeEmail(email.trim(), source);
      setState("done");
    } catch (err) {
      setState("error");
      setMsg(err.message);
    }
  };

  if (state === "done") {
    return (
      <div className="flex items-center justify-center gap-2 rounded-full bg-white/15 px-5 py-3 text-sm font-semibold text-white backdrop-blur">
        <CheckCircle2 className="h-5 w-5 text-teal-300" /> Cảm ơn bạn! Chúng tôi sẽ gửi ưu đãi mới nhất qua email.
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ocean-400" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Nhập email của bạn"
            autoComplete="email"
            className="w-full rounded-full border border-white/20 bg-white/95 py-3 pl-11 pr-4 text-sm text-deep-900 outline-none transition focus:border-white"
          />
        </div>
        <button
          type="submit"
          disabled={state === "loading"}
          className="btn-cta shrink-0 !px-6 !py-3 text-sm disabled:opacity-60"
        >
          {state === "loading" ? "Đang gửi..." : <>Đăng ký <ArrowRight className="h-4 w-4" /></>}
        </button>
      </form>
      {state === "error" && <p className="mt-2 text-xs font-medium text-gold-300">{msg}</p>}
    </div>
  );
}
