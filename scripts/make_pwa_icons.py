"""从 assets/app-icon.png 生成 PWA / iOS 主屏图标。

源图是一张 1024x1024、透明底的方形立绘。iOS 的 apple-touch-icon 不接受透明
(会把透明像素压成黑边),所以这里统一把立绘合成到实底背景上再输出。

输出到 umalator/public/(会被 vite 原样拷进 dist/):
  icon-192.png / icon-512.png   any 用途,Android / 桌面
  icon-maskable-512.png         maskable 用途,留出安全区,免得被圆形遮罩切到
  apple-touch-icon.png          180x180,iOS「添加到主屏幕」

用法: uv run --with pillow python scripts/make_pwa_icons.py
"""

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "umalator" / "public"
SOURCE = ROOT / "assets" / "app-icon.png"

# 立绘透明部分的填充底色,取应用主题的 --uma-bg,和 manifest 的 background_color 一致
BG = (253, 246, 240, 255)  # #fdf6f0

# (文件名, 边长, 立绘占画布的比例)
OUTPUTS = [
    ("icon-192.png", 192, 0.94),
    ("icon-512.png", 512, 0.94),
    ("icon-maskable-512.png", 512, 0.72),  # maskable 安全区:内容落在中心 80% 圆内
    ("apple-touch-icon.png", 180, 0.94),
]


def render(art, size, fill_ratio):
    inner = max(1, round(size * fill_ratio))
    scale = min(inner / art.width, inner / art.height)
    scaled = art.resize(
        (max(1, round(art.width * scale)), max(1, round(art.height * scale))),
        Image.LANCZOS,
    )
    canvas = Image.new("RGBA", (size, size), BG)
    canvas.alpha_composite(
        scaled, ((size - scaled.width) // 2, (size - scaled.height) // 2)
    )
    return canvas.convert("RGB")  # 去掉 alpha:apple-touch-icon 要实底


def main():
    art = Image.open(SOURCE).convert("RGBA")
    print(f"源图 {SOURCE.relative_to(ROOT)} {art.size}")
    for name, size, fill in OUTPUTS:
        render(art, size, fill).save(PUBLIC / name, optimize=True)
        print(f"  -> umalator/public/{name}  {size}x{size}")


if __name__ == "__main__":
    main()
