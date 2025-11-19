import { env } from "@/lib/env";

export default function GoogleTagManagerNoScript() {
  const GTM_ID = env.NEXT_PUBLIC_GTM_ID;

  return (
    <noscript>
      <iframe
        src={`https://serverstape.prakrito.com/ns.html?id=${GTM_ID}`}
        height="0"
        width="0"
        style={{ display: "none", visibility: "hidden" }}
      />
    </noscript>
  );
}
