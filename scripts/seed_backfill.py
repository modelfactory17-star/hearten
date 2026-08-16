#!/usr/bin/env python3
"""Hearten backfill — insert 6 months of seeded posts + replies with backdated created_at.
Reads content.json (list of posts) and inserts into Supabase directly via REST.
"""
import json, urllib.request, ssl, time, random, re, sys, os
from datetime import datetime, timedelta, timezone

URL = "https://wkeiuxuoiorlsckqehtt.supabase.co"
KEY = os.environ.get("SUPABASE_SERVICE_ROLE_KEY", "")
HKT = timezone(timedelta(hours=8))

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

CATEGORIES = {
    'dating-life': ('💑', '戀愛日常'),
    'crush': ('💕', '暗戀表白'),
    'breakup': ('💔', '分手復合'),
    'marriage': ('💍', '婚姻關係'),
    'lgbtq': ('🌈', 'LGBTQ+'),
    'treehole': ('🌳', '心靈樹窿'),
    'tarot': ('🃏', '塔羅占卜'),
    'work': ('💼', '在職戀愛'),
    'school': ('🎓', '在學戀愛'),
    'family': ('👨‍👩‍👧', '家庭關係'),
    'dating': ('📋', '交友配套'),
    'bedroom': ('🔞', '一知半解'),
}

def supabase(path, method="GET", body=None):
    headers = {"apikey": KEY, "Authorization": "Bearer " + KEY, "Content-Type": "application/json"}
    if method in ("POST", "PATCH"):
        headers["Prefer"] = "return=representation"
    req = urllib.request.Request(URL + path, method=method, headers=headers,
                                 data=json.dumps(body).encode() if body else None)
    r = urllib.request.urlopen(req, timeout=30, context=ctx)
    return json.loads(r.read())

def generate_slug(title):
    base = re.sub(r'[^\w\u4e00-\u9fff\s-]', '', title)
    base = re.sub(r'\s+', '-', base)
    base = re.sub(r'-+', '-', base).strip('-')[:30].rstrip('-')
    suffix = ''.join(random.choices('abcdefghijklmnopqrstuvwxyz0123456789', k=6))
    return f"{base}-{suffix}"

def main():
    with open('content.json', 'r', encoding='utf-8') as f:
        posts = json.load(f)

    profiles = supabase("/rest/v1/profiles?select=id,username")
    username_to_id = {p["username"]: p["id"] for p in profiles}

    start = datetime(2026, 2, 16, tzinfo=HKT)
    end = datetime(2026, 8, 16, tzinfo=HKT)
    span = (end - start).total_seconds()
    total = len(posts)

    created_posts = created_comments = 0

    for i, post in enumerate(posts):
        frac = (i + 0.5) / total
        post_dt = start + timedelta(seconds=span * frac)
        post_dt = post_dt.replace(hour=random.randint(9, 22), minute=random.randint(0, 59))

        author_id = username_to_id.get(post["author"])
        if not author_id:
            print(f"SKIP author not found: {post['author']}")
            continue

        cat_emoji, cat_name = CATEGORIES[post["category_id"]]
        replies = post.get("replies", [])
        preview = post["body"][:120] + ("..." if len(post["body"]) > 120 else "")

        post_body = {
            "user_id": author_id,
            "title": post["title"],
            "body": post["body"],
            "preview": preview,
            "slug": generate_slug(post["title"]),
            "category": f"{cat_emoji} {cat_name}",
            "category_id": post["category_id"],
            "hearts": random.randint(3, 55),
            "replies": len(replies),
            "created_at": post_dt.isoformat(),
        }
        result = supabase("/rest/v1/posts", "POST", post_body)
        post_id = result[0]["id"] if isinstance(result, list) else result.get("id")
        created_posts += 1

        for r, reply in enumerate(replies):
            reply_author = username_to_id.get(reply["author"])
            if not reply_author:
                continue
            reply_dt = post_dt + timedelta(hours=random.randint(1, 40), minutes=random.randint(0, 59))
            supabase("/rest/v1/comments", "POST", {
                "post_id": post_id,
                "user_id": reply_author,
                "body": reply["body"],
                "created_at": reply_dt.isoformat(),
            })
            created_comments += 1

        if (i + 1) % 20 == 0:
            print(f"  ...{i + 1}/{total} done", flush=True)

    print(f"\n✅ Backfill complete: {created_posts} posts, {created_comments} comments")

if __name__ == "__main__":
    main()
