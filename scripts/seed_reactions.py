#!/usr/bin/env python3
"""Hearten reactions seeding — 預設 AC 俾適度心心/支持/豬豬（稀疏版）。

- 心心 40% / mood 15%（稀疏，部分 post 0、部分 1、少數 2）
- idempotent：跳過已經有 reaction 嘅 post（每日 cron 安全重跑）
- --reset：先刪除 preset AC 之前加嘅 reaction，再重新 seed
"""
import json, urllib.request, ssl, random, os, sys

URL = "https://wkeiuxuoiorlsckqehtt.supabase.co"
KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")

HEART_RATE = 0.40   # 心心 (like)
MOOD_RATE = 0.15    # 支持/豬豬 (mood)

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

def supabase(path, method="GET", body=None):
    headers = {"apikey": KEY, "Authorization": "Bearer " + KEY, "Content-Type": "application/json"}
    if method in ("POST", "PATCH"):
        headers["Prefer"] = "return=representation"
    req = urllib.request.Request(URL + path, method=method, headers=headers,
                                 data=json.dumps(body).encode() if body else None)
    r = urllib.request.urlopen(req, timeout=30, context=ctx)
    raw = r.read()
    return json.loads(raw) if raw else []

def main():
    if not KEY:
        print("Set SUPABASE_SERVICE_ROLE_KEY env var"); sys.exit(1)
    reset = "--reset" in sys.argv

    presets = supabase("/rest/v1/profiles?select=id,username&account_type=eq.preset")
    preset_ids = [p["id"] for p in presets]
    print(f"presets: {len(preset_ids)}")

    if reset:
        ids_csv = ",".join(preset_ids)
        supabase(f"/rest/v1/likes?user_id=in.({ids_csv})&target_type=eq.post", "DELETE")
        supabase(f"/rest/v1/post_moods?user_id=in.({ids_csv})", "DELETE")
        print("reset: deleted preset post reactions")

    posts = supabase("/rest/v1/posts?select=id,user_id")
    existing_likes = supabase("/rest/v1/likes?select=target_id&target_type=eq.post")
    existing_moods = supabase("/rest/v1/post_moods?select=post_id")
    reacted = set(l["target_id"] for l in existing_likes) | set(m["post_id"] for m in existing_moods)

    hearts_added = moods_added = 0
    for post in posts:
        pid = post["id"]
        if pid in reacted:
            continue  # 已有 reaction，跳過（idempotent）
        candidates = [x for x in preset_ids if x != post["user_id"]]
        if not candidates:
            continue

        heart_giver = None
        if random.random() < HEART_RATE:
            heart_giver = random.choice(candidates)
            supabase("/rest/v1/likes", "POST",
                     {"user_id": heart_giver, "target_type": "post", "target_id": pid})
            hearts_added += 1

        if random.random() < MOOD_RATE:
            mc = [c for c in candidates if c != heart_giver] or candidates
            supabase("/rest/v1/post_moods", "POST",
                     {"post_id": pid, "user_id": random.choice(mc),
                      "mood": random.choice(["support", "pig"])})
            moods_added += 1

    # sync posts.hearts 同 likes 表一致
    likes = supabase("/rest/v1/likes?select=target_id&target_type=eq.post")
    counts = {}
    for l in likes:
        counts[l["target_id"]] = counts.get(l["target_id"], 0) + 1
    for post in posts:
        supabase(f"/rest/v1/posts?id=eq.{post['id']}", "PATCH",
                 {"hearts": counts.get(post["id"], 0)})

    print(f"✅ hearts added: {hearts_added}, moods added: {moods_added}, posts.hearts synced")

if __name__ == "__main__":
    main()
