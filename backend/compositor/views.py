import base64
import io
from PIL import Image
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .blend import blend_layer
import time

@api_view(['POST'])
def composite(request):
    start = time.time()
    try:
        data = request.data
        layers = data.get('layers', [])
        if not layers:
            return Response({'image': ''})

        max_w, max_h = 0, 0
        imgs = []

        for layer in layers:
            img_data = layer['image']
            if ',' in img_data:
                img_data = img_data.split(',')[1]
            img_bytes = base64.b64decode(img_data)
            img = Image.open(io.BytesIO(img_bytes)).convert('RGBA')
            w, h = img.size
            off_x = layer.get('offsetX')
            off_y = layer.get('offsetY')
            max_w = max(max_w, w)
            max_h = max(max_h, h)
            stretch = layer.get('stretch', False)
            channels = layer.get('channels', {'r': True, 'g': True, 'b': True})
            imgs.append((img, layer['opacity'], layer['blendMode'], off_x, off_y, stretch, channels))

        if max_w == 0 or max_h == 0:
            return Response({'image': ''})

        result = Image.new('RGBA', (max_w, max_h), (0, 0, 0, 0))

        processed_imgs = []
        for img, opacity, mode, off_x, off_y, stretch, channels in imgs:
            if stretch and (img.width < max_w or img.height < max_h):
                img = img.resize((max_w, max_h), Image.Resampling.LANCZOS)
                off_x, off_y = 0, 0
            processed_imgs.append((img, opacity, mode, off_x, off_y, channels))

        for img, opacity, mode, off_x, off_y, channels in processed_imgs:
            result = blend_layer(result, img, mode, opacity, off_x, off_y, channels)

        buffered = io.BytesIO()
        result.save(buffered, format='PNG')
        img_base64 = base64.b64encode(buffered.getvalue()).decode()
        return Response({'image': f'data:image/png;base64,{img_base64}'})

    except Exception as e:
        print("Error in composite:", e)
        return Response({'error': str(e)}, status=500)
    
    print(f"Composite time: {time.time()-start:.2f}s")