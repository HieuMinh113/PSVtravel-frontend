"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Thay thế NavLink của react-router: hỗ trợ className và children dạng hàm nhận { isActive }
export default function NavLink({ href, end = false, className, children, ...rest }) {
  const pathname = usePathname();
  const isActive = end ? pathname === href : pathname === href || pathname.startsWith(href + "/");
  const cls = typeof className === "function" ? className({ isActive }) : className;
  return (
    <Link href={href} className={cls} {...rest}>
      {typeof children === "function" ? children({ isActive }) : children}
    </Link>
  );
}
