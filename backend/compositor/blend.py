import numpy as np
from PIL import Image

def blend_channel_vectorized(bottom, top, mode):
    if mode == 'normal':
        return top
    elif mode == 'mult':
        return (bottom.astype(np.uint16) * top.astype(np.uint16) // 255).astype(np.uint8)
    elif mode == 'divide':
        with np.errstate(divide='ignore', invalid='ignore'):
            result = np.divide(255 * bottom, top, out=np.zeros_like(bottom, dtype=np.float32), where=top != 0)
        return np.clip(result, 0, 255).astype(np.uint8)
    elif mode == 'sum':
        return np.clip(bottom.astype(np.uint16) + top.astype(np.uint16), 0, 255).astype(np.uint8)
    elif mode == 'sub':
        return np.clip(bottom.astype(np.int16) - top.astype(np.int16), 0, 255).astype(np.uint8)
    elif mode == 'max':
        return np.maximum(bottom, top)
    elif mode == 'geom':
        return np.sqrt(bottom.astype(np.float32) * top.astype(np.float32)).astype(np.uint8)
    elif mode == 'sr':
        return ((bottom.astype(np.uint16) + top.astype(np.uint16)) // 2).astype(np.uint8)
    else:
        return top

def blend_layer(result, img, mode, opacity, off_x, off_y, channels=None):
    result_arr = np.array(result, dtype=np.uint8)
    img_arr = np.array(img, dtype=np.uint8)

    h, w = img_arr.shape[:2]

    dst_x, dst_y = off_x, off_y
    src_x, src_y = 0, 0

    if dst_x < 0:
        src_x = -dst_x
        dst_x = 0
    if dst_y < 0:
        src_y = -dst_y
        dst_y = 0

    visible_w = min(w - src_x, result.width - dst_x)
    visible_h = min(h - src_y, result.height - dst_y)

    if visible_w <= 0 or visible_h <= 0:
        return result

    result_slice = result_arr[dst_y:dst_y + visible_h, dst_x:dst_x + visible_w]
    img_slice = img_arr[src_y:src_y + visible_h, src_x:src_x + visible_w]

    has_content = (result_slice[..., 3] > 0) 

    new_rgb = result_slice[..., :3].copy()
    new_a = result_slice[..., 3].copy()

    if channels is None:
        channels = {'r': True, 'g': True, 'b': True}

    if channels['r']:
        blended = np.where(
            has_content,
            blend_channel_vectorized(result_slice[..., 0], img_slice[..., 0], mode),
            img_slice[..., 0]
        )
        new_r = (blended * opacity + result_slice[..., 0] * (1 - opacity)).astype(np.uint8)
        new_rgb[..., 0] = new_r

    if channels['g']:
        blended = np.where(
            has_content,
            blend_channel_vectorized(result_slice[..., 1], img_slice[..., 1], mode),
            img_slice[..., 1]
        )
        new_g = (blended * opacity + result_slice[..., 1] * (1 - opacity)).astype(np.uint8)
        new_rgb[..., 1] = new_g

    if channels['b']:
        blended = np.where(
            has_content,
            blend_channel_vectorized(result_slice[..., 2], img_slice[..., 2], mode),
            img_slice[..., 2]
        )
        new_b = (blended * opacity + result_slice[..., 2] * (1 - opacity)).astype(np.uint8)
        new_rgb[..., 2] = new_b

    blended_a = np.where(
        has_content,
        blend_channel_vectorized(result_slice[..., 3], img_slice[..., 3], mode),
        img_slice[..., 3]
    )
    new_a = (blended_a * opacity + result_slice[..., 3] * (1 - opacity)).astype(np.uint8)

    new_pixels = np.dstack((new_rgb, new_a))

    result_arr[dst_y:dst_y + visible_h, dst_x:dst_x + visible_w] = new_pixels

    return Image.fromarray(result_arr, 'RGBA')