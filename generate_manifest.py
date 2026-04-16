#!/usr/bin/env python3
"""
generate_manifest.py
────────────────────
Run this script locally (or in GitHub Actions) to rebuild
_data/posts.json and _data/projects.json from your markdown files.

Usage:
  python generate_manifest.py

Place this file at the repo root and run it whenever you add new posts/projects.
Or set up a GitHub Action to run it automatically on push.
"""

import os, re, json
from datetime import datetime

def parse_frontmatter(text):
    """Extract YAML front matter as a dict (very simple parser)."""
    match = re.match(r'^---\s*\n(.*?)\n---\s*\n', text, re.DOTALL)
    if not match:
        return {}, text
    fm_text = match.group(1)
    content = text[match.end():]
    data = {}
    for line in fm_text.splitlines():
        m = re.match(r'^(\w[\w\-]*)\s*:\s*(.*)', line)
        if m:
            key, val = m.group(1), m.group(2).strip()
            # handle lists like [a, b, c]
            if val.startswith('[') and val.endswith(']'):
                val = [v.strip().strip('"\'') for v in val[1:-1].split(',') if v.strip()]
            else:
                val = val.strip('"\'')
            data[key] = val
    return data, content

def excerpt(content, length=160):
    """Generate a plain-text excerpt from markdown."""
    text = re.sub(r'!\[.*?\]\(.*?\)', '', content)  # remove images
    text = re.sub(r'\[([^\]]+)\]\([^\)]+\)', r'\1', text)  # links → text
    text = re.sub(r'[#*`>_~]', '', text)  # remove markdown symbols
    text = re.sub(r'\n+', ' ', text).strip()
    return text[:length] + ('…' if len(text) > length else '')

def process_posts():
    posts = []
    posts_dir = '_posts'
    if not os.path.isdir(posts_dir):
        print(f"'{posts_dir}' directory not found, skipping posts.")
        return posts

    for fname in sorted(os.listdir(posts_dir), reverse=True):
        if not fname.endswith('.md'):
            continue
        path = os.path.join(posts_dir, fname)
        with open(path, encoding='utf-8') as f:
            text = f.read()

        fm, content = parse_frontmatter(text)
        if not fm.get('title'):
            continue

        # slug from filename: YYYY-MM-DD-title.md → title
        slug = re.sub(r'^\d{4}-\d{2}-\d{2}-', '', fname[:-3])

        # date from front matter or filename
        date = fm.get('date', '')
        if not date:
            m = re.match(r'^(\d{4}-\d{2}-\d{2})', fname)
            date = m.group(1) if m else ''

        cats = fm.get('categories', [])
        if isinstance(cats, str): cats = [cats]
        tags = fm.get('tags', [])
        if isinstance(tags, str): tags = [tags]

        posts.append({
            'slug': slug,
            'title': fm['title'],
            'date': date,
            'categories': cats,
            'tags': tags,
            'excerpt': excerpt(content),
            'path': path.replace(os.sep, '/')
        })

    return posts

def process_projects():
    projects = []
    proj_dir = '_projects'
    if not os.path.isdir(proj_dir):
        print(f"'{proj_dir}' directory not found, skipping projects.")
        return projects

    for fname in sorted(os.listdir(proj_dir), reverse=True):
        if not fname.endswith('.md'):
            continue
        path = os.path.join(proj_dir, fname)
        with open(path, encoding='utf-8') as f:
            text = f.read()

        fm, content = parse_frontmatter(text)
        if not fm.get('title'):
            continue

        slug = fname[:-3]
        tags = fm.get('tags', [])
        if isinstance(tags, str): tags = [tags]

        projects.append({
            'slug': slug,
            'title': fm['title'],
            'date': fm.get('date', ''),
            'description': fm.get('description', excerpt(content, 120)),
            'image': fm.get('image', ''),
            'stack': fm.get('stack', ''),
            'github': fm.get('github', ''),
            'demo': fm.get('demo', ''),
            'tags': tags,
            'path': path.replace(os.sep, '/')
        })

    return projects

def main():
    os.makedirs('_data', exist_ok=True)

    posts = process_posts()
    projects = process_projects()

    with open('_data/posts.json', 'w', encoding='utf-8') as f:
        json.dump(posts, f, ensure_ascii=False, indent=2)
    print(f'✓ _data/posts.json — {len(posts)} posts')

    with open('_data/projects.json', 'w', encoding='utf-8') as f:
        json.dump(projects, f, ensure_ascii=False, indent=2)
    print(f'✓ _data/projects.json — {len(projects)} projects')

if __name__ == '__main__':
    main()
